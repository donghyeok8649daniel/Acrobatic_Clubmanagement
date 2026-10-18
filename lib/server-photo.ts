import type {TeamState} from './domain';
import {database} from './server-team';
// Keep the image and its team-state revision in the same D1 transaction.
export async function storeProfilePhoto(team:string,memberId:string,bytes:ArrayBuffer|null){
 const db=database();
 for(let attempt=0;attempt<5;attempt++){
  const row=await db.prepare('SELECT state,version FROM teams WHERE id=?').bind(team).first<{state:string;version:number}>();
  if(!row)throw Error('팀이 없습니다.');
  const state:TeamState=JSON.parse(row.state),member=state.members.find(v=>v.id===memberId);
  if(!member)throw Error('팀원이 없습니다.');
  const revision=crypto.randomUUID();
  if(bytes)member.photoRevision=revision;else delete member.photoRevision;
  const next=JSON.stringify(state);
  if(next.length>750000)throw Error('팀 기록 용량을 초과했습니다.');
  const photo=bytes?db.prepare('INSERT INTO member_photos(team,member,bytes,revision) SELECT ?,?,?,? WHERE EXISTS(SELECT 1 FROM teams WHERE id=? AND version=? AND state=?) ON CONFLICT(team,member) DO UPDATE SET bytes=excluded.bytes,revision=excluded.revision').bind(team,memberId,bytes,revision,team,row.version+1,next):db.prepare('DELETE FROM member_photos WHERE team=? AND member=? AND EXISTS(SELECT 1 FROM teams WHERE id=? AND version=? AND state=?)').bind(team,memberId,team,row.version+1,next);
  const results=await db.batch([db.prepare('UPDATE teams SET state=?,version=version+1 WHERE id=? AND version=?').bind(next,team,row.version),photo]);
  if(results[0].meta.changes)return {state,revision:bytes?revision:null};
 }
 throw Error('다른 팀원이 수정 중입니다. 다시 시도해주세요.');
}

import {env} from 'cloudflare:workers';
import {initialState,TeamState} from '../../../lib/domain';
import {mutate} from '../../../lib/mutations';
export const dynamic='force-dynamic';
const db=()=>{if(!env.DB)throw Error('데이터베이스가 연결되지 않았습니다.');return env.DB;};
const digest=async(s:string)=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)))).map(b=>b.toString(16).padStart(2,'0')).join('');
const random=()=>Array.from(crypto.getRandomValues(new Uint8Array(9))).map(b=>b.toString(16).padStart(2,'0')).join('').toUpperCase();
const json=(data:any,status=200,headers:Record<string,string>={})=>Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff',...headers}});
const cookie=(token:string,req:Request,clear=false)=>`courtin_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${clear?0:60*60*24*30}${new URL(req.url).protocol==='https:'?'; Secure':''}`;
async function session(req:Request){const token=req.headers.get('cookie')?.match(/(?:^|;\s*)courtin_session=([^;]+)/)?.[1];if(!token)return null;return await db().prepare('SELECT team, member FROM sessions WHERE hash = ? AND expires > ?').bind(await digest(token),Date.now()).first<{team:string;member:string}>();}
async function readTeam(id:string){return db().prepare('SELECT state,version FROM teams WHERE id=?').bind(id).first<{state:string;version:number}>();}
async function limited(req:Request,kind:string,max:number,windowMs:number){const now=Date.now();const key=await digest((req.headers.get('cf-connecting-ip')||'local')+kind+Math.floor(now/windowMs));const row=await db().prepare('INSERT INTO limits (id,count,expires) VALUES (?,1,?) ON CONFLICT(id) DO UPDATE SET count=count+1 RETURNING count').bind(key,now+windowMs).first<{count:number}>();if((row?.count||0)>max)throw Error('시도가 너무 많습니다. 잠시 후 다시 시도해주세요.');await db().prepare('DELETE FROM limits WHERE expires < ?').bind(now-windowMs).run();}
async function createSession(req:Request,team:string,member:string){const token=random()+random();await db().prepare('INSERT INTO sessions(hash,team,member,expires) VALUES (?,?,?,?)').bind(await digest(token),team,member,Date.now()+30*86400000).run();await db().prepare('DELETE FROM sessions WHERE expires < ?').bind(Date.now()).run();return cookie(token,req);}
export async function GET(req:Request){try{const auth=await session(req);if(!auth)return json({error:'로그인이 필요합니다.'},401);const row=await readTeam(auth.team);if(!row)return json({error:'팀이 없습니다.'},404);return json({state:JSON.parse(row.state),teamId:auth.team,memberId:auth.member,version:row.version});}catch{return json({error:'팀 정보를 불러오지 못했습니다.'},503);}}
export async function POST(req:Request){try{
 const origin=req.headers.get('origin');if(origin&&origin!==new URL(req.url).origin)return json({error:'허용되지 않는 요청입니다.'},403);
 if(!req.headers.get('content-type')?.includes('application/json'))return json({error:'잘못된 요청입니다.'},415);
 const raw=await req.text();if(raw.length>16000)return json({error:'입력이 너무 깁니다.'},413);const {action,payload:p={}}=JSON.parse(raw);
 if(action==='create'){
  await limited(req,'create',5,3600000);
  if(typeof p.name!=='string'||!p.name.trim()||p.name.length>40||typeof p.captain!=='string'||!p.captain.trim()||p.captain.length>30)throw Error('팀 이름과 동장 이름을 입력해주세요.');
  const teamId='ACRO-'+random().slice(0,8);const state=initialState(p.name.trim(),p.captain.trim());const codes=state.members.map(m=>({memberId:m.id,code:random()}));
  const inserts=await Promise.all(codes.map(async c=>db().prepare('INSERT INTO credentials(id,team,member,hash) VALUES (?,?,?,?)').bind(crypto.randomUUID(),teamId,c.memberId,await digest(teamId+':'+c.code))));
  await db().batch([db().prepare('INSERT INTO teams(id,state,version) VALUES (?,?,0)').bind(teamId,JSON.stringify(state)),...inserts]);
  return json({state,teamId,memberId:'m1',codes,version:0},200,{'Set-Cookie':await createSession(req,teamId,'m1')});
 }
 if(action==='login'){
  await limited(req,'login',20,900000);const teamId=String(p.teamId||'').trim().toUpperCase();const code=String(p.code||'').replace(/[\s-]/g,'').toUpperCase();
  if(teamId.length>60||code.length>80)throw Error('팀 ID와 입장코드를 확인해주세요.');
  const credential=await db().prepare('SELECT member FROM credentials WHERE team=? AND hash=?').bind(teamId,await digest(teamId+':'+code)).first<{member:string}>();
  if(!credential)return json({error:'팀 ID 또는 개인 입장코드가 올바르지 않습니다.'},401);
  const row=await readTeam(teamId);if(!row)throw Error('팀을 찾을 수 없습니다.');
  return json({state:JSON.parse(row.state),teamId,memberId:credential.member,version:row.version},200,{'Set-Cookie':await createSession(req,teamId,credential.member)});
 }
 const auth=await session(req);if(!auth)return json({error:'다시 로그인해주세요.'},401);
 if(action==='logout'){const token=req.headers.get('cookie')?.match(/(?:^|;\s*)courtin_session=([^;]+)/)?.[1];if(token)await db().prepare('DELETE FROM sessions WHERE hash=?').bind(await digest(token)).run();return json({ok:true},200,{'Set-Cookie':cookie('',req,true)});}
 if(action==='invite'){
  const row=await readTeam(auth.team);const state:TeamState=JSON.parse(row!.state);if(state.members.find(m=>m.id===auth.member)?.role!=='captain')return json({error:'동장만 초대코드를 발급할 수 있습니다.'},403);
  if(!state.members.some(m=>m.id===p.member))throw Error('팀원이 없습니다.');const code=random();
  await db().batch([db().prepare('DELETE FROM credentials WHERE team=? AND member=?').bind(auth.team,p.member),db().prepare('INSERT INTO credentials(id,team,member,hash) VALUES (?,?,?,?)').bind(crypto.randomUUID(),auth.team,p.member,await digest(auth.team+':'+code)),db().prepare('DELETE FROM sessions WHERE team=? AND member=?').bind(auth.team,p.member)]);
  return json({code},200,p.member===auth.member?{'Set-Cookie':await createSession(req,auth.team,auth.member)}:{});
 }
 for(let attempt=0;attempt<4;attempt++){
  const row=await readTeam(auth.team);if(!row)throw Error('팀이 없습니다.');const state=mutate(JSON.parse(row.state),auth.member,action,p);
  const result=await db().prepare('UPDATE teams SET state=?, version=version+1 WHERE id=? AND version=?').bind(JSON.stringify(state),auth.team,row.version).run();
  if(result.meta.changes)return json({state,teamId:auth.team,memberId:auth.member,version:row.version+1});
 }
 return json({error:'다른 팀원이 수정 중입니다. 다시 시도해주세요.'},409);
 }catch(e){return json({error:e instanceof Error&&!/D1|SQL|database|constraint/i.test(e.message)?e.message:'저장하지 못했습니다. 잠시 후 다시 시도해주세요.'},400);}}

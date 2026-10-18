'use client';
import {useEffect,useRef,useState} from 'react';
import {Camera,ShieldCheck,Trash2} from 'lucide-react';
import type {Member,TeamState} from '../lib/domain';
import {canLeadPosition,positionGroups} from '../lib/member-profile';
import {positionLabel,positionRank} from '../lib/positions';
import {MAX_PROFILE_PHOTO_BYTES} from '../lib/profile-photo';

export function Avatar({member,size=''}:{member:Member;size?:string}){
 const [failed,fail]=useState(false);useEffect(()=>fail(false),[member.id,member.photoRevision]);
 return <span className={'avatar '+size+' color-'+(Number(member.id.slice(1))%6)}>{member.photoRevision&&!failed?<img src={'/api/members/'+encodeURIComponent(member.id)+'/photo?v='+encodeURIComponent(member.photoRevision)} alt={member.name+' 프로필 사진'} loading="lazy" onError={()=>fail(true)}/>:member.name.slice(-2)}</span>;
}
async function preparePhoto(file:File){
 if(!file.type.startsWith('image/')||file.size===0||file.size>15*1024*1024)throw Error('15MB 이하의 사진 파일을 선택해주세요.');
 const url=URL.createObjectURL(file),image=new Image();
 try{
  await new Promise<void>((resolve,reject)=>{image.onload=()=>resolve();image.onerror=()=>reject(Error('사진을 읽지 못했어요. JPG·PNG·WebP 파일을 선택해주세요.'));image.src=url;});
  const canvas=document.createElement('canvas');canvas.width=512;canvas.height=512;
  const ctx=canvas.getContext('2d');if(!ctx)throw Error('이 기기에서 사진을 처리하지 못했습니다.');
  const side=Math.min(image.naturalWidth,image.naturalHeight);if(!side)throw Error('사진 크기를 확인해주세요.');
  ctx.fillStyle='#f1f4ed';ctx.fillRect(0,0,512,512);ctx.drawImage(image,(image.naturalWidth-side)/2,(image.naturalHeight-side)/2,side,side,0,0,512,512);
  for(const quality of [.88,.76,.64,.5]){
   const blob=await new Promise<Blob|null>(resolve=>canvas.toBlob(resolve,'image/jpeg',quality));
   if(blob&&blob.size<=MAX_PROFILE_PHOTO_BYTES)return blob;
  }
  throw Error('사진 용량을 줄이지 못했습니다. 다른 사진을 선택해주세요.');
 }finally{URL.revokeObjectURL(url);}
}
export function ProfilePhotoEditor({member,canEdit,demo,onRefresh,onNotify}:{member:Member;canEdit:boolean;demo:boolean;onRefresh:()=>Promise<void>;onNotify:(message:string)=>void}){
 const input=useRef<HTMLInputElement>(null);const [busy,B]=useState(false),[error,E]=useState(''),[confirm,C]=useState(false);
 async function request(file?:File){E('');B(true);try{
  const blob=file?await preparePhoto(file):undefined;
  const r=await fetch('/api/members/'+encodeURIComponent(member.id)+'/photo',{method:file?'PUT':'DELETE',...(blob?{headers:{'Content-Type':'image/jpeg'},body:blob}:{})});
  const data:any=await r.json();if(!r.ok)throw Error(data.error||'사진을 저장하지 못했습니다.');
  await onRefresh();C(false);onNotify(file?'프로필 사진을 등록했어요.':'프로필 사진을 삭제했어요.');
 }catch(error){E((error as Error).message);}finally{B(false);}}
 if(!canEdit)return null;
 return <section className="profile-photo-editor"><input ref={input} type="file" accept="image/*" aria-label="프로필 사진 파일" hidden disabled={busy||demo} onChange={e=>{const file=e.target.files?.[0];e.target.value='';if(file)void request(file);}}/><div className="photo-actions"><button className="btn secondary small" disabled={busy||demo} onClick={()=>input.current?.click()}><Camera size={15}/>{busy?'사진 저장 중…':member.photoRevision?'사진 변경':'사진 등록'}</button>{member.photoRevision&&<button className="text-btn danger" disabled={busy||demo} onClick={()=>C(true)}><Trash2 size={14}/>사진 삭제</button>}</div><p className="hint">{demo?'사진 등록은 실제 팀 로그인 후 사용할 수 있어요.':'사진 중앙을 정사각형으로 잘라 저장해요. 팀원에게 함께 표시됩니다.'}</p>{confirm&&<div className="photo-remove-confirm"><span>프로필 사진을 삭제할까요?</span><button className="text-btn" onClick={()=>C(false)} disabled={busy}>취소</button><button className="text-btn danger" onClick={()=>void request()} disabled={busy}>삭제</button></div>}{error&&<p className="modal-alert" role="alert">{error}</p>}</section>;
}
export function PositionLeaders({state,canEdit,busy,onSave}:{state:TeamState;canEdit:boolean;busy:boolean;onSave:(type:string,payload:any,close?:boolean)=>void}){
 return <section className="panel position-leaders"><div className="section-title"><div><h2>포지션별 팀장</h2><p>{canEdit?'주·세컨 포지션에 해당하는 선수를 지정하세요.':'공격수 · 세터 · 수비 파트의 팀장을 확인해요.'}</p></div><ShieldCheck size={21}/></div><div className="position-leader-grid">{positionGroups.map(group=>{
  const current=state.members.find(v=>v.id===state.positionLeaders?.[group.id]);const candidates=state.members.filter(v=>canLeadPosition(v,group.id)).sort((a,b)=>positionRank(a,group.id)-positionRank(b,group.id)||a.name.localeCompare(b.name,'ko'));
  return <div className="position-leader-card" key={group.id}><span className="leader-position">{group.name} 팀장</span>{current?<div className="position-leader-person"><Avatar member={current}/><div><strong>{current.name}</strong><small>{positionLabel(current)}</small></div></div>:<div className="leader-unassigned">미정</div>}{canEdit&&<label className="leader-select"><span className="sr-only">{group.name} 팀장 지정</span><select aria-label={group.name+' 팀장 지정'} disabled={busy} value={current?.id||''} onChange={e=>onSave('positionLeader',{group:group.id,member:e.target.value},false)}><option value="">미정 · 지정 해제</option>{candidates.map(v=><option key={v.id} value={v.id}>{v.name} · {positionLabel(v)}</option>)}</select></label>}</div>;
 })}</div>{canEdit&&<p className="hint">팀장은 동장만 지정할 수 있어요. 관리 담당자 권한과는 별도로 표시됩니다.</p>}</section>;
}

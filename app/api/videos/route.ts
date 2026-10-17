import {env} from 'cloudflare:workers';
import {koreaDate} from '../../../lib/domain';
import {response,teamContext,updateTeam,validOrigin} from '../../../lib/server-team';
export const dynamic='force-dynamic';
export async function POST(req:Request){try{
 if(!validOrigin(req))return response({error:'허용되지 않는 요청입니다.'},403);
 const auth=await teamContext(req);if(!auth)return response({error:'팀 로그인이 필요합니다.'},401);
 if(!env.BUCKET)return response({error:'영상 저장소 연결이 필요합니다.'},503);
 const size=Number(req.headers.get('content-length'));if(!Number.isSafeInteger(size)||size<=0)return response({error:'영상 파일 크기를 확인해주세요.'},411);if(size>80*1024*1024)return response({error:'영상은 80MB 이하로 올려주세요.'},413);
 const type=req.headers.get('content-type')?.split(';')[0]||'';if(!['video/mp4','video/webm','video/quicktime'].includes(type))return response({error:'MP4, WebM, MOV 형식만 지원합니다.'},415);
 const sessionId=req.headers.get('x-training-session')||'';if(!auth.state.trainingSessions?.some(s=>s.id===sessionId))return response({error:'훈련 세션을 먼저 선택해주세요.'},400);
 const mine=(auth.state.videos||[]).filter(v=>v.uploadedBy===auth.member&&v.date===koreaDate());if(mine.length>=20)return response({error:'하루에 영상은 20개까지 올릴 수 있습니다.'},429);
 const used=(auth.state.videos||[]).reduce((a,v)=>a+v.size,0);if(used+size>2*1024*1024*1024)return response({error:'팀 영상 저장 한도 2GB를 초과했습니다.'},413);
 const fileName=decodeURIComponent(req.headers.get('x-file-name')||'video').replace(/[\r\n]/g,'').slice(0,150),title=decodeURIComponent(req.headers.get('x-video-title')||'').trim().slice(0,100)||fileName;
 const id=crypto.randomUUID(),key=`teams/${auth.team}/videos/${id}`;
 await env.BUCKET.put(key,req.body,{httpMetadata:{contentType:type}});
 try{await updateTeam(auth.team,s=>{if(!s.trainingSessions?.some(v=>v.id===sessionId))throw Error('훈련 세션이 삭제되었습니다.');if((s.videos||[]).reduce((a,v)=>a+v.size,0)+size>2*1024*1024*1024)throw Error('팀 영상 한도를 초과했습니다.');s.videos??=[];s.videos.push({id,sessionId,title,fileName,size,type,uploadedBy:auth.member,date:koreaDate()});return s;});}catch(e){await env.BUCKET.delete(key);throw e;}
 return response({ok:true,id});
 }catch(e){return response({error:e instanceof Error&&!/D1|SQL|R2|bucket/i.test(e.message)?e.message:'영상을 저장하지 못했습니다.'},400);}}

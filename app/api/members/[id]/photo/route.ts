import {database,response,teamContext,validOrigin} from '../../../../../lib/server-team';
import {MAX_PROFILE_PHOTO_BYTES,validateProfilePhoto} from '../../../../../lib/profile-photo';
import {storeProfilePhoto} from '../../../../../lib/server-photo';
export const dynamic='force-dynamic';
type Params={params:Promise<{id:string}>};
export async function GET(req:Request,{params}:Params){try{
 const auth=await teamContext(req);if(!auth)return response({error:'팀 로그인이 필요합니다.'},401);
 const {id}=await params;
 if(!auth.state.members.some(v=>v.id===id&&v.photoRevision))return response({error:'사진이 없습니다.'},404);
 const row=await database().prepare('SELECT bytes FROM member_photos WHERE team=? AND member=?').bind(auth.team,id).first<{bytes:number[]}>();
 if(!row)return response({error:'사진이 없습니다.'},404);
 return new Response(new Uint8Array(row.bytes),{headers:{'Content-Type':'image/jpeg','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Cross-Origin-Resource-Policy':'same-origin','Content-Security-Policy':"default-src 'none'"}});
 }catch{return response({error:'사진을 불러오지 못했습니다.'},503);}}
async function edit(req:Request,{params}:Params,remove=false){try{
 // Finish reading (or cancelling) the bounded upload before returning any
 // response, including authorization errors, so no body reader outlives it.
 let bytes=new Uint8Array(0);
 if(!remove){
  const reader=req.body?.getReader();if(!reader)return response({error:'사진을 선택해주세요.'},400);
  const chunks:Uint8Array[]=[];let length=0;
  while(true){const {done,value}=await reader.read();if(done)break;length+=value.length;if(length>MAX_PROFILE_PHOTO_BYTES){await reader.cancel();return response({error:'프로필 사진은 128KB까지 저장할 수 있습니다.'},413);}chunks.push(value);}
  bytes=new Uint8Array(length);let offset=0;for(const part of chunks){bytes.set(part,offset);offset+=part.length;}
 }
 if(!validOrigin(req))return response({error:'허용되지 않는 요청입니다.'},403);
 const auth=await teamContext(req);if(!auth)return response({error:'팀 로그인이 필요합니다.'},401);
 const {id}=await params;if(!auth.state.members.some(v=>v.id===id))return response({error:'팀원이 없습니다.'},404);
 if(auth.me.role==='player'&&auth.member!==id)return response({error:'본인 사진만 변경할 수 있습니다.'},403);
 if(remove){await storeProfilePhoto(auth.team,id,null);return response({ok:true});}
 if(req.headers.get('content-type')?.split(';')[0]!=='image/jpeg')return response({error:'JPEG 사진으로 변환해서 올려주세요.'},415);
 validateProfilePhoto(bytes);
 const saved=await storeProfilePhoto(auth.team,id,bytes.buffer);return response({ok:true,revision:saved.revision});
 }catch(error){return response({error:error instanceof Error&&!/D1|SQL|database|constraint/i.test(error.message)?error.message:'사진을 저장하지 못했습니다.'},400);}}
export async function PUT(req:Request,params:Params){return edit(req,params);}
export async function DELETE(req:Request,params:Params){return edit(req,params,true);}

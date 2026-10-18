import assert from 'node:assert/strict';
import fs from 'node:fs';
const origin=process.env.ACRO_ORIGIN,url=origin+'/api/team';
async function post(action,payload={},cookie=''){const r=await fetch(url,{method:'POST',headers:{origin,'content-type':'application/json',...(cookie?{cookie}:{})},body:JSON.stringify({action,payload})});const text=await r.text();let data;try{data=JSON.parse(text);}catch{throw Error(`${action}: HTTP ${r.status}: ${text.slice(0,180)}`);}return {status:r.status,data,cookie:r.headers.get('set-cookie')?.split(';')[0]};}
async function current(cookie){const r=await fetch(url,{headers:{cookie}});assert.equal(r.status,200);return (await r.json()).state;}
const created=await post('create',{name:'프로필 검증 팀',captain:'테스트 동장'});assert.equal(created.status,200);const captain=created.cookie;
const player=await post('login',{teamId:created.data.teamId,code:created.data.codes.find(v=>v.memberId==='m4').code});
const manager=await post('login',{teamId:created.data.teamId,code:created.data.codes.find(v=>v.memberId==='m2').code});
const other=await post('create',{name:'분리 검증 팀',captain:'별도 동장'});assert.equal(other.status,200);
for(const [id,position,secondaryPosition] of [['m1','공격수','세터'],['m3','수비','세터'],['m4','공격수','수비'],['m5','세터','공격수']]){
 const member=(await current(captain)).members.find(v=>v.id===id);
 const r=await post('member',{...member,position,secondaryPosition},captain);assert.equal(r.status,200);
}
assert.equal((await post('positionLeader',{group:'attack',member:'m1'},player.cookie)).status,400);
assert.equal((await post('positionLeader',{group:'attack',member:'m1'},manager.cookie)).status,400);
assert.equal((await post('positionLeader',{group:'defense',member:'m2'},captain)).status,400);
assert.equal((await post('positionLeader',{group:'defense',member:'m5'},captain)).status,400);
assert.equal((await post('positionLeader',{group:'unknown',member:'m1'},captain)).status,400);
for(const [group,member] of [['attack','m1'],['setter','m3'],['defense','m4']])assert.equal((await post('positionLeader',{group,member},captain)).status,200);
assert.deepEqual((await current(player.cookie)).positionLeaders,{attack:'m1',setter:'m3',defense:'m4'});
assert.equal((await current(captain)).members.find(v=>v.id==='m4').role,'player');
assert.equal((await post('notice',{title:'권한 없음',body:'팀장도 관리 권한을 얻지 않습니다.'},player.cookie)).status,400);
const jpeg=fs.readFileSync(new URL('./fixtures/profile-photo.jpg',import.meta.url));
console.log('Checking profile photo permissions and image validation');
async function photo(id,cookie,method='GET',bytes=jpeg,type='image/jpeg',extra={}){const r=await fetch(origin+'/api/members/'+id+'/photo',{method,headers:{...(cookie?{cookie}:{}),...(method!=='GET'?{origin}:{}),...(method==='PUT'?{'content-type':type}:{}),...extra},...(method==='PUT'?{body:bytes}:{})});return new Response(await r.arrayBuffer(),{status:r.status,headers:r.headers});}
assert.equal((await photo('m4','')).status,401);
assert.equal((await photo('m4','','PUT')).status,401);
const denied=await photo('m5',player.cookie,'PUT');assert.equal(denied.status,403,await denied.text());
assert.equal((await photo('m4',player.cookie,'PUT',jpeg,'image/png')).status,415);
assert.equal((await photo('m4',player.cookie,'PUT',Buffer.from('<svg/>'))).status,400);
assert.equal((await photo('m4',player.cookie,'PUT',Buffer.alloc(128*1024+1))).status,413);
assert.equal((await photo('m4',player.cookie,'PUT',jpeg,'image/jpeg',{origin:'https://other.example'})).status,403);
let r=await photo('m4',player.cookie,'PUT');assert.equal(r.status,200,await r.text());
console.log('Checking photo retrieval and import preservation');
r=await photo('m4',manager.cookie);assert.equal(r.status,200);assert.equal(r.headers.get('content-type'),'image/jpeg');assert.equal(r.headers.get('cache-control'),'no-store');assert.deepEqual(Buffer.from(await r.arrayBuffer()),jpeg);
assert.equal((await photo('m4',other.cookie)).status,404);
let state=await current(captain),revision=state.members.find(v=>v.id==='m4').photoRevision;assert.ok(revision);
const tampered=structuredClone(state);tampered.members.find(v=>v.id==='m4').photoRevision='do-not-trust-imported-photo-reference';
r=await post('setup',tampered,captain);assert.equal(r.status,200);assert.equal(r.data.state.members.find(v=>v.id==='m4').photoRevision,revision);assert.deepEqual(r.data.state.positionLeaders,state.positionLeaders);
const member=state.members.find(v=>v.id==='m4');
console.log('Checking concurrent photo/profile changes');
const concurrent=await Promise.all([photo('m4',player.cookie,'PUT'),post('member',{...member,name:'변경된 선수',position:'세터',secondaryPosition:'세터'},captain)]);
assert.equal(concurrent[0].status,200);assert.equal(concurrent[1].status,200);
state=await current(captain);assert.equal(state.members.find(v=>v.id==='m4').name,'변경된 선수');assert.ok(state.members.find(v=>v.id==='m4').photoRevision);assert.equal(state.positionLeaders.defense,undefined);
assert.equal((await photo('m1',manager.cookie,'PUT')).status,200);
assert.equal((await photo('m1',player.cookie,'DELETE')).status,403);
assert.equal((await photo('m4',player.cookie,'DELETE')).status,200);assert.equal((await photo('m4',captain)).status,404);assert.equal((await current(captain)).members.find(v=>v.id==='m4').photoRevision,undefined);
assert.equal((await photo('m1',manager.cookie,'DELETE')).status,200);
assert.equal((await post('positionLeader',{group:'attack',member:''},captain)).status,200);
assert.equal((await current(captain)).positionLeaders.attack,undefined);
console.log('PASS: shared profile photo upload/read/delete, image limits, team/role isolation, atomic photo/profile updates, import preservation, captain-only position leaders and eligibility cleanup');

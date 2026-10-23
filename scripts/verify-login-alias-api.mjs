import assert from 'node:assert/strict';
const origin=process.env.ACRO_ORIGIN;
async function login(teamId,code){
 const response=await fetch(origin+'/api/team',{method:'POST',headers:{origin,'content-type':'application/json'},body:JSON.stringify({action:'login',payload:{teamId,code}}),signal:AbortSignal.timeout(20000)});
 return {status:response.status,data:await response.json(),cookie:response.headers.get('set-cookie')?.split(';')[0]};
}
for(const id of ['ADMIN-EXAMPLE','admin-example']){
 const result=await login(id,'TESTALIASCAPTAIN');assert.equal(result.status,200);assert.equal(result.data.memberId,'m1');assert.equal(result.data.teamId,'ACRO-ALIAS-TEST');
 assert.equal(result.data.state.members.find(v=>v.id===result.data.memberId).role,'captain');
 const session=await fetch(origin+'/api/team',{headers:{cookie:result.cookie}});assert.equal(session.status,200);assert.equal((await session.json()).memberId,'m1');
}
assert.equal((await login('ADMIN-EXAMPLE','TESTALIASPLAYER')).status,401);
assert.equal((await login('ADMIN-EXAMPLE','INCORRECT')).status,401);
const member=await login('ACRO-ALIAS-TEST','TESTALIASPLAYER');assert.equal(member.status,200);assert.equal(member.data.memberId,'m4');
console.log('PASS: web/desktop shared captain-alias login and session, case handling, rejection of other member codes, and unchanged canonical member login');

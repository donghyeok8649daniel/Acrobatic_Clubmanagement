const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const {parseEntry,consumeFirstLogin}=require('../first-login.cjs');
const {APP_URL}=require('../navigation.cjs');
test('personal entry rejects malformed credentials',()=>{
 for(const value of [null,{}, {teamId:'other',code:'A'.repeat(18)}, {teamId:'ACRO-ABCDEF12',code:'x'}]) assert.throws(()=>parseEntry(value));
});
test('personal desktop connection uses the real login API, verifies its session, then consumes the file',async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'acrobatic-entry-')),file=path.join(dir,'first-login.json');
 const entry={teamId:'ACRO-ABCDEF12',code:'A'.repeat(18)};
 const data={teamId:entry.teamId,memberId:'m1',state:{members:[{id:'m1'}]}};
 fs.writeFileSync(file,JSON.stringify(entry));
 let cookie,flushed=false;
 const ses={cookies:{set:async value=>cookie=value,flushStore:async()=>{flushed=true;}},fetch:async(url,options)=>{assert.equal(url,new URL('/api/team',APP_URL).href);assert.equal(options.credentials,'include');return Response.json(data);}};
 try{
  const result=await consumeFirstLogin(file,ses,async(url,options)=>{
   assert.equal(url.href,new URL('/api/team',APP_URL).href);assert.equal(options.redirect,'error');
   assert.deepEqual(JSON.parse(options.body),{action:'login',payload:entry});
   return Response.json(data,{headers:{'set-cookie':`courtin_session=${'B'.repeat(36)}; Path=/; HttpOnly; Secure`}});
  });
  assert.equal(cookie.url,APP_URL);assert.equal(cookie.httpOnly,true);assert.equal(cookie.secure,true);assert.equal(cookie.sameSite,'lax');
  assert.equal(result.memberCount,1);assert.equal(flushed,true);assert.equal(fs.existsSync(file),false);
 }finally{if(fs.existsSync(file))fs.unlinkSync(file);fs.rmdirSync(dir);}
});
test('rejected credentials are retained for correction and do not install a session',async()=>{
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'acrobatic-entry-')),file=path.join(dir,'first-login.json');
 fs.writeFileSync(file,JSON.stringify({teamId:'ACRO-ABCDEF12',code:'A'.repeat(18)}));
 let cookieSet=false;
 try{
  await assert.rejects(consumeFirstLogin(file,{cookies:{set:async()=>{cookieSet=true;}}},async()=>Response.json({error:'no'},{status:401})));
  assert.equal(cookieSet,false);assert.equal(fs.existsSync(file),true);
 }finally{fs.unlinkSync(file);fs.rmdirSync(dir);}
});

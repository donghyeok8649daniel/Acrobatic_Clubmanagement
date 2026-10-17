'use strict';
const fs = require('node:fs');
const { APP_URL } = require('./navigation.cjs');
function parseEntry(value) {
  if (!value || !/^ACRO-[A-F0-9]{8}$/.test(value.teamId) || !/^[A-F0-9]{18}$/.test(value.code)) throw Error('Invalid personal entry file');
  return {teamId:value.teamId,code:value.code};
}
async function consumeFirstLogin(file, browserSession, request=fetch) {
  if (!fs.existsSync(file)) return false;
  if (fs.statSync(file).size > 4096) throw Error('Personal entry file is too large');
  const entry=parseEntry(JSON.parse(fs.readFileSync(file,'utf8').replace(/^\uFEFF/,'')));
  const response=await request(new URL('/api/team',APP_URL),{method:'POST',redirect:'error',signal:AbortSignal.timeout(15000),headers:{origin:new URL(APP_URL).origin,'content-type':'application/json'},body:JSON.stringify({action:'login',payload:entry})});
  if(!response.ok) throw Error('Personal team login failed');
  const result=await response.json();
  const token=response.headers.get('set-cookie')?.match(/(?:^|;\s*)courtin_session=([A-F0-9]{36})(?:;|$)/)?.[1];
  if(!token||result.teamId!==entry.teamId||!result.state?.members?.some(member=>member.id===result.memberId)) throw Error('Invalid login response');
  await browserSession.cookies.set({url:APP_URL,name:'courtin_session',value:token,path:'/',httpOnly:true,secure:true,sameSite:'lax',expirationDate:Date.now()/1000+30*86400});
  const check=await browserSession.fetch(new URL('/api/team',APP_URL).href,{credentials:'include'});
  const verified=await check.json();
  if(!check.ok||verified.teamId!==entry.teamId||verified.memberId!==result.memberId) throw Error('Desktop team session was not established');
  await browserSession.cookies.flushStore();
  fs.unlinkSync(file);
  return {teamId:verified.teamId,memberId:verified.memberId,memberCount:verified.state.members.length};
}
module.exports={parseEntry,consumeFirstLogin};

import assert from 'node:assert/strict';
import fs from 'node:fs';
const origin=process.env.ACRO_ORIGIN||'http://127.0.0.1:5173',url=origin+'/api/team';
const privateFile=process.env.ACRO_SETUP_FILE;
const setup=privateFile?JSON.parse(fs.readFileSync(privateFile,'utf8')):{schemaVersion:1,name:'테스트',description:'테스트',monthlyFee:null,members:Array.from({length:16},(_,i)=>({id:'m'+(i+1),name:'팀원'+(i+1),role:i===0?'captain':i===1?'manager':i===2?'assistant':'player',number:null,position:i===1?'운영':'미정',status:'활동 중'})),operations:{stage:'가동아리 · 첫 학기',officerStatus:'미정',candidateIds:['m1','m2','m3'],financeOwnerId:'m1',equipmentOwnerId:'m1',seasonGoal:'2027 봄 · 미확정',trainingExpansion:'참여율에 따라 확대'},weeklyTraining:[{id:'monday-training',weekday:1,time:'18:30',endTime:'20:00',location:'테스트 코트',startDate:'2026-10-19',note:'',enabled:true}]};
async function post(action,payload={},cookie=''){const r=await fetch(url,{method:'POST',headers:{origin,'content-type':'application/json',...(cookie?{cookie}:{})},body:JSON.stringify({action,payload})});return {status:r.status,data:await r.json(),cookie:r.headers.get('set-cookie')?.split(';')[0]};}
const created=await post('create',{name:'검증 팀',captain:'테스트 동장'});assert.equal(created.status,200,JSON.stringify(created.data));const cookie=created.cookie,teamId=created.data.teamId;assert.equal(created.data.state.members.length,16);assert.equal(created.data.codes.length,16);assert.equal(created.data.state.matches.length,0);assert.equal(created.data.state.monthlyFee,null);
let r=await post('setup',setup,cookie);assert.equal(r.status,200,JSON.stringify(r.data));assert.deepEqual(r.data.state.members.map(m=>m.name),setup.members.map(m=>m.name));assert.equal(r.data.state.members[15].name,setup.members[15].name);assert.equal(r.data.state.operations.officerStatus,'미정');assert.equal(r.data.state.operations.financeOwnerId,'m1');assert.equal(r.data.state.operations.equipmentOwnerId,'m1');assert.equal(r.data.state.matches.length,0);assert.equal(r.data.state.transactions.length,0);assert.equal(r.data.state.equipment.length,0);assert.equal(r.data.state.lineup.attack,undefined);assert.deepEqual(r.data.state.members.map(m=>m.position),setup.members.map(m=>m.position));assert.deepEqual(r.data.state.members.map(m=>m.secondaryPosition),setup.members.map(m=>m.secondaryPosition||'미정'));assert.deepEqual(r.data.state.members.map(m=>m.positionNote),setup.members.map(m=>m.positionNote||''));
const player=await post('login',{teamId,code:created.data.codes.find(v=>v.memberId==='m4').code});assert.equal(player.status,200);const manager=await post('login',{teamId,code:created.data.codes.find(v=>v.memberId==='m2').code});assert.equal(manager.status,200);
const recurrence='weekly:monday-training:2026-10-26';r=await post('attendance',{event:recurrence,value:'참석'},player.cookie);assert.equal(r.status,200,JSON.stringify(r.data));assert.equal(r.data.state.events[0].time,'18:30');assert.equal(r.data.state.events[0].endTime,'20:00');assert.equal(r.data.state.events[0].attendance.m4,'참석');
r=await post('attendance',{event:recurrence,member:'m5',value:'참석'},player.cookie);assert.equal(r.status,400);
r=await post('setup',setup,manager.cookie);assert.equal(r.status,400);r=await post('weeklyTraining',{rules:[]},player.cookie);assert.equal(r.status,400);
r=await post('event',{title:'테스트 경기',kind:'친선 경기',date:'2026-11-02',time:'18:30',endTime:'20:00',location:'테스트 코트',opponent:'테스트 상대',note:''},cookie);assert.equal(r.status,200);const event=r.data.state.events.find(e=>e.title==='테스트 경기').id;
r=await post('matchEntry',{event,member:'m4'},cookie);assert.equal(r.status,400);
for(const id of ['m1','m3','m4','m5']){assert.equal((await post('attendance',{event,member:id,value:'참석'},cookie)).status,200);assert.equal((await post('matchEntry',{event,member:id},cookie)).status,200);}
for(const [slot,member] of Object.entries({attack:'m1',setter:'m3',left:'m4',right:'m5'}))assert.equal((await post('matchBest4',{event,slot,member},cookie)).status,200);
r=await post('matchBest4',{event,slot:'attack',member:'m6'},cookie);assert.equal(r.status,400);
r=await post('matchEntry',{event,member:'m4'},player.cookie);assert.equal(r.status,400);
r=await post('attendance',{event,value:'불참'},player.cookie);assert.equal(r.status,200);const e=r.data.state.events.find(e=>e.id===event);assert.equal(e.entryIds.includes('m4'),false);assert.equal(e.best4.left,undefined);
r=await post('trainingSession',{title:'테스트 훈련',date:'2026-10-26',goal:'연결 플레이',drills:'리시브 20분',feedback:'세터에게 높이 전달',eventId:recurrence},cookie);assert.equal(r.status,200,JSON.stringify(r.data));const sessionId=r.data.state.trainingSessions[0].id;
r=await post('trainingSession',{title:'권한 없음',date:'2026-10-19'},player.cookie);assert.equal(r.status,400);
const bytes=new Uint8Array(64);bytes.set(new TextEncoder().encode('0000ftypisom'));
async function videoRequest(cookie,extra={}){return fetch(origin+'/api/videos',{method:'POST',headers:{origin,cookie,'content-type':'video/mp4','x-training-session':sessionId,'x-file-name':encodeURIComponent('테스트.mp4'),...extra},body:bytes});}
let v=await videoRequest(player.cookie);const vd=await v.json();assert.equal(v.status,200,JSON.stringify(vd));const videoId=vd.id;
v=await fetch(origin+'/api/videos/'+videoId,{headers:{cookie,'range':'bytes=0-15'}});assert.equal(v.status,206);assert.equal((await v.arrayBuffer()).byteLength,16);assert.equal(v.headers.get('content-range'),'bytes 0-15/64');
v=await fetch(origin+'/api/videos/'+videoId,{headers:{cookie,'range':'bytes=999-'}});assert.equal(v.status,416);
v=await fetch(origin+'/api/videos/'+videoId);assert.equal(v.status,401);
const second=await post('create',{name:'다른 팀',captain:'다른 동장'});v=await fetch(origin+'/api/videos/'+videoId,{headers:{cookie:second.cookie}});assert.equal(v.status,404);
v=await videoRequest(player.cookie,{'content-type':'text/html'});assert.equal(v.status,415);
r=await post('delete',{collection:'trainingSessions',id:sessionId},cookie);assert.equal(r.status,400);
v=await fetch(origin+'/api/videos/'+videoId,{method:'DELETE',headers:{origin,cookie:manager.cookie}});assert.equal(v.status,200);v=await fetch(origin+'/api/videos/'+videoId,{headers:{cookie}});assert.equal(v.status,404);
r=await post('delete',{collection:'events',id:recurrence},cookie);assert.equal(r.status,200);assert.equal(r.data.state.weeklyTraining[0].exceptions.includes('2026-10-26'),true);
r=await post('setup',setup,cookie);assert.equal(r.status,200);assert.equal(r.data.state.weeklyTraining[0].exceptions.includes('2026-10-26'),true);assert.equal(r.data.state.events.some(e=>e.id===event),true);
r=await post('attendance',{event:'weekly:monday-training:2027-01-04',value:'참석'},player.cookie);assert.equal(r.status,200);assert.equal(r.data.state.events.find(e=>e.date==='2027-01-04').time,'18:30');
r=await post('attendance',{event:'weekly:monday-training:2027-01-05',value:'참석'},player.cookie);assert.equal(r.status,400);
// Prepare a clean private local team for visual review. Personal data never enters the public bundle.
if(privateFile){const preview=await post('create',{name:'아크로바틱',captain:setup.members[0].name});assert.equal(preview.status,200);r=await post('setup',setup,preview.cookie);assert.equal(r.status,200);fs.mkdirSync('.sites-runtime',{recursive:true});fs.writeFileSync('.sites-runtime/local-review.json',JSON.stringify({teamId:preview.data.teamId,code:preview.data.codes[0].code}),{mode:0o600});}
console.log('PASS: 16명 현황·미정 정보·빈 경기/예산, 월요일 반복 출석, 참가→엔트리→BEST4와 불참 연동, 훈련 기록, 영상 업로드·범위 재생·팀 격리·삭제, 권한 검증');

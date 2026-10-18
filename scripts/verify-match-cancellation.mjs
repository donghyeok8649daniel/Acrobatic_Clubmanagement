import assert from 'node:assert/strict';
import {recurringEvents} from '../lib/training.ts';

// Reuse the disposable member-lifecycle team, not production or a second
// account. This keeps the full suite within the normal creation rate limit.
export async function verifyMatchCancellation({post,state,captain,manager,player}){
 console.log('Checking reversible match cancellation and concurrent requests');
 const ids=[];
 for(const date of ['2099-01-02','2099-01-09','2000-01-02']){
  const result=await post('event',{title:'취소 복원 검증',kind:'친선 경기',date,time:'18:30',endTime:'20:00',location:'검증 코트'},captain);
  assert.equal(result.status,200);ids.push(result.data.state.events.find(v=>v.date===date).id);
 }
 const [event,next,past]=ids;
 for(const member of ['m4','m5']){
  assert.equal((await post('attendance',{event,member,value:'참석'},captain)).status,200);
  assert.equal((await post('matchEntry',{event,member},captain)).status,200);
 }
 for(const [slot,member] of [['left','m4'],['setter','m5']])assert.equal((await post('matchBest4',{event,slot,member},captain)).status,200);
 assert.equal((await post('lineup',{slot:'left',member:'m4'},captain)).status,200);
 assert.equal((await post('match',{opponent:'검증 상대',date:'2000-01-02',our:2,their:1,note:'과거 기록 보존'},captain)).status,200);
 const baseline=await state(),original=baseline.events.find(v=>v.id===event),pastOriginal=baseline.events.find(v=>v.id===past);
 const target=(cancelled,expectedVersion)=>({event,cancelled,expectedVersion});
 const getEvent=current=>current.events.find(v=>v.id===event);

 assert.equal((await post('eventCancellation',target(true,0),player)).status,400);
 assert.equal((await post('eventCancellation',target('true',0),captain)).status,400);
 assert.equal((await post('eventCancellation',target(true,-1),captain)).status,400);
 assert.deepEqual(await state(),baseline);

 let result=await post('eventCancellation',target(true,0),manager);assert.equal(result.status,200);
 let current=result.data.state,record=getEvent(current);
 assert.deepEqual(record,{...original,cancelled:true,cancellationVersion:1});
 assert.deepEqual(current.lineup,baseline.lineup);assert.deepEqual(current.matches,baseline.matches);
 assert.equal(recurringEvents(current,'2099-01-01','2099-12-31').some(v=>v.id===event),false);
 assert.equal(recurringEvents(current,'2099-01-01','2099-12-31')[0].id,next);
 assert.equal(recurringEvents(current,'2099-01-01','2099-12-31',{includeCancelled:true}).some(v=>v.id===event),true);
 const cancelledVersion=result.data.version;
 result=await post('eventCancellation',target(true,0),captain);assert.equal(result.status,200);
 assert.equal(result.data.version,cancelledVersion);assert.deepEqual(getEvent(result.data.state),record);

 for(const [action,payload,cookie] of [
  ['attendance',{event,member:'m4',value:'불참'},player],
  ['matchEntry',{event,member:'m4'},captain],
  ['matchBest4',{event,slot:'left',member:''},captain],
  ['delete',{collection:'events',id:event},captain],
 ])assert.equal((await post(action,payload,cookie)).status,400);
 assert.deepEqual(await state(),current);

 result=await post('eventCancellation',target(false,1),manager);assert.equal(result.status,200);
 assert.deepEqual(getEvent(result.data.state),{...original,cancelled:false,cancellationVersion:2});
 const restoredVersion=result.data.version;
 result=await post('eventCancellation',target(false,1),captain);assert.equal(result.status,200);assert.equal(result.data.version,restoredVersion);
 const restored=await state();
 assert.equal((await post('eventCancellation',target(true,0),captain)).status,400);
 assert.deepEqual(await state(),restored);

 // Duplicate requests must represent one transition, even when both arrive
 // before either client has received a response.
 const duplicateCancel=await Promise.all([post('eventCancellation',target(true,2),captain),post('eventCancellation',target(true,2),manager)]);
 assert.deepEqual(duplicateCancel.map(v=>v.status),[200,200]);
 assert.equal(duplicateCancel[0].data.version,duplicateCancel[1].data.version);
 assert.equal(getEvent(await state()).cancellationVersion,3);
 const duplicateRestore=await Promise.all([post('eventCancellation',target(false,3),captain),post('eventCancellation',target(false,3),manager)]);
 assert.deepEqual(duplicateRestore.map(v=>v.status),[200,200]);
 assert.equal(duplicateRestore[0].data.version,duplicateRestore[1].data.version);
 assert.equal(getEvent(await state()).cancellationVersion,4);

 // Concurrent schedule edits retain stable IDs, cancellation state and all
 // selections. An invalid edit must roll back the complete transaction.
 const changes={...getEvent(await state()),id:event,title:'변경된 경기',location:'변경된 코트'};
 const concurrent=await Promise.all([post('event',changes,captain),post('eventCancellation',target(true,4),manager)]);
 assert.deepEqual(concurrent.map(v=>v.status),[200,200]);
 current=await state();record=getEvent(current);
 assert.equal(record.title,changes.title);assert.equal(record.location,changes.location);assert.equal(record.cancelled,true);assert.equal(record.cancellationVersion,5);
 assert.deepEqual(record.attendance,original.attendance);assert.deepEqual(record.entryIds,original.entryIds);assert.deepEqual(record.best4,original.best4);
 assert.equal((await post('event',{...changes,kind:'팀 모임'},captain)).status,400);
 assert.deepEqual(await state(),current);
 assert.equal((await post('event',{...changes,endTime:'17:00'},captain)).status,400);
 assert.deepEqual(await state(),current);
 assert.equal((await post('event',{...changes,date:'2099-02-30'},captain)).status,400);
 assert.deepEqual(await state(),current);
 for(let index=0;index<2;index++)assert.equal((await post('event',changes,captain)).status,200);
 assert.equal((await state()).events.filter(v=>v.id===event).length,1);

 assert.equal((await post('eventCancellation',{event:past,cancelled:true,expectedVersion:0},captain)).status,400);
 result=await post('eventCancellation',target(false,5),captain);assert.equal(result.status,200);
 assert.equal((await post('eventCancellation',target(true,6),captain)).status,200);
 current=await state();const departed=current.members.find(v=>v.id==='m5');
 assert.equal((await post('member',{...departed,status:'귀국'},captain)).status,200);
 result=await post('eventCancellation',target(false,7),captain);assert.equal(result.status,200);
 current=result.data.state;record=getEvent(current);
 assert.deepEqual(record.entryIds,['m4']);assert.deepEqual(record.best4,{left:'m4'});assert.deepEqual(record.attendance,original.attendance);
 assert.deepEqual(current.events.find(v=>v.id===past),pastOriginal);assert.deepEqual(current.matches,baseline.matches);assert.deepEqual(current.lineup,baseline.lineup);assert.deepEqual(current.weeklyTraining,baseline.weeklyTraining);
 console.log('PASS: reversible match cancellation, read-only selections, stale/duplicate request handling, atomic schedule edits, eligibility on restore and preserved past results');
}

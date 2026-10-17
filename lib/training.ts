import type {Event,TeamState,WeeklyTraining} from './domain';
export function addDays(date:string,n:number){const d=new Date(date+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10);}
export function timeRange(e:{time:string;endTime?:string}){return e.time+(e.endTime?'–'+e.endTime:'');}
function cancelled(state:TeamState,e:Event){return !!e.recurrenceId&&!!state.weeklyTraining?.find(r=>r.id===e.recurrenceId)?.exceptions?.includes(e.date);}
export function recurringEvents(state:TeamState,from:string,to:string):Event[]{
 const saved=state.events.filter(e=>e.date>=from&&e.date<=to&&!cancelled(state,e));const ids=new Set(state.events.map(e=>e.id));const generated:Event[]=[];
 for(const rule of state.weeklyTraining||[]){if(rule.enabled===false)continue;const start=from>rule.startDate?from:rule.startDate;const weekday=new Date(start+'T12:00:00Z').getUTCDay();let date=addDays(start,(rule.weekday-weekday+7)%7);let bounded=0;
  while(date<=to&&bounded++<400){const id=`weekly:${rule.id}:${date}`;if(!ids.has(id)&&!rule.exceptions?.includes(date))generated.push({id,title:'정기 훈련',date,time:rule.time,endTime:rule.endTime,location:rule.location,kind:'정기 훈련',note:rule.note||'',attendance:{},recurrenceId:rule.id});date=addDays(date,7);}
 }
 return [...saved,...generated].sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));
}
export function findEvent(state:TeamState,id:string):Event|undefined{const saved=state.events.find(e=>e.id===id);if(saved)return cancelled(state,saved)?undefined:saved;if(typeof id!=='string'||!id.startsWith('weekly:'))return;const date=id.split(':').at(-1)!;if(!/^\d{4}-\d{2}-\d{2}$/.test(date))return;return recurringEvents(state,date,date).find(e=>e.id===id);}

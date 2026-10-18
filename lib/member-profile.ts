import type {Member,PositionGroup,TeamState} from './domain';
import {isPlayingMember} from './positions.ts';
export const positionGroups:ReadonlyArray<{id:PositionGroup;name:string}>=[{id:'attack',name:'공격수'},{id:'setter',name:'세터'},{id:'defense',name:'수비'}];
const normalized=(position?:string)=>position==='공격'?'공격수':['좌수비','우수비'].includes(position||'')?'수비':position;
export function canLeadPosition(member:Member,group:PositionGroup){const target=positionGroups.find(v=>v.id===group)?.name;return !!target&&isPlayingMember(member)&&[normalized(member.position),normalized(member.secondaryPosition)].includes(target);}
export function cleanPositionLeaders(members:Member[],leaders:TeamState['positionLeaders']){const result:NonNullable<TeamState['positionLeaders']>={};for(const group of positionGroups){const member=members.find(v=>v.id===leaders?.[group.id]);if(member&&canLeadPosition(member,group.id))result[group.id]=member.id;}return result;}
export function memberLeadership(memberId:string,leaders:TeamState['positionLeaders']){return positionGroups.filter(v=>leaders?.[v.id]===memberId).map(v=>v.name+' 팀장');}

import assert from 'node:assert/strict';
import fs from 'node:fs';
import {positionLabel,positionSearch,positionRank} from '../lib/positions.ts';
const member={id:'test',name:'테스트',role:'player',number:null,position:'수비',secondaryPosition:'세터',positionNote:'세터도 매우 잘함',status:'활동 중'};
assert.equal(positionLabel(member),'수비 · 부 세터');assert.equal(positionSearch(member).includes('세터도 매우 잘함'),true);
assert.equal(positionRank(member,'left'),0);assert.equal(positionRank(member,'right'),0);assert.equal(positionRank(member,'setter'),1);assert.equal(positionRank(member,'attack'),2);
assert.equal(positionRank({...member,position:'세터'},'setter'),0);assert.equal(positionRank({...member,position:'공격',secondaryPosition:'수비'},'attack'),0);
if(process.env.ACRO_SETUP_FILE){const setup=JSON.parse(fs.readFileSync(process.env.ACRO_SETUP_FILE,'utf8'));const players=setup.members.filter(m=>m.role!=='manager');assert.equal(players.length,15);assert.equal(players.filter(m=>m.position==='공격수').length,4);assert.equal(players.filter(m=>m.position==='세터').length,4);assert.equal(players.filter(m=>m.position==='수비').length,7);assert.equal(players.every(m=>m.secondaryPosition),true);const nico=players.find(m=>m.id==='m16');assert.equal(nico.position,'수비');assert.equal(nico.secondaryPosition,'공격수');assert.equal(nico.departureMonth,'2026-12');const setterStrong=players.filter(m=>m.positionNote?.includes('세터도 매우 잘함'));assert.deepEqual(setterStrong.map(m=>m.id).sort(),['m10','m12']);assert.equal(players.find(m=>m.id==='m13').positionNote.includes('대안'),true);}
console.log('PASS: 4 공격·4 세터·7 수비, 주/세컨 분리, 특이사항, 귀국 메모 보존, BEST 4 후보 순서 검증');

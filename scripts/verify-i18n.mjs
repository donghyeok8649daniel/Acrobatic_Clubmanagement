import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
import {english,formatMonth,translate} from '../lib/translations.ts';
assert.equal(translate('팀 대시보드','en'),'Dashboard');
assert.equal(translate('팀 대시보드','ko'),'팀 대시보드');
assert.equal(translate('공격수 · 부 세터','en'),'Attacker · Secondary Setter');
assert.equal(translate('Alex · 수비 · 부 공격','en'),'Alex · Defender · Secondary Attack');
assert.equal(translate('수비 팀장 지정','en'),'Assign defender leader');
assert.equal(translate('My original practice note / 원래 기록','en'),'My original practice note / 원래 기록');
assert.equal(translate('  저장하기 ','en'),'  Save ');
assert.ok(english['팀 ID 또는 개인 입장코드가 올바르지 않습니다.']);
assert.equal(formatMonth('2026-12','en'),'December 2026');
assert.equal(formatMonth('2027-01','ko'),'2027년 1월');
assert.equal(formatMonth('2026-99','en'),'2026-99');

// Every HTML option has an explicit raw value, so translating its label cannot
// change the enum/member ID sent by a form or controlled select.
for(const file of ['page','team-entry','team-features','member-features','app-install']){
 const source=fs.readFileSync(new URL('../app/'+file+'.tsx',import.meta.url),'utf8');
 const tree=ts.createSourceFile(file+'.tsx',source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
 function visit(node){
  if(ts.isJsxOpeningElement(node)&&node.tagName.getText(tree)==='option'){
   const value=node.attributes.properties.find(v=>ts.isJsxAttribute(v)&&v.name.getText(tree)==='value');
   assert.ok(value,`${file}: option must retain an explicit value`);
   assert.ok(!/\btr\(/.test(value.getText(tree)),`${file}: stored option values must not be translated`);
  }
  ts.forEachChild(node,visit);
 }
 visit(tree);
}
console.log('PASS: English labels, original records, Korean fallback and stable form values');


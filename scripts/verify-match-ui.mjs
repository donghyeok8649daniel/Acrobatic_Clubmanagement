import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {registerHooks} from 'node:module';
import {fileURLToPath} from 'node:url';
import ts from 'typescript';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';

// Compile only repository TS/TSX in this test process. No browser, clicks,
// persistent profile, network or production records are involved.
const root=fileURLToPath(new URL('../',import.meta.url));
registerHooks({
 resolve(specifier,context,next){
  if(specifier.startsWith('.')&&context.parentURL?.startsWith('file:')&&!path.extname(specifier)){
   const base=new URL(specifier,context.parentURL);
   for(const extension of ['.ts','.tsx']){const candidate=new URL(base.href+extension);if(fs.existsSync(candidate))return next(candidate.href,context);}
  }
  return next(specifier,context);
 },
 load(url,context,next){
  if(url.startsWith('file:')){const file=fileURLToPath(url);if(file.startsWith(root)&&/\.tsx?$/.test(file)&&!file.includes('node_modules'))return {format:'module',shortCircuit:true,source:ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText};}
  return next(url,context);
 }
});
const {initialState,koreaDate,dateOffset}=await import('../lib/domain.ts');
const {MatchCancellation,MatchPreparation,UpcomingMatches}=await import('../app/team-features.tsx');
const state=initialState('UI test','Captain'),active={id:'active',title:'Active match',date:dateOffset(1),time:'18:30',location:'Test court',kind:'친선 경기',note:'',attendance:{m4:'참석'},entryIds:['m4'],best4:{left:'m4'}};
const cancelled={...active,id:'cancelled',title:'Cancelled match',date:dateOffset(2),cancelled:true,cancellationVersion:1};
state.events=[active,cancelled];
const props={state,memberId:'m1',busy:false,onOpen:()=>{},onSave:()=>{}};
const render=(component,values)=>renderToStaticMarkup(React.createElement(component,values));
const list=render(UpcomingMatches,props),detailStart=list.indexOf('<details');
assert.ok(detailStart>0);assert.ok(list.slice(0,detailStart).includes('Active match'));assert.ok(!list.slice(0,detailStart).includes('Cancelled match'));assert.ok(list.slice(detailStart).includes('Cancelled match'));
assert.ok(render(MatchCancellation,{event:cancelled,canEdit:true,busy:false,onSave:()=>{}}).includes('경기 복원'));
assert.ok(!render(MatchCancellation,{event:cancelled,canEdit:false,busy:false,onSave:()=>{}}).includes('경기 복원'));
assert.equal(render(MatchCancellation,{event:active,canEdit:false,busy:false,onSave:()=>{}}),'');
assert.ok(!render(MatchCancellation,{event:{...cancelled,date:'2000-01-01'},canEdit:true,busy:false,onSave:()=>{}}).includes('경기 복원'));
const preparation=render(MatchPreparation,{...props,event:cancelled});
for(const control of preparation.match(/<(?:button|select)\b[^>]*>/g)||[])assert.match(control,/\bdisabled(?:=|\s|>)/);
assert.ok(koreaDate()<cancelled.date);
console.log('PASS: cancelled-match grouping, restore permissions, past-match protection and locked roster controls via server rendering');

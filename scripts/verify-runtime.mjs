import {spawn,spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {setTimeout as delay} from 'node:timers/promises';

// A separate disposable D1/R2 state directory; never touches real team data.
const state=path.resolve('.sites-runtime',`verify-${process.pid}`);
fs.mkdirSync(state,{recursive:true});
const wrangler='node_modules/wrangler/bin/wrangler.js';
const common=['--config','dist/server/wrangler.json','--local','--persist-to',state];
const env={...process.env,WRANGLER_SEND_METRICS:'false',WRANGLER_WRITE_LOGS:'false',CLOUDFLARE_CF_FETCH_ENABLED:'false'};
const schema=spawnSync(process.execPath,[wrangler,'d1','execute','DB',...common,'--file','drizzle/0000_solid_omega_sentinel.sql'],{stdio:'inherit',env});
if(schema.status!==0)process.exit(schema.status||1);
const child=spawn(process.execPath,[wrangler,'dev',...common,'--ip','127.0.0.1','--port','5179','--inspector-port','0'],{stdio:['pipe','pipe','pipe'],env});
let log='';
child.stdout.on('data',chunk=>{log+=chunk;});child.stderr.on('data',chunk=>{log+=chunk;});
let exit;
child.on('exit',code=>exit=code);
try{
  let ready=false;
  for(let i=0;i<60;i++){
    if(exit!==undefined)throw Error('Local Worker stopped: '+log);
    try{const r=await fetch('http://127.0.0.1:5179/api/team');if(r.status===401){ready=true;break;}}catch{}
    await delay(500);
  }
  if(!ready)throw Error('Local Worker did not start: '+log);
  const result=spawnSync(process.execPath,['scripts/verify-oct18.mjs'],{stdio:'inherit',env:{...env,ACRO_ORIGIN:'http://127.0.0.1:5179'}});
  if(result.status!==0)process.exitCode=result.status||1;
}catch(error){console.error(error);process.exitCode=1;}
finally{
  // Close the owned CLI only. Wrangler releases its workerd child on shutdown.
  child.stdin.end();child.kill('SIGINT');
  await Promise.race([new Promise(resolve=>child.once('exit',resolve)),delay(5000)]);
  if(child.exitCode===null)child.kill('SIGTERM');
}

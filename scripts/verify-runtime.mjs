import './sites-env.mjs';
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
Object.assign(process.env,{WRANGLER_CI_DISABLE_CONFIG_WATCHING:'true'});
let worker;
try{
  // The API can disable file watching; the interactive CLI restarts on config
  // or generated-file changes and can interrupt an otherwise valid mutation.
  const {unstable_dev}=await import('wrangler');
  worker=await unstable_dev('dist/server/index.js',{config:'dist/server/wrangler.json',ip:'127.0.0.1',port:0,inspectorPort:0,local:true,persistTo:state,logLevel:'error',experimental:{disableExperimentalWarning:true,disableDevRegistry:true,watch:false,testMode:true,liveReload:false}});
  const origin=`http://${worker.address}:${worker.port}`;
  let ready=false,stableReads=0;
  for(let i=0;i<60;i++){
    // Wrangler may expose the port before its initial worker reload completes.
    // Probe only safe reads until the JSON API is stable; never retry mutations.
    try{const r=await fetch(origin+'/api/team');const body=await r.json();stableReads=r.status===401&&typeof body.error==='string'?stableReads+1:0;if(stableReads>=4){ready=true;break;}}catch{stableReads=0;}
    await delay(500);
  }
  if(!ready)throw Error('Local test Worker did not start.');
  // Cloudflare redirects /offline.html to /offline. Cache the canonical URL:
  // a redirected cached response cannot serve a navigation with redirect=manual.
  const offline=await fetch(origin+'/offline');
  if(offline.status!==200||offline.redirected||!(await offline.text()).includes('잠시 연결이 끊겼어요'))throw Error('Offline fallback must be a direct HTML response.');
  const manifest=await fetch(origin+'/manifest.webmanifest');
  if(manifest.status!==200||(await manifest.json()).display!=='standalone')throw Error('Install manifest unavailable.');
  // Keep this event loop free to service the local runtime's bindings/proxy.
  const result=await new Promise((resolve,reject)=>{const child=spawn(process.execPath,['scripts/verify-oct18.mjs'],{stdio:'inherit',env:{...env,ACRO_ORIGIN:origin}});child.once('error',reject);child.once('exit',code=>resolve(code));});
  if(result!==0)process.exitCode=result||1;
}catch(error){console.error(error);process.exitCode=1;}
finally{
  await worker?.stop();
}

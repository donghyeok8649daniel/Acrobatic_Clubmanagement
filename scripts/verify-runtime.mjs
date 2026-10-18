import './sites-env.mjs';
import {spawn} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {setTimeout as delay} from 'node:timers/promises';

// A separate disposable D1/R2 state directory; never touches real team data.
const state=path.resolve('.sites-runtime',`verify-${process.pid}`);
fs.mkdirSync(state,{recursive:true});
const env={...process.env,WRANGLER_SEND_METRICS:'false',WRANGLER_WRITE_LOGS:'false',CLOUDFLARE_CF_FETCH_ENABLED:'false'};
const allScripts=['scripts/verify-oct18.mjs','scripts/verify-members.mjs','scripts/verify-member-lifecycle.mjs'];
const selectedScripts=process.argv.slice(2);
if(selectedScripts.some(script=>!allScripts.includes(script)))throw Error('Unknown integration test script.');
let worker;
try{
  console.log('Starting isolated local Worker');
  // Exercise the built Worker directly, without the interactive dev proxy's
  // reload/body forwarding layer, including simultaneous upload requests.
  const {unstable_getMiniflareWorkerOptions}=await import('wrangler');
  const {Miniflare}=await import('miniflare');
  const config=unstable_getMiniflareWorkerOptions('dist/server/wrangler.json');
  const serverRoot=path.dirname(config.main);
  const moduleFiles=fs.readdirSync(serverRoot,{recursive:true}).filter(v=>/\.(m?js|wasm)$/.test(v)).map(v=>path.join(serverRoot,v));
  const modules=[config.main,...moduleFiles.filter(v=>v!==config.main)].map(file=>({type:file.endsWith('.wasm')?'CompiledWasm':'ESModule',path:file}));
  const runtime=new Miniflare({host:'127.0.0.1',port:0,cf:false,d1Persist:path.join(state,'v3','d1'),r2Persist:path.join(state,'v3','r2'),workers:[{...config.workerOptions,name:'acrobatic-integration',modules,modulesRoot:serverRoot},...config.externalWorkers]});
  worker={stop:()=>runtime.dispose()};
  const origin=(await runtime.ready).origin;
  console.log('Local Worker ready: '+origin);
  // Initialize this disposable database through its own runtime binding. This
  // avoids an extra Wrangler subprocess and its shutdown/network lifecycle.
  const database=await runtime.getD1Database('DB','acrobatic-integration');
  const schema=fs.readdirSync('drizzle').filter(file=>file.endsWith('.sql')).sort().flatMap(file=>fs.readFileSync(path.join('drizzle',file),'utf8').split('--> statement-breakpoint').map(sql=>sql.trim()).filter(Boolean));
  await database.batch(schema.map(sql=>database.prepare(sql)));
  let ready=false,stableReads=0;
  for(let i=0;i<12;i++){
    // Wrangler may expose the port before its initial worker reload completes.
    // Probe only safe reads until the JSON API is stable; never retry mutations.
    try{const r=await fetch(origin+'/api/team',{signal:AbortSignal.timeout(5000)});const body=await r.json();stableReads=r.status===401&&typeof body.error==='string'?stableReads+1:0;if(stableReads>=4){ready=true;break;}}catch{stableReads=0;}
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
  for(const script of selectedScripts.length?selectedScripts:allScripts){
   const result=await new Promise((resolve,reject)=>{const child=spawn(process.execPath,[script],{stdio:'inherit',env:{...env,ACRO_ORIGIN:origin}});child.once('error',reject);child.once('exit',code=>resolve(code));});
   if(result!==0){process.exitCode=result||1;break;}
  }
}catch(error){console.error(error);process.exitCode=1;}
finally{
  await worker?.stop();
}

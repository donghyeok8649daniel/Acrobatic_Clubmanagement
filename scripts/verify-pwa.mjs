import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const manifest=JSON.parse(fs.readFileSync('public/manifest.webmanifest','utf8'));
assert.equal(manifest.display,'standalone');
assert.equal(manifest.id,'/');
assert.equal(manifest.start_url,'/');
assert.equal(manifest.scope,'/');
for (const icon of manifest.icons) {
  const bytes=fs.readFileSync('public'+icon.src);
  assert.equal(bytes.subarray(1,4).toString(),'PNG');
  const [w,h]=icon.sizes.split('x').map(Number);
  assert.equal(bytes.readUInt32BE(16),w);
  assert.equal(bytes.readUInt32BE(20),h);
}
assert.ok(manifest.icons.some(i=>i.purpose==='maskable'));
assert.ok(fs.readFileSync('app/layout.tsx','utf8').includes('manifest.webmanifest'));
const handlers={};let publicFiles=[],deleted=[],networkFails=false,fetches=0;
const offline=new Response('<h1>offline</h1>',{headers:{'content-type':'text/html'}});
const context={URL,Response,self:{location:{origin:'https://club.example'},addEventListener:(name,fn)=>handlers[name]=fn,skipWaiting:async()=>{},clients:{claim:async()=>{}}},caches:{open:async()=>({addAll:async list=>publicFiles=list}),keys:async()=>['acrobatic-public-v0','acrobatic-public-v1','another-app'],delete:async key=>deleted.push(key),match:async url=>url==='/offline'?offline.clone():undefined},fetch:async()=>{fetches++;if(networkFails)throw Error('offline');return new Response('network');}};
vm.runInNewContext(fs.readFileSync('public/sw.js','utf8'),context);
let pending;handlers.install({waitUntil:p=>pending=p});await pending;
assert.ok(publicFiles.includes('/offline'));
assert.ok(publicFiles.every(p=>!p.startsWith('/api/')&&p!=='/'));
handlers.activate({waitUntil:p=>pending=p});await pending;
assert.deepEqual(deleted,['acrobatic-public-v0']);
const request=(url,options={})=>{let response;handlers.fetch({request:{url:'https://club.example'+url,method:'GET',mode:'cors',...options},respondWith:p=>response=p});return response;};
for(const p of ['/api/team','/api/videos/secret','/api/private'])assert.equal(request(p),undefined);
assert.equal(request('/api/team',{method:'POST'}),undefined);
assert.equal(request('/',{url:'https://other.example/'}),undefined);
assert.equal(request('/assets/private.js'),undefined);
assert.equal(await (await request('/',{mode:'navigate'})).text(),'network');
networkFails=true;
assert.ok((await (await request('/',{mode:'navigate'})).text()).includes('offline'));
assert.equal(fetches,2);
console.log('PASS: install manifest, PNG sizes, public allowlist, private API bypass, offline fallback, scoped cache cleanup');

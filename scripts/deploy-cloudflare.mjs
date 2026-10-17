import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {readCloudflareDeployment, cloudflareBindings} from './cloudflare-config.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
process.chdir(root);
const config = readCloudflareDeployment(root);
const env = {...process.env, ACRO_DEPLOY_TARGET:'cloudflare', CLOUDFLARE_ACCOUNT_ID:config.accountId, WRANGLER_SEND_METRICS:'false', WRANGLER_WRITE_LOGS:'false'};
function run(args) {
  const result=spawnSync(process.execPath,args,{cwd:root,env,stdio:'inherit'});
  if(result.error)throw result.error;
  if(result.status!==0)process.exit(result.status||1);
}
run(['scripts/run-framework.mjs','build']);
const built = JSON.parse(fs.readFileSync(path.join(root,'dist/server/wrangler.json'),'utf8'));
if (built.name !== config.workerName || built.account_id !== config.accountId
  || built.d1_databases?.find(item => item.binding === 'DB')?.database_id !== config.databaseId
  || built.r2_buckets?.find(item => item.binding === 'BUCKET')?.bucket_name !== (config.videoStorageEnabled === false ? undefined : config.bucketName)) {
  throw Error('빌드 결과의 Cloudflare 계정·DB·영상 저장소가 배포 설정과 다릅니다. 원격 작업을 중단합니다.');
}
if(config.videoStorageEnabled === false) console.warn('영상 저장소 미연결: 공동 팀 기록은 사용할 수 있지만 영상 업로드는 저장소 연결 후 사용할 수 있습니다.');
const migrations=path.join(root,'.sites-runtime','cloudflare-migrations.json');
fs.writeFileSync(migrations,JSON.stringify({
  ...cloudflareBindings(config),
  compatibility_date:'2026-05-15',
  d1_databases:[{binding:'DB',database_name:config.databaseName,database_id:config.databaseId,migrations_dir:path.join(root,'drizzle')}]
},null,2));
run(['--import','./scripts/sites-env.mjs','node_modules/wrangler/bin/wrangler.js','d1','migrations','apply','DB','--remote','--config',migrations]);
run(['--import','./scripts/sites-env.mjs','node_modules/wrangler/bin/wrangler.js','deploy','--config','dist/server/wrangler.json']);

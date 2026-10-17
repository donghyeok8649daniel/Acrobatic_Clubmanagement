$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
$nodePath = (Get-Command node -ErrorAction Stop).Source
$npmPath = Join-Path (Split-Path -Parent $nodePath) 'node_modules/npm/bin/npm-cli.js'
if (-not (Test-Path -LiteralPath $npmPath)) { throw 'Node.js 22.13 이상과 npm이 필요합니다. Node 공식 설치 후 다시 실행해주세요.' }
if (-not (Test-Path -LiteralPath 'node_modules/vinext/dist/cli.js')) {
  & $nodePath $npmPath run install:ci
  if ($LASTEXITCODE -ne 0) { throw '패키지 설치에 실패했습니다.' }
}
$env:WRANGLER_SEND_METRICS='false'
$env:CLOUDFLARE_CF_FETCH_ENABLED='false'
if (-not (Test-Path -LiteralPath 'dist/server/wrangler.json')) {
  & $nodePath scripts/run-framework.mjs build
  if ($LASTEXITCODE -ne 0) { throw '앱 빌드에 실패했습니다.' }
}
if (-not (Test-Path -LiteralPath '.sites-runtime/local-db-ready')) {
  & $nodePath --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_solid_omega_sentinel.sql
  if ($LASTEXITCODE -ne 0) { throw '로컬 데이터베이스 준비에 실패했습니다.' }
  New-Item -ItemType Directory -Force -Path '.sites-runtime' | Out-Null
  Set-Content -LiteralPath '.sites-runtime/local-db-ready' -Value 'ready'
}
Write-Host '아크로바틱 수정본: 아래 Local 주소를 브라우저에서 여세요.'
Write-Host '우리 팀 만들기 → 팀 설정 · 초대 → 팀 현황 가져오기에서 함께 받은 JSON 파일을 선택하면 실제 명단이 적용됩니다.'
& $nodePath scripts/run-framework.mjs dev

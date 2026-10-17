# 개인 Cloudflare 계정 배포

이 배포는 개인 Cloudflare 계정의 Workers·D1·R2를 사용합니다. 기존 Sites 프로젝트 식별자와 주소는 그대로 보존합니다. 실제 팀 정보는 서버 로그인 뒤 저장하며 GitHub 소스에 넣지 않습니다.

## 최초 연결

```sh
npm run install:ci
npx wrangler login --scopes account:read user:read workers:write workers_scripts:write d1:write
npx wrangler whoami
npx wrangler d1 create acrobatic-club-db
npx wrangler r2 bucket create acrobatic-club-videos
```

브라우저에서 localhost 인증 완료 주소로 돌아오지 못하면, 기기 인증을 지원하는 공식 Wrangler로 연결할 수 있습니다. 앱의 빌드 의존성은 그대로 유지합니다.

```sh
npm exec --yes --package=wrangler@4.151.1 -- wrangler login --device --browser=false --scopes account:read user:read workers:write workers_scripts:write d1:write
```

개인 계정 이메일과 계정 ID를 확인하고, D1 생성 결과의 database_id를 사용하세요. R2는 계정에서 별도 활성화가 필요할 수 있습니다. 요금제·결제 정보가 필요한 화면은 계정 소유자가 확인합니다.

아래 형식의 `.sites-runtime/cloudflare.json`을 만드세요. 이 파일은 Git에 포함되지 않습니다. 계정 토큰이나 비밀번호는 넣지 않습니다.

```json
{
  "accountId": "개인 Cloudflare 계정의 32자리 ID",
  "databaseId": "생성한 D1 데이터베이스 UUID",
  "workerName": "acrobatic-clubmanagement",
  "databaseName": "acrobatic-club-db",
  "bucketName": "acrobatic-club-videos"
}
```

## 배포·업데이트

```sh
npm run deploy:cloudflare
```

실제 리소스 ID를 검사한 뒤 프로덕션 빌드 → 해당 D1의 미적용 마이그레이션 반영 → Worker 배포 순서로 실행합니다. 배포가 성공하면 터미널에 HTTPS 주소가 표시됩니다. 그 주소를 팀원에게 공유하세요. 일반 `npm run build`와 GitHub CI는 로컬 바인딩으로 검증하며 배포하지 않습니다.

## 팀 설정과 앱 설치

배포된 HTTPS 주소에서 `우리 팀 만들기`를 선택하고, 동장 계정의 `팀 설정 · 초대`에서 비공개 팀 현황 JSON을 가져옵니다. 개인 입장코드는 팀원마다 따로 전달하세요. 이미 같은 배포에 팀이 있으면 기존 팀 ID로 로그인하세요.

PC는 Chrome·Edge의 앱 설치, Android는 Chrome의 앱 설치/홈 화면에 추가, iPhone은 Safari의 공유 → 홈 화면에 추가를 사용합니다. 설치형 앱과 웹사이트가 같은 HTTPS 서버를 사용하므로 팀 기록은 함께 반영됩니다. 앱의 `앱 설치` 메뉴에도 설치 안내가 있습니다.

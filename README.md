# KAIST 아크로바틱 · 코트인

카이스트 족구동아리 아크로바틱을 위한 팀 관리 웹 앱입니다. 팀 ID와 개인 입장코드로 팀원들이 기록을 공유합니다. PC와 휴대폰에 설치할 수 있는 PWA이며, 별도의 EXE·APK·App Store 패키지는 포함하지 않습니다.

## 기능

- 대시보드, 공지, 명단과 주·세컨 포지션, 역할별 관리 권한
- 정기 훈련과 특정 날짜 휴훈, 일정별 참가 조사·출석
- 훈련 세션과 목표·드릴·피드백, 비공개 영상 업로드와 재생
- 경기 참가 조사 → 엔트리 → 공격수·세터·좌수비·우수비 BEST 4 배치
- 회비·수입·지출·CSV 내보내기, 장비와 운영 할 일
- 팀 현황 JSON 가져오기, 팀원별 입장코드 발급·재발급
- PC·Android·iPhone 설치 안내와 오프라인 재연결 화면

공개 첫 화면은 예시 공간입니다. 실제 명단·개인 입장코드·장부·영상은 이 저장소에 포함하지 않습니다. 팀 생성 후 동장 계정으로 로그인하여 `팀 설정 · 초대 → 팀 현황 가져오기`에서 비공개 JSON을 가져올 수 있습니다. 현황 파일은 별도 보관하고 Git에 커밋하지 마세요.

## 로컬 실행

Node.js 24 LTS와 npm이 필요합니다. Windows에서는 `start-local.ps1`을 실행하면 설치·빌드·로컬 DB 초기화를 거쳐 미리보기를 시작합니다.

다른 운영체제에서는 다음 순서로 실행합니다. DB 초기화 명령은 새 로컬 DB에서 최초 한 번만 실행하세요.

```sh
npm run install:ci
npm run build
node node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_solid_omega_sentinel.sql
npm run dev
```

기본 개발 주소는 `http://127.0.0.1:5173`입니다. 실제 주소는 터미널을 확인하세요. 로컬 DB는 컴퓨터 안에만 존재하며, 여러 기기에서 기록을 공유하려면 온라인 배포가 필요합니다.

## PC·모바일 설치

HTTPS로 배포된 앱을 열고 사이드바의 `앱 설치`를 누르세요.

- PC: Chrome·Edge 주소창의 설치 아이콘 또는 메뉴의 앱 설치
- Android: Chrome 메뉴 → 앱 설치 / 홈 화면에 추가
- iPhone·iPad: Safari 공유 → 홈 화면에 추가 → 웹 앱으로 열기

설치 후 같은 온라인 주소와 팀 ID·본인의 입장코드를 사용합니다. 브라우저와 설치 앱 사이의 로그인 공유 여부는 OS에 따라 다릅니다. 팀 기록과 영상을 이용하려면 인터넷이 필요합니다. 서비스 워커는 고정된 공개 아이콘·오프라인 안내만 캐시하며, API·영상·팀 데이터는 캐시하지 않습니다. 개발 모드에서는 서비스 워커를 등록하지 않으므로 설치 동작은 프로덕션 빌드에서 확인하세요.

설치 참고: [Chrome PWA 안내](https://developer.chrome.com/docs/lighthouse/pwa/installable-manifest), [Apple 홈 화면 웹 앱 안내](https://support.apple.com/guide/iphone/iphea86e5236/ios).

## 온라인 배포

React·Vinext·Vite와 Cloudflare Workers 런타임을 사용합니다. D1의 `DB` 바인딩에 팀 기록을, 비공개 R2의 `BUCKET` 바인딩에 영상을 저장합니다. GitHub Pages만으로는 API와 공동 저장 기능이 동작하지 않습니다.

기존 Sites 프로젝트 식별자는 `.openai/hosting.json`에 유지되어 있습니다. 기존 사이트 소유자·편집자 권한이 연결된 환경에서 Sites 소스 동기화 → 빌드 → 버전 저장 → 배포 순서로 업데이트하세요. 기존 사이트의 데이터·주소·공개 범위를 유지합니다. GitHub CI는 검증과 빌드 결과 생성만 수행하며 자동으로 사이트를 배포하지 않습니다.

직접 Cloudflare로 운영하려면 본인 계정의 실제 D1 데이터베이스·R2 버킷 바인딩과 Worker 이름을 `vite.config.ts`에 설정하고 빌드해야 합니다. 현재 데이터베이스 ID는 로컬 개발용 자리표시자이므로 이 값으로 직접 원격 배포하지 마세요. 기존 Sites 배포에서는 플랫폼이 실제 저장소 바인딩을 연결합니다. 계정 토큰은 GitHub Secrets 등 인증 저장소에만 보관하세요.

## 검증

```sh
npm run typecheck
npm run test:unit
npm run build
npm run test:integration
```

통합 검증은 별도의 로컬 테스트 D1·R2를 만들고 5179 포트에서 실행합니다. 팀 생성·16명 현황 가져오기·역할 권한·반복 출석·경기 엔트리·BEST 4·훈련 기록·영상 업로드·범위 요청·다른 팀 접근 차단을 확인합니다. 실제 영상의 코덱별 재생과 OS별 설치 완료는 별도 기기 검증이 필요합니다.

GitHub Actions에서도 같은 검사를 수행합니다. 빌드 결과는 `acrobatic-worker-build` 아티팩트로 보관됩니다. `.wrangler`, `.sites-runtime`, `.env*`, `team-status*.json`과 개인 데이터는 커밋 대상에서 제외됩니다.

## 운영

팀원마다 별도의 입장코드를 전달하세요. 주장의 코드를 팀원에게 공유하지 마세요. 서버에는 코드의 해시를 저장하며 세션은 HttpOnly 쿠키를 사용합니다. 영상은 MP4·WebM·MOV, 파일당 최대 80 MB, 팀 전체 2 GB까지입니다. 영상 코덱 지원은 브라우저에 따라 다릅니다.

초기 명단은 16명의 임시 이름이며 예산·경기·장비 기록은 비어 있습니다. 실제 동아리의 개인 정보와 운영 현황은 로그인한 팀에만 가져오세요.

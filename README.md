# KAIST 아크로바틱 · 코트인

카이스트 족구동아리 아크로바틱을 위한 팀 관리 앱입니다. 팀 ID와 개인 입장코드로 팀원들이 기록을 공유합니다. [온라인 앱](https://acrobatic-clubmanagement.acrobatic-kaist.workers.dev/)을 사용하거나 Windows EXE·PC 및 휴대폰 PWA로 설치할 수 있습니다.

**Windows 다운로드:** [최신 GitHub Release](https://github.com/donghyeok8649daniel/Acrobatic_Clubmanagement/releases/latest)에서 `Acrobatic-Setup-…-x64.exe`를 받아 실행하세요. 현재 Windows 사용자 계정에 설치하고 바탕화면·시작 메뉴에 ‘아크로바틱’을 추가합니다. Windows 10/11 64비트를 지원하며 인터넷 연결이 필요합니다. PC 앱도 같은 온라인 서버의 팀 기록을 사용합니다.

## 기능

- 대시보드, 공지, 명단과 주·세컨 포지션, 역할별 관리 권한
- 팀원별 프로필 사진 등록·변경·삭제, 공격수·세터·수비별 팀장 지정과 배지
- 로그인 화면과 상단 메뉴의 한국어 / English 전환, 기기별 언어 저장. 이름·작성 기록·입력값은 유지하며 메뉴·포지션·역할·날짜·안내 문구를 번역합니다.
- 정기 훈련과 특정 날짜 휴훈, 일정별 참가 조사·출석
- 훈련 세션과 목표·드릴·피드백, 비공개 영상 업로드와 재생
- 경기 참가 조사 → 엔트리 → 공격수·세터·좌수비·우수비 BEST 4 배치
- 매니저 전환·귀국 상태 변경 시 예정 경기 엔트리·BEST 4와 현재 라인업에서 제외하며, 지난 경기와 출석 기록은 보존
- 예정 경기 취소·복원: 출석·엔트리·BEST 4를 보관하고 취소 중에는 참가 조사를 잠급니다. 취소된 경기는 다음 일정에서 제외하며 경기 화면의 ‘취소된 경기’와 달력에서 다시 열 수 있습니다. 중복 요청은 한 번만 반영하고 오래된 화면의 상충 요청은 거부합니다.
- 회비·수입·지출·CSV 내보내기, 장비와 운영 할 일
- 팀 현황 JSON 가져오기, 팀원별 입장코드 발급·재발급
- PC·Android·iPhone 설치 안내와 오프라인 재연결 화면

공개 첫 화면은 팀 로그인입니다. 기존 팀은 발급된 팀 ID와 개인 입장코드로 로그인하면 등록된 실명·포지션·운영 기록이 표시됩니다. 예시 화면은 별도로 선택해야 열립니다. 실제 명단·개인 입장코드·장부·영상은 이 저장소에 포함하지 않습니다. 새 팀 생성 후에는 동장 계정의 `팀 설정 · 초대 → 팀 현황 가져오기`에서 비공개 JSON을 가져올 수 있습니다. 현황 파일은 별도 보관하고 Git에 커밋하지 마세요.

## 로컬 실행

Node.js 24 LTS와 npm이 필요합니다. Windows에서는 `start-local.ps1`을 실행하면 설치·빌드·로컬 DB 초기화를 거쳐 미리보기를 시작합니다.

다른 운영체제에서는 다음 순서로 실행합니다. DB 초기화 명령은 새 로컬 DB에서 최초 한 번만 실행하세요.

```sh
npm run install:ci
npm run build
node node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_solid_omega_sentinel.sql
node node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0001_cloudy_nocturne.sql
npm run dev
```

기본 개발 주소는 `http://127.0.0.1:5173`입니다. 실제 주소는 터미널을 확인하세요. 로컬 DB는 컴퓨터 안에만 존재하며, 여러 기기에서 기록을 공유하려면 온라인 배포가 필요합니다.

## PC·모바일 설치

Windows 설치 파일의 소스와 빌드 방법은 [desktop 안내](desktop/README.md)에 있습니다. 설치 파일 없이 사용하려면 아래 PWA 방식도 지원합니다.

HTTPS로 배포된 앱을 열고 사이드바의 `앱 설치`를 누르세요.

- PC: Chrome·Edge 주소창의 설치 아이콘 또는 메뉴의 앱 설치
- Android: Chrome 메뉴 → 앱 설치 / 홈 화면에 추가
- iPhone·iPad: Safari 공유 → 홈 화면에 추가 → 웹 앱으로 열기

설치 후 같은 온라인 주소와 팀 ID·본인의 입장코드를 사용합니다. 브라우저와 설치 앱 사이의 로그인 공유 여부는 OS에 따라 다릅니다. 팀 기록과 영상을 이용하려면 인터넷이 필요합니다. 서비스 워커는 고정된 공개 아이콘·오프라인 안내만 캐시하며, API·영상·팀 데이터는 캐시하지 않습니다. 개발 모드에서는 서비스 워커를 등록하지 않으므로 설치 동작은 프로덕션 빌드에서 확인하세요.

설치 참고: [Chrome PWA 안내](https://developer.chrome.com/docs/lighthouse/pwa/installable-manifest), [Apple 홈 화면 웹 앱 안내](https://support.apple.com/guide/iphone/iphea86e5236/ios).

## 온라인 배포

React·Vinext·Vite와 Cloudflare Workers 런타임을 사용합니다. D1의 `DB` 바인딩에 팀 기록을, 비공개 R2의 `BUCKET` 바인딩에 영상을 저장합니다. GitHub Pages만으로는 API와 공동 저장 기능이 동작하지 않습니다.

기존 Sites 프로젝트 식별자는 `.openai/hosting.json`에 유지되어 있습니다. 기존 사이트 소유자·편집자 권한이 연결된 환경에서 Sites 소스 동기화 → 빌드 → 버전 저장 → 배포 순서로 업데이트하세요. 기존 사이트의 데이터·주소·공개 범위를 유지합니다. GitHub CI는 검증과 빌드 결과 생성만 수행하며 자동으로 사이트를 배포하지 않습니다.

직접 Cloudflare로 운영하는 절차는 [Cloudflare 배포 안내](DEPLOY-CLOUDFLARE.md)를 따르세요. 실제 D1·R2 리소스 정보를 Git에서 제외된 `.sites-runtime/cloudflare.json`에 설정한 뒤 `npm run deploy:cloudflare`를 실행합니다. 배포 스크립트가 실제 바인딩을 검증하고 빌드·DB 마이그레이션·Worker 배포를 수행합니다. 계정 토큰이나 비밀번호를 소스에 넣지 마세요.

## 검증

```sh
npm run typecheck
npm run test:unit
npm run build
npm run test:integration
```

통합 검증은 별도의 로컬 테스트 D1·R2와 충돌 없는 임시 포트를 사용합니다. 팀 생성·16명 현황 가져오기·역할 권한·반복 출석·경기 엔트리·BEST 4·훈련 기록·영상 업로드·범위 요청·다른 팀 접근 차단을 확인합니다. 실제 영상의 코덱별 재생과 OS별 설치 완료는 별도 기기 검증이 필요합니다.

GitHub Actions에서도 같은 검사를 수행합니다. 빌드 결과는 `acrobatic-worker-build` 아티팩트로 보관됩니다. `.wrangler`, `.sites-runtime`, `.env*`, `team-status*.json`과 개인 데이터는 커밋 대상에서 제외됩니다.

## 운영

팀원마다 별도의 입장코드를 전달하세요. 주장의 코드를 팀원에게 공유하지 마세요. 서버에는 코드의 해시를 저장하며 세션은 HttpOnly 쿠키를 사용합니다. 영상은 MP4·WebM·MOV, 파일당 최대 80 MB, 팀 전체 2 GB까지입니다. 영상 코덱 지원은 브라우저에 따라 다릅니다.

프로필 사진은 브라우저에서 중앙을 정사각형으로 자르고 최대 512px·128KB JPEG로 압축하여 D1에 저장합니다. 별도 R2 활성화 없이 사용할 수 있으며 팀 로그인 뒤에만 표시됩니다. 본인 또는 관리 담당자가 등록·삭제할 수 있고, 팀 현황을 다시 가져와도 기존 사진은 유지됩니다. 사진 파일과 팀 기록의 사진 버전은 같은 DB 트랜잭션으로 갱신합니다.

포지션 팀장은 동장만 지정합니다. 해당 주·세컨 포지션을 가진 선수 중에서 선택하며, 지정 자체가 추가 관리 권한을 주지는 않습니다. 포지션 변경이나 귀국으로 자격이 사라지면 해당 팀장 지정이 해제됩니다. 최초에는 모두 미정입니다.

새 팀을 직접 생성하면 임시 명단으로 시작하며 예산·경기·장비 기록은 비어 있습니다. 이미 등록된 팀은 새로 만들지 말고 기존 팀 ID와 개인 입장코드로 로그인하세요. 실제 동아리의 개인 정보와 운영 현황은 로그인한 팀에만 가져오세요.

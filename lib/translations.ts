export type Language='ko'|'en';

// UI labels only. Form values and team records stay in their original language.
const entries=`
팀 대시보드|Dashboard
일정 · 출석|Schedule & attendance
팀원 관리|Members
훈련 세션 · 영상|Training & videos
경기 · 엔트리|Matches & lineup
회비 · 재정|Dues & finances
공지사항|Notices
할 일 · 장비|Tasks & equipment
참석|Attending
불참|Not attending
닫기|Close
저장하기|Save
저장하는 중…|Saving…
공격수|Attacker
공격|Attack
결정적인 공격으로 득점을 만드는 자리|Score points with decisive attacks
세터|Setter
공격의 흐름을 연결하는 자리|Connect the defense and attack
수비|Defender
좌수비|Left defender
코트 왼쪽을 지키는 든든한 수비|Cover the left side of the court
우수비|Right defender
코트 오른쪽을 지키는 든든한 수비|Cover the right side of the court
멀티|Utility
미배정|Unassigned
선수 선택|Select player
전체|All
회비|Dues
미지정|Unassigned
인터넷 연결 후 다시 시도해주세요.|Connect to the internet and try again.
요청을 처리하지 못했습니다.|Could not complete the request.
팀 연결을 확인해주세요.|Check your team connection.
인터넷 연결을 확인해주세요.|Check your internet connection.
세션 만료|Session expired
연결 확인 필요|Check connection
체험 공간에 반영했어요. 실제 팀은 팀 만들기로 시작하세요.|Updated the demo. Create a team to save real records.
팀에 저장했어요.|Saved to your team.
팀에 입장했어요.|Signed in to your team.
복사했어요.|Copied.
복사할 내용을 길게 눌러 복사해주세요.|Press and hold the text to copy it.
팀 정보를 불러오지 못했습니다.|Could not load team information.
선택 안 함|None
날짜|Date
항목|Item
분류|Category
금액|Amount
팀원|Member
회비 장부를 내려받았어요.|Downloaded the finance ledger.
친선 경기|Friendly match
할 일 삭제|Delete task
카이스트 아크로바틱 팀 만들기|Create a KAIST Acrobatic team
카이스트 아크로바틱에 입장하기|Sign in to KAIST Acrobatic
새로운 팀 일정|New team event
팀 일정|Team event
팀 공지|Team notice
팀 소식 전하기|Share team news
수입 · 지출 등록|Record income or expense
경기의 순간 기록하기|Record a match result
함께할 일 추가|Add a team task
팀 장비 등록|Add team equipment
함께 뛸 선수 선택|Choose your lineup
아크로바틱, 준비 완료!|Acrobatic is ready!
개인 입장코드|Personal entry code
기록을 삭제할까요?|Delete this record?
다른 역할로 둘러보기|Preview another role
팀 기록 검색|Search team records
훈련 세션 기록|Training session record
우리 팀 공간|Our team space
메뉴 닫기|Close menu
카이스트 족구동아리 매니저|KAIST jokgu club manager
KAIST 가동아리 · 첫 학기|KAIST provisional club · First semester
혼자보다 강한,|Stronger together.
우리라는 팀.|One team.
앱 설치|Install app
팀 설정 · 초대|Settings & invitations
메뉴 열기|Open menu
팀 설정|Team settings
검색|Search
체험 모드|Demo
팀 연결됨|Connected
공지사항 보기|View notices
팀 로그인|Team sign-in
카이스트 아크로바틱의 팀 공간입니다.|Welcome to the KAIST Acrobatic team space.
지금 보이는 이름과 기록은 예시예요.|The names and records shown here are examples.
우리 팀 만들기|Create our team
오늘도, 코트에서 만나요|See you on the court
카이스트 족구동아리|KAIST jokgu club
의 팀플레이를 한눈에 확인하세요.| — your team at a glance.
함께 뛰는 팀원|Our team members
명|
선수|Player
매니저|Manager
다음 일정 참석|Next event attendance
첫 일정을 등록해보세요|Add your first event
팀 회비 잔액|Team balance
미입력|Not recorded
원| KRW
이번 달|This month
건 수입 기록| income records
우리 팀 시즌 기록|Season record
승| W
패| L
승률|Win rate
총|Total
경기|Matches
다음 팀 일정|Next team event
첫 훈련을 기다리고 있어요|Ready for our first practice
한 번의 킥, 한 번의 연결. 함께 더 나아지는 시간.|Every kick, every connection. Getting better together.
참석 여부 등록|Update attendance
명 참석 예정| attending
첫 일정 만들기|Create first event
다가오는 팀 일정|Upcoming events
같은 시간, 같은 코트에서 만나요.|Same time, same court. See you there.
전체 일정|All events
등록된 일정이 없어요.|No events yet.
우리는|We are
팀원 전체 보기|View all members
모두 보기|View all
필독|Pinned
새로운 공지를 기다리고 있어요.|No notices yet.
팀 운영 체크리스트|Team checklist
추가|Add
우리 팀의 할 일을 추가해보세요.|Add a task for your team.
함께 하나씩, 차근차근.|One step at a time, together.
경기가 잡히면, 함께 준비해요|Get ready when a match is scheduled
참가 조사 · 엔트리 · BEST 4|Attendance · Roster · BEST 4
우리의 다음 팀플레이|Our next team activity
훈련부터 친선전까지, 일정과 출석을 함께 관리해요.|Manage practice, friendlies and attendance together.
일정 등록|Add event
년| / 
월|
이전 달|Previous month
다음 달|Next month
오늘|Today
훈련 · 팀 일정|Training & team events
일정 목록|Event list
일정을 눌러 참석 여부를 알려주세요.|Select an event to update your attendance.
이번 달 등록된 일정이 없어요.|No events this month.
함께 뛰는|Our team of
각자의 자리에서, 하나의 팀으로.|Different positions. One team.
주 포지션 기준 · 세컨 포지션은 각 프로필에서 확인|Grouped by primary position. See profiles for secondary positions.
관리 담당자|Team administrators
이름 또는 포지션 검색|Search name or position
활동 중|Active
프랑스 귀국 예정|— returning to France
미정|Undecided
부 ·|Secondary ·
프로필 보기|View profile
검색한 팀원이 없어요.|No matching members.
참가 여부를 조사하고 경기별 엔트리와 BEST 4를 구성해요.|Check availability and select a match roster and BEST 4.
경기 일정 등록|Schedule match
총 경기|Matches played
승리|Wins
패배|Losses
완료된 경기 기록|Completed matches
아직 치른 경기가 없으면 비워두세요. 스코어는 세트 승수 기준입니다.|Leave this empty until a match is played. Enter sets won for the score.
결과 등록|Add result
경기 기록 삭제|Delete result
신생 운동부의 첫 경기를 기다리고 있어요. 확정 경기와 대회는 아직 없습니다.|Our new club is waiting for its first match. No matches or tournaments are confirmed yet.
투명하게, 우리 팀 살림|Our team finances, together
회비 납부와 지출 내역을 팀원 모두가 함께 확인해요.|Everyone can view dues, income and expenses.
예산 주 담당:|Finance lead:
· 현재 동장 중심 운영|· Currently managed by the captain
현재 팀 잔액|Current balance
전체 수입과 지출 기준|Based on all income and expenses
월별 회비 현황|Monthly dues
회비 기준 월|Dues month
명 납부| paid
1인|Per member
회비 미정|Dues not set
이번 달 회비 수입|Dues received this month
팀원별 납부 확인|Member payments
해당 월의 납부 합계가 월 회비 이상이면 납부로 표시해요.|Marked paid when the month's total reaches the monthly dues amount.
납부|Paid
미납|Unpaid
전체 수입 · 지출 장부|Income & expense ledger
CSV 내보내기|Export CSV
내역 삭제|Delete transaction
아직 등록된 회비와 지출 내역이 없어요.|No dues or expenses recorded yet.
팀의 이야기가 모이는 곳|Team news, in one place
놓치면 아쉬운 소식, 팀원 모두에게 전해요.|Keep everyone up to date.
공지 작성|Write notice
필독 공지|Pinned notice
우리 팀의 첫 소식을 기다리고 있어요.|Share your team's first update.
코트 밖에서도, 팀플레이|Teamwork beyond the court
할 일을 나누고 장비를 챙기면, 경기에 더 집중할 수 있어요.|Share tasks and look after equipment so you can focus on the game.
장비 주 담당:|Equipment lead:
· 장비 수량은 확인 후 등록|· Add quantities after checking inventory
담당자를 정하고 함께 준비해요.|Assign tasks and get ready together.
할 일 추가|Add task
새로운 할 일을 등록해보세요.|Add a new task.
팀 장비 보관함|Team equipment
수량부터 보관 담당자까지 한눈에.|Track quantities, condition and who holds each item.
장비 등록|Add equipment
개|
보관|Held by
수정|Edit
장비 삭제|Delete equipment
우리 팀의 장비를 등록해보세요.|Add your team's equipment.
우리 팀을 우리답게|Make this space yours
팀 정보와 멤버 초대를 관리하는 공간이에요.|Manage team information and member invitations.
팀 기본 정보|Team information
팀 설정은 동장 · 주장만 수정할 수 있어요.|Only the club president / captain can edit team settings.
동아리 이름|Club name
팀 소개|Team introduction
1인 월 회비 (원)|Monthly dues per member (KRW)
월 회비|Monthly dues
우리 팀 ID|Our team ID
팀 ID 복사|Copy team ID
실제 팀을 만들면 고유한 팀 ID가 발급됩니다.|A unique team ID is issued when you create a real team.
팀 ID와 개인 입장코드를 함께 전달해주세요.|Share the team ID along with each person's entry code.
아크로바틱 팀 만들기|Create an Acrobatic team
로그아웃했어요.|Signed out.
로그아웃|Sign out
팀원 초대 · 개인 입장코드|Invite members · Personal codes
코드는 각 팀원에게 개인적으로 전달해주세요.|Send each code privately to its owner.
실제 팀을 만든 뒤 팀원별 코드를 발급할 수 있어요.|Create a real team to issue individual entry codes.
코드 보기|View code
코드 재발급|Reissue code
입장코드는 동장에게 요청해주세요. 개인 입장코드는 본인만 사용하세요.|Ask the captain for your code. Keep your personal code to yourself.
역할별로 함께 관리해요|Manage the team by role
동장 · 주장|President / captain
전체 운영 · 팀 설정 · 입장코드 발급|Full management · Team settings · Entry codes
일정 · 명단 · 회비 · 공지 · 장비 관리|Events · Members · Finances · Notices · Equipment
선수 · 매니저|Player / manager
선수 활동과 운영 관리 함께 담당|Player duties and team administration
팀 정보 열람 · 본인 출석 · 담당 할 일 완료|View team records · Own attendance · Assigned tasks
체험 역할 바꿔보기|Preview another role
우리의 모든 순간이, 팀의 기록으로.|Every moment becomes part of our team story.
우리 팀|Our team
동장 · 주장 1명, 매니저 1명, 선수 · 매니저 1명, 선수 13명. 총 16명의 빈 팀 공간을 만들어요.|Start with 16 members: one captain, one manager, one player/manager and 13 players.
동장 · 주장 이름|President / captain name
내 이름을 입력해주세요|Enter your name
실제 팀에는 예시 기록이 포함되지 않아요. 팀원 이름은 생성 후 수정할 수 있어요.|Real teams start with no example records. You can edit member names after creation.
팀 ID와 동장에게 받은|Use your team ID and
본인 입장코드|personal entry code
로 입장하세요.| to sign in.
다른 기기에서도 같은 팀의 기록을 함께 볼 수 있어요.|View the same team records on any device.
팀 ID|Team ID
동장에게 받은 개인 코드|Your code from the captain
팀에 입장하기|Sign in to team
아직 팀이 없나요? 우리 팀 만들기|No team yet? Create your team
팀 공간이 만들어졌어요.|Your team space is ready.
주장 입장코드|captain's entry code
를 안전한 곳에 저장해주세요. 이 코드로 다른 기기에서도 로그인할 수 있어요.| — save it somewhere safe to sign in on other devices.
나의 입장코드 · 동장/주장|My entry code · President / captain
팀 ID:|Team ID:
개인 입장코드:|Personal entry code:
내 로그인 정보 복사|Copy my sign-in details
팀원 초대하러 가기|Invite team members
코드는 이번 접속 중에만 확인할 수 있어요. 주장 코드를 분실하면 복구가 어려우니 꼭 보관해주세요.|Codes are visible only during this session. Keep the captain's code safe; recovery is difficult if it is lost.
일정 이름|Event title
예: 토요일 정기 훈련|e.g. Saturday practice
일정 유형|Event type
정기 훈련|Regular practice
대회|Tournament
팀 모임|Team gathering
시작 시간|Start time
종료 시간 (선택)|End time (optional)
장소|Location
훈련 또는 경기 장소|Practice or match location
상대 팀 (경기일 때, 선택)|Opponent (matches, optional)
준비물 · 안내|What to bring / notes
01. 경기 참가 여부|01. Match availability
나의 참석 여부|My attendance
팀원 출석|Member attendance
명 참석| attending
출석|Attendance
이 훈련의 세션 기록 만들기|Create a session for this practice
일정 수정하기|Edit event
일정 삭제|Delete event
공지 제목|Notice title
공지 내용|Notice body
필독 공지로 고정|Pin as a required notice
공지 수정하기|Edit notice
공지 삭제|Delete notice
이름|Name
주 포지션|Primary position
세컨 포지션|Secondary position
운영|Administration
포지션 특이사항 (선택)|Position notes (optional)
활동 상태|Member status
부상 회복 중|Recovering from injury
휴식 중|On a break
귀국|Returned home
메모 (선택)|Notes (optional)
수입 / 지출|Income / expense
수입|Income
지출|Expense
이번 달 회비|This month's dues
금액 (원)|Amount (KRW)
기타 수입|Other income
대관|Court rental
장비|Equipment
식비|Food
기타 지출|Other expense
관련 팀원|Related member
세션 이름|Session title
훈련 날짜|Practice date
훈련 목표 (선택)|Training goals (optional)
연습 메뉴 · 진행 순서 (선택)|Drills / session plan (optional)
훈련 후 피드백 (선택)|Post-training feedback (optional)
상대 팀 이름|Opponent name
경기 날짜|Match date
우리 팀 세트 승수|Our sets won
상대 팀 세트 승수|Opponent's sets won
경기 메모 · 다음 훈련 과제|Match notes / next training priorities
할 일|Task
예: 친선전 구장 예약하기|e.g. Book a court for a friendly
담당자|Assigned to
장비 이름|Equipment name
수량|Quantity
상태|Condition
양호|Good
세탁 필요|Needs cleaning
수리 필요|Needs repair
교체 필요|Needs replacement
보관 담당자|Held by
배치할 선수|Player to assign
비워두기|Leave empty
이 기록은 팀원 모두의 화면에서 삭제됩니다.|This record will be deleted for every team member.
취소|Cancel
삭제하기|Delete
입장코드는 이 팀원의 권한으로 로그인하는 열쇠예요.|This code signs in with this member's permissions.
초대 정보 복사|Copy invitation
재발급하면 기존 입장코드와 해당 팀원의 로그인 세션이 만료돼요. 새 코드는 발급 직후 꼭 복사해주세요.|Reissuing invalidates the old code and the member's sessions. Copy the new code immediately.
새 입장코드를 발급했어요.|New entry code issued.
새 입장코드 발급|Issue new entry code
체험 공간에서 역할별 화면을 확인할 수 있어요.|Preview each role in the demo space.
일정, 팀원, 공지 검색|Search events, members and notices
팀원 ·|Member ·
공지 ·|Notice ·
검색 결과가 없어요.|No results found.
찾고 싶은 팀 기록의 키워드를 입력해주세요.|Enter a keyword to find team records.
계정으로 입장했어요.| — signed in.
팀 설정으로 이동|Go to team settings
임원진|Officers
아직 미정|Not decided yet
확정|Confirmed
(예정 후보)|(Potential candidates)
예산 · 장비 주 담당|Finance & equipment lead
장비:|Equipment:
동장 중심 운영|Managed by the president
매주|Every
요일|
훈련 요일|Day of week
정기훈련 반복 일정|Recurring practice
주간 일정을 저장하면 매주 자동으로 달력에 표시됩니다.|Saved weekly practices appear automatically on the calendar.
반복 일정 제거|Remove recurring practice
반복 시작일|First date
시작|Start
종료|End
훈련 장소|Practice location
훈련 장소를 입력하세요|Enter the practice location
안내 (선택)|Notes (optional)
반복 일정 추가|Add recurring practice
팀 현황 가져오기|Import team setup
명단과 담당자, 정기훈련 정보를 한 번에 반영합니다.|Import the roster, responsibilities and recurring practices together.
32KB 이하의 팀 현황 파일을 선택해주세요.|Choose a team setup file under 32KB.
지원하는 팀 현황 파일이 아닙니다.|This team setup file is not supported.
팀 현황 JSON 선택|Choose team setup JSON
동장:|President:
임원진:|Officers:
경기·장부·영상·출석: 기존 기록 보존|Existing matches, finances, videos and attendance are preserved.
기존 계정 ID를 유지한 채 프로필을 갱신합니다. 선수 이름과 기존 계정의 대응을 확인한 후 적용하세요.|Updates profiles while preserving account IDs. Check that each name matches its existing account before applying.
이 현황을 팀에 반영|Apply this setup
02. 출전 엔트리|02. Match roster
명 선택| selected
참가 여부에서 ‘참석’을 선택한 선수 중 출전 인원을 정하세요.|Select the match roster from players marked as attending.
03. 경기 BEST 4|03. Match BEST 4
후보는 주 포지션 → 세컨 포지션 순으로 표시하며, 자동 배정하지 않습니다. 엔트리와 BEST 4는 이 경기에만 적용됩니다. 불참으로 바뀐 선수는 자동으로 빠집니다.|Candidates are ordered by primary, then secondary position. Assignments are manual and apply only to this match. Players who decline attendance are removed automatically.
예정 경기 · 참가 조사|Upcoming matches & availability
경기가 잡히면 참가 조사 → 엔트리 → BEST 4 순으로 준비해요.|For each match, collect availability, select a roster, then choose the BEST 4.
경기 잡기|Schedule a match
명 참석 / 엔트리| attending / roster
아직 잡힌 경기가 없어요.|No matches scheduled yet.
확정되면 참가 인원을 조사하고 경기별 엔트리와 BEST 4를 정해요.|Once confirmed, check availability and choose the match roster and BEST 4.
영상 업로드는 실제 팀 로그인 후 사용할 수 있어요.|Sign in to a real team to upload videos.
80MB 이하의 영상 파일을 선택해주세요.|Choose a video file under 80MB.
MP4, WebM, MOV 파일을 선택해주세요.|Choose an MP4, WebM or MOV file.
업로드하지 못했습니다.|Upload failed.
연결이 끊겼습니다. 다시 시도해주세요.|Connection lost. Please try again.
훈련 영상을 저장했어요.|Training video saved.
훈련의 모든 순간|Every moment of practice
훈련 목표와 연습 메뉴, 영상 피드백을 세션별로 모아보세요.|Organize training goals, drills and video feedback by session.
훈련 세션 만들기|Create training session
아직 기록한 훈련 세션이 없어요.|No training sessions recorded yet.
목표와 연습 메뉴를 적고, 훈련 후 영상을 올려보세요.|Write your goals and drills, then upload videos after practice.
첫 훈련 세션 만들기|Create your first session
훈련 세션|Training sessions
개 영상| videos
세션 수정|Edit session
훈련 목표|Training goals
연습 메뉴|Drills
훈련 후 피드백|Post-training feedback
아직 작성하지 않았어요.|Not written yet.
세션 삭제|Delete session
세션 영상|Session videos
팀원만 볼 수 있는 우리 팀의 훈련 영상|Training videos visible only to your team
영상 올리기|Upload video
영상 삭제|Delete video
이 훈련의 첫 영상을 올려보세요.|Upload the first video for this session.
MP4 · WebM · MOV / 파일당 최대 80MB, 팀 전체 2GB. 긴 영상은 짧게 나누어 올려주세요. MOV 재생은 기기 코덱에 따라 달라질 수 있어요.|MP4 · WebM · MOV / Up to 80MB per file and 2GB per team. Split long videos into short clips. MOV playback depends on your device's codecs.
이 영상을 팀 저장소에서 삭제할까요?|Delete this video from team storage?
영상을 삭제했어요.|Video deleted.
삭제|Delete
함께 뛰는 우리,|We play together.
아크로바틱.|Acrobatic.
명단과 포지션, 훈련과 출석.|Members and positions. Training and attendance.
우리 팀의 기록이 한곳에서 이어집니다.|Your team's story, all in one place.
우리 팀을 연결하는 중…|Connecting to your team…
새 팀 만들기|Create a new team
아크로바틱 팀 로그인|Acrobatic team sign-in
저장된 로그인을 확인하고 있어요.|Checking your saved session.
새 팀을 처음 개설할 때만 사용하세요.|Use this only to create a new team.
동장에게 받은 팀 ID와 본인의 입장코드로 입장하세요. 등록된 실명과 포지션이 자동으로 표시됩니다.|Sign in with the team ID and your personal code from the captain. Your registered name and positions appear automatically.
팀 이름|Team name
동장 이름|President's name
본인의 입장코드|Your personal entry code
연결하는 중…|Connecting…
팀 만들기|Create team
우리 팀 입장|Sign in to our team
이미 팀이 있나요?|Already have a team?
처음 팀을 개설하나요?|Creating your first team?
예시 화면 둘러보기|Explore the demo
프로필 사진|Profile photo
15MB 이하의 사진 파일을 선택해주세요.|Choose a photo under 15MB.
사진을 읽지 못했어요. JPG·PNG·WebP 파일을 선택해주세요.|Could not read this photo. Choose a JPG, PNG or WebP file.
이 기기에서 사진을 처리하지 못했습니다.|This device could not process the photo.
사진 크기를 확인해주세요.|Check the photo dimensions.
사진 용량을 줄이지 못했습니다. 다른 사진을 선택해주세요.|Could not compress this photo. Please choose another.
사진을 저장하지 못했습니다.|Could not save the photo.
프로필 사진을 등록했어요.|Profile photo saved.
프로필 사진을 삭제했어요.|Profile photo deleted.
프로필 사진 파일|Profile photo file
사진 저장 중…|Saving photo…
사진 변경|Change photo
사진 등록|Add photo
사진 삭제|Delete photo
사진 등록은 실제 팀 로그인 후 사용할 수 있어요.|Sign in to a real team to add photos.
사진 중앙을 정사각형으로 잘라 저장해요. 팀원에게 함께 표시됩니다.|Photos are cropped to a square from the center and shared with your team.
프로필 사진을 삭제할까요?|Delete this profile photo?
포지션별 팀장|Position leaders
주·세컨 포지션에 해당하는 선수를 지정하세요.|Choose players with a matching primary or secondary position.
공격수 · 세터 · 수비 파트의 팀장을 확인해요.|See the leaders for attackers, setters and defenders.
팀장|Leader
팀장 지정|Assign leader
미정 · 지정 해제|Undecided · Clear assignment
팀장은 동장만 지정할 수 있어요. 관리 담당자 권한과는 별도로 표시됩니다.|Only the president can assign position leaders. This does not grant administrative permissions.
설치 준비가 지연되고 있어요. 잠시 후 새로고침해주세요.|Installation is taking longer than expected. Refresh shortly.
설치가 완료되면 앱 아이콘으로 실행하세요.|After installation, open the app using its icon.
원할 때 브라우저 메뉴에서 다시 설치할 수 있어요.|You can install it later from your browser menu.
브라우저 메뉴에서 앱 설치를 선택해주세요.|Choose Install app in your browser menu.
아크로바틱 앱|Acrobatic app
코트 밖에서도, 우리 팀과 연결|Stay connected beyond the court
컴퓨터와 휴대폰에 설치하고 같은 팀 ID로 함께 사용하세요.|Install on your computer or phone and use the same team ID.
앱으로 실행 중이에요.|Running as an installed app.
아크로바틱 앱 설치|Install Acrobatic
아래 방법으로 설치하세요. 브라우저에 따라 ‘앱 설치’ 또는 ‘홈 화면에 추가’로 표시됩니다.|Follow the steps below. Your browser may call it Install app or Add to Home Screen.
컴퓨터|Computer
Chrome·Edge에서 사이트를 열고 주소창의 설치 아이콘 또는 메뉴의 ‘앱 설치’를 선택하세요.|Open the site in Chrome or Edge. Select the install icon in the address bar or Install app in the menu.
안드로이드|Android
Chrome에서 사이트를 열고 ⋮ 메뉴 → ‘앱 설치’ 또는 ‘홈 화면에 추가’를 선택하세요.|Open the site in Chrome. In the ⋮ menu, choose Install app or Add to Home Screen.
아이폰 · 아이패드|iPhone / iPad
Safari에서 사이트를 열고 공유 → ‘홈 화면에 추가’를 선택하세요. ‘웹 앱으로 열기’가 보이면 켜주세요.|Open the site in Safari. Choose Share → Add to Home Screen. Enable Open as Web App if shown.
출석·장부·영상은 인터넷에 연결했을 때 팀원들과 공유됩니다. 설치한 기기에서도 팀 ID와 본인의 입장코드로 로그인해주세요.|Attendance, finances and videos are shared while online. Sign in on installed devices with your team ID and personal code.
연결이 끊겼어요. 인터넷 연결 후 다시 이용해주세요.|You are offline. Reconnect to continue.
동장 예시|Example captain
선수 매니저|Player manager
카이스트 족구동아리 · 함께 뛰고, 함께 성장하는 팀|KAIST jokgu club · Play together, grow together
가동아리 · 첫 학기|Provisional club · First semester
2027년 봄 대회 참여 검토 · 대회 및 경기 미확정|Considering spring 2027 tournaments · No confirmed events
훈련 참여율과 멤버 수가 늘어나면 훈련 확대 검토|Consider more practices as attendance and membership grow
입력 내용을 확인해주세요.|Check your input.
날짜를 확인해주세요.|Check the date.
시간을 확인해주세요.|Check the time.
정기훈련은 최대 7개까지 등록할 수 있습니다.|You can add up to seven recurring practices.
종료 시간은 시작 시간 뒤여야 합니다.|End time must be after start time.
요일을 확인해주세요.|Check the day of the week.
정기훈련 ID를 확인해주세요.|Check the recurring practice ID.
명단은 1~100명까지 등록할 수 있습니다.|The roster must contain 1–100 members.
중복된 이름 또는 잘못된 팀원 ID입니다.|Duplicate name or invalid member ID.
역할을 확인해주세요.|Check the role.
등번호를 확인해주세요.|Check the shirt number.
귀국 예정 월을 확인해주세요.|Check the expected departure month.
현재 동장 계정은 유지해야 합니다.|The current president's account must be retained.
기존 팀원의 ID를 제거할 수 없습니다. 활동 상태를 변경해주세요.|Existing member IDs cannot be removed. Change their status instead.
임원진 확정 여부를 확인해주세요.|Check whether officers are confirmed.
담당자 ID를 확인해주세요.|Check the assignee's ID.
회비를 확인해주세요.|Check the dues amount.
팀원을 찾을 수 없습니다.|Member not found.
관리 담당자만 수정할 수 있습니다.|Only administrators can edit this.
동장만 수정할 수 있습니다.|Only the president can edit this.
담당자를 선택해주세요.|Choose an assignee.
일정이 없습니다.|Event not found.
수정할 기록이 없습니다.|Record not found.
포지션을 확인해주세요.|Check the position.
해당 주·세컨 포지션을 가진 선수를 선택해주세요.|Choose a player with a matching primary or secondary position.
본인의 출석만 변경할 수 있습니다.|You can change only your own attendance.
출석을 선택해주세요.|Choose an attendance status.
경기 일정에서만 엔트리를 편집할 수 있습니다.|Rosters can be edited only for match events.
참석하는 선수만 엔트리에 넣을 수 있습니다.|Only attending players can join the match roster.
경기 포지션을 확인해주세요.|Check the match position.
참석 엔트리에 있는 선수를 선택해주세요.|Choose an attending player from the match roster.
금액을 확인해주세요.|Check the amount.
승패가 있는 세트 스코어를 입력해주세요.|Enter a set score with a winner and loser.
팀원이 없습니다.|No team members found.
등번호는 미정 또는 0~99로 입력해주세요.|Leave the shirt number empty or enter 0–99.
할 일이 없습니다.|Task not found.
담당자만 완료할 수 있습니다.|Only the assignee can complete this task.
수량을 확인해주세요.|Check the quantity.
연결할 일정이 없습니다.|Linked event not found.
선수를 선택해주세요.|Choose a player.
삭제할 수 없습니다.|This cannot be deleted.
영상을 먼저 삭제한 뒤 세션을 삭제해주세요.|Delete the session's videos before deleting the session.
지원하지 않는 작업입니다.|Unsupported action.
팀 기록 용량을 초과했습니다. 오래된 기록을 내보내고 정리해주세요.|Team record storage is full. Export and remove older records.
팀이 없습니다.|Team not found.
팀 기록 용량을 초과했습니다.|Team record storage is full.
다른 팀원이 수정 중입니다. 다시 시도해주세요.|Another member is editing. Please try again.
데이터베이스 연결이 필요합니다.|A database connection is required.
팀을 찾을 수 없습니다.|Team not found.
동시에 저장 중입니다. 다시 시도해주세요.|Another save is in progress. Please try again.
로그인이 필요합니다.|Please sign in.
팀 로그인이 필요합니다.|Please sign in to your team.
다시 로그인해주세요.|Please sign in again.
허용되지 않는 요청입니다.|This request is not allowed.
잘못된 요청입니다.|Invalid request.
입력이 너무 깁니다.|The input is too long.
팀 이름과 동장 이름을 입력해주세요.|Enter the team name and president's name.
팀 ID와 입장코드를 확인해주세요.|Check the team ID and entry code.
팀 ID 또는 개인 입장코드가 올바르지 않습니다.|Incorrect team ID or personal entry code.
동장만 초대코드를 발급할 수 있습니다.|Only the president can issue entry codes.
시도가 너무 많습니다. 잠시 후 다시 시도해주세요.|Too many attempts. Please try again later.
데이터베이스가 연결되지 않았습니다.|The database is not connected.
저장하지 못했습니다. 잠시 후 다시 시도해주세요.|Could not save. Please try again shortly.
영상 저장소 연결이 필요합니다.|Video storage needs to be connected.
영상 저장소가 없습니다.|Video storage is unavailable.
영상을 찾을 수 없습니다.|Video not found.
영상 파일이 없습니다.|Video file not found.
영상을 불러오지 못했습니다.|Could not load the video.
내가 올린 영상만 삭제할 수 있습니다.|You can delete only your own videos.
영상을 삭제하지 못했습니다.|Could not delete the video.
영상 파일 크기를 확인해주세요.|Check the video file size.
영상은 80MB 이하로 올려주세요.|Videos must be no larger than 80MB.
MP4, WebM, MOV 형식만 지원합니다.|Only MP4, WebM and MOV formats are supported.
훈련 세션을 먼저 선택해주세요.|Select a training session first.
하루에 영상은 20개까지 올릴 수 있습니다.|You can upload up to 20 videos per day.
팀 영상 저장 한도 2GB를 초과했습니다.|The team's 2GB video storage limit has been reached.
팀 영상 한도를 초과했습니다.|The team's video storage limit has been reached.
훈련 세션이 삭제되었습니다.|This training session has been deleted.
영상을 저장하지 못했습니다.|Could not save the video.
사진이 없습니다.|Photo not found.
사진을 불러오지 못했습니다.|Could not load the photo.
사진을 선택해주세요.|Choose a photo.
프로필 사진은 128KB까지 저장할 수 있습니다.|Stored profile photos must be no larger than 128KB.
본인 사진만 변경할 수 있습니다.|You can change only your own photo.
JPEG 사진으로 변환해서 올려주세요.|Convert the photo to JPEG before uploading.
취소된 경기|Cancelled matches
취소됨|Cancelled
경기 취소|Cancel match
경기 복원|Restore match
경기를 취소할까요?|Cancel this match?
취소 확인|Confirm cancellation
취소해도 출석·엔트리·BEST 4는 보관됩니다.|Attendance, the roster and BEST 4 are preserved when cancelled.
취소된 경기는 참가 조사가 잠깁니다. 복원하면 다시 진행할 수 있어요.|Availability is locked while cancelled. Restore the match to reopen it.
취소된 경기의 출석과 엔트리는 변경할 수 없습니다.|Attendance and the roster cannot be changed while a match is cancelled.
예정 경기만 취소하거나 복원할 수 있습니다.|Only upcoming matches can be cancelled or restored.
경기 상태를 확인해주세요.|Check the match status.
다른 팀원이 경기 상태를 변경했어요. 새로고침 후 다시 시도해주세요.|Another member changed this match's status. Refresh and try again.
취소된 경기는 복원한 뒤 일정 유형을 변경해주세요.|Restore this cancelled match before changing it to another event type.
예정 경기는 삭제 대신 경기 취소를 사용해주세요.|Use Cancel match instead of deleting an upcoming match.
`;
export const english:Readonly<Record<string,string>>=Object.fromEntries(entries.trim().split('\n').map(row=>{const index=row.indexOf('|');return [row.slice(0,index),row.slice(index+1)];}));

export function formatMonth(value:string,language:Language):string{
 if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(value))return value;
 return new Date(value+'-01T12:00:00Z').toLocaleDateString(language==='en'?'en-US':'ko-KR',{year:'numeric',month:'long',timeZone:'UTC'});
}

export function translate(text:string,language:Language):string{
 if(language==='ko'||!/[가-힣]/.test(text))return text;
 const trimmed=text.trim();
 if(Object.hasOwn(english,trimmed))return text.slice(0,text.indexOf(trimmed))+english[trimmed]+text.slice(text.indexOf(trimmed)+trimmed.length);
 // Labels composed from fixed UI enums and a dynamic name, count or position.
 const rules:[RegExp,(...values:string[])=>string][]=[
  [/^(.+)의 프로필$/,(_all,name)=>name+"'s profile"],
  [/^(.+) 프로필 사진$/,(_all,name)=>name+' profile photo'],
  [/^(.+) 출석$/,(_all,name)=>name+' attendance'],
  [/^(.+) 완료 전환$/,(_all,title)=>'Toggle completion: '+title],
  [/^함께 뛰는 (\d+)명$/,(_all,count)=>'Our '+count+' team members'],
  [/^(공격수|세터|수비) 팀장 지정$/,(_all,position)=>'Assign '+translate(position,'en').toLowerCase()+' leader'],
  [/^(공격수|세터|수비) 팀장$/,(_all,position)=>translate(position,'en')+' leader'],
  [/^(공격수|세터|수비|선수|매니저|동장 · 주장|선수 · 매니저) 역할로 전환했어요\.$/,(_all,role)=>'Switched to '+translate(role,'en')+'.'],
  [/^(일|월|화|수|목|금|토)요일$/,(_all,day)=>['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']['일월화수목금토'.indexOf(day)]],
 ];
 for(const [pattern,render] of rules)if(pattern.test(trimmed))return trimmed.replace(pattern,render);
 // Composite option labels: names remain untouched, positions and roles translate.
 if(text.includes(' · ')||text.includes(' / ')||/^부 /.test(text))return text.split(/( · | \/ | → |, |부 )/).map(part=>part==='부 '?'Secondary ':Object.hasOwn(english,part)?english[part]:part).join('');
 return text;
}

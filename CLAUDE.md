# JoyCoin Project - Development Notes

## 최근 작업 (2026-02-04)

### 페이지 구조 정리 완료
1. **통합 및 개선**
   - `/mypage` 페이지를 완전한 마이페이지로 개선
   - 유저 정보, 잔액, 입금 내역 모두 통합
   - 로그아웃 기능 추가 (API 연동)

2. **중복 페이지 제거**
   - `/deposits` 폴더 삭제 (mypage와 중복)
   - `/purchase` 폴더 삭제 (buy로 통합)

3. **라우팅 일관성 확보**
   - 마이페이지: `/mypage` (통일)
   - 구매 페이지: `/buy` (통일)

4. **인증 방식 통일**
   - `admin/dashboard` 인증을 HttpOnly 쿠키로 변경
   - 모든 페이지에서 `credentials: 'include'` 사용
   - `getCookie`, `deleteCookie` 함수 제거 (불필요)

### 현재 페이지 구조
```
frontend/src/app/
  ├── auth/
  │   ├── login/        - 사용자 로그인
  │   └── signup/       - 사용자 회원가입
  ├── admin/
  │   ├── login/        - 관리자 로그인
  │   ├── signup/       - 관리자 회원가입
  │   ├── dashboard/    - 관리자 대시보드 (실제 API 연동)
  │   └── referrers/    - 추천인 관리
  ├── buy/              - 패키지 구매 (QR 코드 + 입금 주소 표시)
  ├── mypage/           - 마이페이지 (유저 정보 + 잔액 + 입금 내역)
  └── page.tsx          - 메인 페이지
```

---

### 2차 작업: 핵심 기능 구현 완료

1. **관리자 대시보드 실제 API 연동**
   - `GET /admin/deposits` - 입금 요청 목록 조회
   - `POST /admin/deposits/{id}/approve` - 승인 (유저 잔액 자동 충전)
   - `POST /admin/deposits/{id}/reject` - 거절
   - 실시간 통계 (대기중/승인완료/거절됨 카운트)
   - 이메일 마스킹 (개인정보 보호)

2. **QR 코드 및 입금 주소 표시**
   - 입금 요청 성공 시 모달로 QR 코드 표시
   - `assigned_address` 표시 (복사 가능)
   - 입금 금액 및 네트워크 정보 표시
   - 주의사항 안내

3. **텔레그램 알림 시스템**
   - `backend/app/services/telegram.py` 추가
   - 입금 요청 시 관리자에게 알림
   - 승인 완료 시 알림
   - 환경변수 설정: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`
   - 알림 실패 시에도 서비스는 정상 작동 (비동기)

### 환경변수 설정 필요

```env
# backend/.env
USDT_ADMIN_ADDRESS=입금받을주소
TELEGRAM_BOT_TOKEN=봇토큰
TELEGRAM_CHAT_ID=채팅ID
```

---

### 3차 작업: 프론트엔드 환경 설정 및 보안 패치

1. **Node.js 환경 구성**
   - Windows 환경에서 Node.js 설치 필요
   - PowerShell 실행 정책 문제 → CMD 사용 권장
   - `npm install`로 의존성 설치 완료

2. **TypeScript 환경 설정**
   - `@types/node` 패키지 설치로 TypeScript 오류 해결
   - `node_modules` 생성으로 타입 정의 파일 인식

3. **Next.js 보안 패치**
   - Next.js 14.2.5 → 14.2.35로 업그레이드
   - Critical 보안 취약점 해결:
     - Cache Poisoning
     - DoS (Denial of Service)
     - SSRF (Server-Side Request Forgery)
     - Authorization Bypass
   - 커밋: `e6d449d` - "fix: Next.js 보안 패치"

4. **트러블슈팅 기록**
   - Windows에서 npm 명령어 인식 안 됨 → Node.js 설치 필요
   - PowerShell 실행 정책 오류 → CMD 터미널 사용
   - ESLint 관련 취약점 4개 남음 (개발용 도구, 프로덕션 무관)

---

### 4차 작업: 핵심 버그 수정 (2026-02-04)

1. **User 모델에 `balance` 필드 추가**
   - `Numeric(12, 2)`, default=0
   - 입금 승인 시 잔액 충전이 실제로 반영됨
   - `/auth/me` 에서 `float(current_user.balance or 0)` 반환

2. **`/auth/logout` 엔드포인트 추가**
   - `accessToken` 쿠키 삭제
   - mypage, admin dashboard 로그아웃 404 에러 해결

3. **mypage 필드명 불일치 수정**
   - `dep.amount_usdt` → `dep.expected_amount`
   - 백엔드 `DepositRequestOut` 스키마와 일치하도록 수정

4. **Admin deposits API에 user 정보 포함**
   - `AdminDepositRequestOut` 스키마 추가 (nested `user` 객체)
   - `UserBrief` 스키마: `{id, email, username}`
   - `joinedload(DepositRequest.user)` 로 N+1 방지
   - 프론트엔드 `req.user.email` 정상 작동

5. **잔액 충전 로직 개선**
   - `hasattr` 체크 제거 (balance 필드 확정)
   - `float(user.balance or 0) + float(dr.actual_amount)` 안전 계산

---

### 5차 작업: 섹터 관리 시스템 구현 (2026-02-04)

**권한 구조:**
```
Admin (총관리자) → 입금 승인/거절, 섹터 Fee 설정
Sector Manager (A~E) → 자기 섹터 입금 내역 확인, Fee 확인
User (일반 유저) → 입금 요청
```

1. **Sector 모델 추가** (`backend/app/models/sector.py`)
   - name: A, B, C, D, E
   - fee_percent: 5, 10, 15, 20 (Admin이 설정)
   - 시드 데이터: A~E 섹터 자동 생성 (기본 fee 5%)

2. **User 모델 확장**
   - `sector_id` 필드 추가 (ForeignKey → sectors)
   - `UserRole.SECTOR_MANAGER` 추가

3. **Admin API** (`backend/app/api/admin_sectors.py`)
   - `GET /admin/sectors` - 섹터 목록 조회
   - `PUT /admin/sectors/{id}/fee` - Fee 변경 (5/10/15/20)
   - `POST /admin/sectors/assign-manager` - 유저를 섹터 매니저로 배정

4. **Sector Manager API** (`backend/app/api/sector_dashboard.py`)
   - `GET /sector/dashboard` - 내 섹터 통계 (총 입금액, fee 수익, 유저 수)
   - `GET /sector/deposits?search=` - 내 섹터 입금 내역 (검색 가능)

5. **Admin Dashboard UI 개선** (`frontend/src/app/admin/dashboard/`)
   - 탭 분리: "입금 요청 관리" / "섹터 Fee 설정"
   - 입금 검색 기능 (이메일, 유저명, ID)
   - 상태 필터 (전체/대기/승인/거절)
   - 스크롤 고정 (`h-screen` + `overflow-hidden` + 내부 `overflow-y-auto`)
   - 테이블 `max-h-[50vh]` + sticky 헤더

6. **Sector 프론트엔드** (`frontend/src/app/sector/`)
   - `/sector/login` - 섹터 매니저 전용 로그인 (role 체크)
   - `/sector/dashboard` - 통계 카드 + 입금 내역 + 검색

7. **섹터 매니저 배정 방법**
   - Admin이 API로 유저를 sector_manager로 배정
   - `POST /admin/sectors/assign-manager` body: `{user_id, sector_id}`

---

## API Schemas

### Backend Centers API Response
```json
[
  {"id": 1, "name": "센터명", "region": "지역명"}
]
```

### Backend Auth Signup Request
```json
{
  "email": "string (required)",
  "password": "string (required, min 12 chars)",
  "username": "string (required)",
  "sector_id": "number (optional, 1~5 = A~E)",
  "referral_code": "string (optional)"
}
```

### Backend Sectors Public API
```json
GET /sectors → [{"id": 1, "name": "A"}, {"id": 2, "name": "B"}, ...]
```

---

### 7차 작업: UI 개선 + 센터→섹터 통합 + 가격 수정 (2026-02-05)

1. **헤더 네비게이션 개선** (`frontend/src/components/HeaderNav.tsx`)
   - 로그인 버튼 제거 (layout.tsx에서)
   - 언어 선택 토글 추가: [한국어 | ENG]
   - 클라이언트 컴포넌트로 분리 (layout.tsx는 서버 컴포넌트)
   - 언어 전환 시 네비 텍스트 변경 (마이페이지↔My Page, 구매하기↔Buy)

2. **회원가입: 센터 → 섹터 통합**
   - 기존 문제: 회원가입에서 "센터(서울/부산/대구)" 선택, Admin은 "섹터(A~E)" 관리 → 연결 안 됨
   - 수정: 회원가입에서 섹터(A~E) 선택하도록 변경
   - `frontend/src/app/auth/signup/page.tsx`: centers → sectors 전환
   - `backend/app/schemas/auth.py`: `sector_id` 필드 추가
   - `backend/app/api/auth.py`: Sector import, sector_id 검증 및 저장
   - `backend/app/main.py`: `GET /sectors` 공개 API 추가

3. **JOY 가격 수정 (1 JOY = $0.2)**
   - `main.py` 시드 데이터 + DB 직접 UPDATE
   - 1000 JOY: $200 / ₩260,000
   - 2000 JOY: $380 / ₩494,000 (5% 할인)
   - 5000 JOY: $900 / ₩1,170,000 (10% 할인)
   - 환율: 1 JOY = ₩260 (= $0.2 × ₩1,300)

4. **섹터별 매니저 계정 생성 완료**

| 섹터 | 이메일 | 비밀번호 |
|------|--------|----------|
| A | sector.a@joycoin.com | SectorA@2026! |
| B | sector.b@joycoin.com | SectorB@2026! |
| C | sector.c@joycoin.com | SectorC@2026! |
| D | sector.d@joycoin.com | SectorD@2026! |
| E | sector.e@joycoin.com | SectorE@2026! |

**관리자 계정**: `admin@example.com` / `admin12345678`

---

### 6차 작업: 버그 수정 및 안정화 (2026-02-04)

**발견된 문제들과 수정:**

1. **`.next` 캐시 손상 → 서버 에러**
   - 증상: `Cannot find module './819.js'` 에러로 모든 페이지 500
   - 원인: `.next` 빌드 캐시가 손상됨 (코드 수정 후 dev 서버가 불완전 재컴파일)
   - 해결: `.next` 폴더 삭제 후 `npx next build` 재실행
   - **교훈: 서버 에러 발생 시 `.next` 폴더 삭제 후 재빌드가 가장 먼저 시도할 조치**

2. **랜딩페이지 깨진 링크 수정**
   - `page.tsx`: `href="/purchase"` → `href="/buy"` (존재하지 않는 경로)
   - `layout.tsx`: `href="/deposits"` → `href="/mypage"` (삭제된 경로)
   - **교훈: 페이지 삭제/이동 시 모든 링크 참조를 반드시 검색해서 수정할 것**

3. **`/auth/me` 응답에 center 정보 누락**
   - mypage에서 `user?.center?.name` 사용하는데 API가 center를 안 줌
   - 수정: center relationship을 로딩해서 `{id, name, region}` 객체로 반환
   - `referral_code` 필드도 추가
   - **교훈: 프론트엔드에서 사용하는 필드를 백엔드 API가 반환하는지 항상 확인**

4. **DB 마이그레이션 누락 (`sector_id` 컬럼)**
   - `create_all()`은 새 테이블만 만들고, 기존 테이블에 컬럼을 추가하지 않음
   - 수동 SQL: `ALTER TABLE users ADD COLUMN sector_id INTEGER REFERENCES sectors(id)`
   - **교훈: 모델에 필드 추가 후 반드시 DB 마이그레이션 실행 (ALTER TABLE 또는 Alembic)**

---

## Common Mistakes to Avoid

### Frontend
1. **TypeScript 타입 불일치**: API 응답과 프론트엔드 타입을 항상 일치시킬 것
   - Centers: `{id: number; name: string; region: string}`
   - 잘못된 예: `{id: number, name: string}` (region 누락)
   - **수정됨 (2026-02-03)**: signup/page.tsx에서 centers 타입에 region 추가

2. **API 필드명 불일치**: 백엔드 스키마와 프론트엔드 요청 필드명 일치 필수
   - 올바른 예: `email`, `password`, `username`, `center_id`, `referral_code`
   - 잘못된 예: `username`에 이메일 값 전송
   - **수정됨 (2026-02-03)**: admin/signup/page.tsx에서 email/username 필드 수정

3. **HttpOnly 쿠키 사용시**: `credentials: 'include'` 필수
   - **수정됨 (2026-02-04)**: admin/dashboard에서 getCookie 제거, credentials: 'include'로 통일

4. **페이지 중복 금지**: 비슷한 기능의 페이지는 하나로 통합
   - **수정됨 (2026-02-04)**: /deposits와 /mypage 통합, /purchase와 /buy 통합

5. **입금 내역 필드명**: 백엔드는 `expected_amount`를 반환, 프론트에서 `amount_usdt` 사용 금지
   - 올바른 예: `dep.expected_amount`
   - 잘못된 예: `dep.amount_usdt` (undefined)
   - **수정됨 (2026-02-04)**: mypage/page.tsx 수정

6. **페이지 삭제/이동 후 링크 검색 필수**: `grep -r "/purchase"`, `grep -r "/deposits"` 등으로 전체 검색
   - 삭제된 페이지: `/deposits` (→ `/mypage`), `/purchase` (→ `/buy`)
   - **수정됨 (2026-02-04)**: page.tsx, layout.tsx 링크 수정

7. **`.next` 캐시 손상 시 대처**: 모듈 에러 발생하면 `.next` 폴더 삭제 후 재빌드
   - 증상: `Cannot find module './XXX.js'`
   - 해결: `rm -rf .next && npx next build && npx next dev`

8. **`/auth/me` 응답 필드 추가 시 프론트엔드 확인**: mypage 등에서 사용하는 모든 필드가 API에 포함되어야 함
   - 현재 반환 필드: `id, email, username, balance, role, referral_code, center`
   - **수정됨 (2026-02-04)**: center 객체, referral_code 추가

9. **코드 수정 후 반드시 `.next` 캐시 삭제**: 변수명/state 변경 시 dev 서버가 구버전 캐시를 로드할 수 있음
   - 예: `centers` → `sectors`로 변경했는데 dev 서버가 구버전 로드 → `ReferenceError: centers is not defined`
   - 해결: 포트 3000 프로세스 kill → `.next` 삭제 → `npx next dev`
   - **수정됨 (2026-02-05)**: signup에서 centers→sectors 변경 후 캐시 문제 발생

10. **센터와 섹터 혼동 금지**: 회원가입은 섹터(A~E) 선택, 센터는 더 이상 사용 안 함
   - 회원가입 API: `sector_id` 사용 (center_id 아님)
   - **수정됨 (2026-02-05)**: signup에서 centers 드롭다운 → sectors 드롭다운으로 변경

11. **Admin API 응답에 nested user 필요**: `AdminDepositRequestOut` 스키마 사용
   - 프론트엔드: `req.user.email`, `req.user.username`
   - 백엔드: `joinedload(DepositRequest.user)` 필수
   - **수정됨 (2026-02-04)**: admin_deposits.py, deposits schema 수정

### Backend
1. **SQLAlchemy 관계**: foreign_keys 명시 필요한 경우 양쪽 모두 설정
2. **Enum 검증**: role, status 등에 validator 사용
3. **User.balance는 Numeric(12,2)**: float 변환 시 `float(user.balance or 0)` 사용
4. **`create_all()`은 새 컬럼을 추가하지 않음**: 기존 테이블에 필드 추가 시 반드시 ALTER TABLE 실행
   - 예: `ALTER TABLE users ADD COLUMN sector_id INTEGER REFERENCES sectors(id) ON DELETE SET NULL;`
   - 예: `CREATE INDEX ix_users_sector_id ON users(sector_id);`
   - **수정됨 (2026-02-04)**: sector_id 컬럼 수동 추가
5. **API 응답과 프론트엔드 필드 동기화**: 새 필드 추가 시 프론트에서 사용하는 곳 모두 확인

### Docker (Windows)
1. **PostgreSQL 볼륨**: Windows에서 바인드 마운트 대신 네임드 볼륨 사용
   - 잘못된 예: `./docker-data/postgres:/var/lib/postgresql/data`
   - 올바른 예: `postgres_data:/var/lib/postgresql/data` + volumes 섹션 정의

## File Structure
```
backend/
  app/
    api/
      auth.py              - 인증 API (signup, login, me, logout)
      deposits.py          - 유저 입금 요청
      admin_deposits.py    - 관리자 입금 승인/거절
      admin_sectors.py     - 관리자 섹터 Fee 관리
      sector_dashboard.py  - 섹터 매니저 대시보드
    models/
      user.py              - User 모델 (balance, sector_id 포함)
      sector.py            - Sector 모델 (name, fee_percent)
      deposit_request.py   - 입금 요청 모델
    core/
      enums.py             - Enum (UserRole: user/admin/sector_manager)
      auth.py              - 인증 미들웨어 (get_current_user/admin/sector_manager)
    schemas/
      deposits.py          - DepositRequestOut, AdminDepositRequestOut, UserBrief

frontend/
  src/
    components/
      HeaderNav.tsx          - 헤더 네비게이션 (언어 토글 포함)
    app/
      auth/login/            - 사용자 로그인
      auth/signup/           - 사용자 회원가입 (섹터 A~E 선택)
      admin/login/           - 관리자 로그인
      admin/dashboard/       - 관리자 대시보드 (입금관리 + 섹터Fee 탭)
      sector/login/          - 섹터 매니저 로그인
      sector/dashboard/      - 섹터 매니저 대시보드
      buy/                   - JOY 구매 (1 JOY = $0.2)
      mypage/                - 마이페이지
```

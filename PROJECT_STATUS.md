# JoyCoin Website Project - 프로젝트 현황

> 최종 업데이트: 2026-02-04

---

## 목차
1. [프로젝트 개요](#프로젝트-개요)
2. [기술 스택](#기술-스택)
3. [현재 구현된 기능](#현재-구현된-기능)
4. [수정 완료 사항](#수정-완료-사항)
5. [앞으로 해야 할 작업](#앞으로-해야-할-작업)
6. [프로젝트 구조](#프로젝트-구조)
7. [실행 방법](#실행-방법)
8. [API 명세](#api-명세)

---

## 프로젝트 개요

JoyCoin은 암호화폐 코인 구매 및 추천인 시스템을 갖춘 웹 플랫폼입니다.

### 주요 기능
- 회원가입/로그인 (JWT 인증)
- 조이코인 구매 (USDT 결제)
- 입금 요청 및 관리
- 추천인 시스템 (포인트 보상)
- 관리자 입금 승인/거부

---

## 기술 스택

### Frontend
| 기술 | 버전 | 용도 |
|------|------|------|
| Next.js | 14.2.5 | React 프레임워크 |
| React | 18.2.0 | UI 라이브러리 |
| TypeScript | 5.4.5 | 타입 안전성 |
| Tailwind CSS | 3.4.10 | 스타일링 |
| react-qr-code | 2.0.18 | QR 코드 생성 |

### Backend
| 기술 | 버전 | 용도 |
|------|------|------|
| FastAPI | 0.128.0 | API 프레임워크 |
| SQLAlchemy | 2.0.46 | ORM |
| PostgreSQL | 15 | 데이터베이스 |
| Python | 3.11 | 백엔드 언어 |
| Argon2 | - | 비밀번호 해싱 |
| PyJWT | - | JWT 토큰 |

### Infrastructure
| 기술 | 용도 |
|------|------|
| Docker | 컨테이너화 |
| Docker Compose | 멀티 컨테이너 관리 |
| Redis | 캐싱 (준비됨) |

---

## 현재 구현된 기능

### 사용자 기능

#### 인증
- [x] 회원가입 (이메일, 비밀번호 12자 이상, 닉네임)
- [x] 센터 선택 (드롭다운)
- [x] 추천인 코드 입력 (선택)
- [x] 로그인 (JWT 토큰 발급)
- [x] 로그아웃
- [x] 내 정보 조회 (`/auth/me`)

#### 코인 구매
- [x] 수량 선택 (1,000 / 5,000 / 10,000 JOY)
- [x] 수량 추가 버튼
- [x] USDT 금액 자동 계산 (1 JOY = $0.20)
- [x] 입금 요청 생성
- [x] QR 코드 표시 (지갑 주소 + 금액)
- [x] 관리자 지갑 주소 표시

#### 마이페이지
- [x] 입금 내역 조회
- [x] 입금 상태 표시 (대기중/입금완료/거부됨)
- [x] 사용자 정보 표시 (이름, 이메일)
- [x] 내 추천인 코드 표시 및 복사

### 관리자 기능 (API만 구현)
- [x] 입금 요청 목록 조회
- [x] 입금 승인
- [x] 입금 거부
- [x] 사용자 목록 조회
- [x] 사용자 관리자 승격

### 시스템 기능
- [x] 자동 추천인 코드 생성 (JOY + 5자리)
- [x] 추천인 보상 100포인트 자동 지급
- [x] 초기 데이터 시딩 (센터 3개, 상품 3개, 환율)
- [x] 슈퍼 관리자 자동 생성

---

## 수정 완료 사항

### 2026-02-04 수정 내역

#### 버그 수정

| # | 파일 | 문제 | 해결 |
|---|------|------|------|
| 1 | `backend/app/models/user.py` | SQLAlchemy 관계 모호성 에러 | `foreign_keys` 명시 추가 |
| 2 | `backend/app/models/deposit_request.py` | User 관계 foreign_keys 누락 | `foreign_keys=[user_id]` 추가 |
| 3 | `frontend/src/app/deposits/page.tsx` | Hydration 에러 (useMemo + localStorage) | useState + useEffect로 변경 |
| 4 | `frontend/src/app/buy/page.tsx` | Hydration 에러 | useState + useEffect로 변경 |

#### 기능 추가

| # | 파일 | 추가 내용 |
|---|------|----------|
| 1 | `backend/app/api/auth.py` | `GET /auth/me` - 로그인된 사용자 정보 조회 API |
| 2 | `frontend/src/lib/api.ts` | `getCenters()` - 센터 목록 조회 함수 |
| 3 | `frontend/src/lib/api.ts` | `getMe()` - 사용자 정보 조회 함수 |
| 4 | `frontend/src/components/Header.tsx` | 헤더 컴포넌트 (로그인 상태 표시) |

#### UI/UX 개선

| # | 파일 | 개선 내용 |
|---|------|----------|
| 1 | `frontend/src/app/layout.tsx` | Header 컴포넌트 분리 적용 |
| 2 | `frontend/src/components/Header.tsx` | 로그인 시 사용자명 + 로그아웃 버튼 표시 |
| 3 | `frontend/src/components/Header.tsx` | 관리자인 경우 관리자 메뉴 표시 |
| 4 | `frontend/src/app/auth/signup/page.tsx` | 센터 선택 드롭다운 (ID 입력 → 목록 선택) |
| 5 | `frontend/src/app/auth/login/page.tsx` | 에러 메시지 한글화 |
| 6 | `frontend/src/app/deposits/page.tsx` | 사용자 정보 카드 추가 (이름, 이메일, 추천인 코드) |
| 7 | `frontend/src/app/deposits/page.tsx` | 추천인 코드 복사 기능 |
| 8 | `frontend/src/app/deposits/page.tsx` | 토큰 만료 시 자동 로그아웃 |
| 9 | `frontend/src/app/page.tsx` | 메인페이지 로그인 상태 분기 처리 |
| 10 | `frontend/src/app/page.tsx` | 로그인 후: 마이페이지 + 로그아웃 버튼 |

---

## 앞으로 해야 할 작업

### Frontend (프론트엔드)

#### 높은 우선순위
| 작업 | 설명 | 예상 페이지 |
|------|------|------------|
| 관리자 대시보드 | 입금 승인/거부 UI, 사용자 관리 | `/admin` |
| 관리자 입금 관리 | 대기중 입금 목록, 승인/거부 버튼 | `/admin/deposits` |
| 관리자 사용자 관리 | 사용자 검색, 관리자 승격 | `/admin/users` |
| 모바일 네비게이션 | 햄버거 메뉴 (현재 lg 이하 숨김) | Header 컴포넌트 |

#### 중간 우선순위
| 작업 | 설명 | 예상 페이지 |
|------|------|------------|
| 상품 목록 페이지 | 패키지별 상품 선택 UI | `/products` |
| 포인트 내역 페이지 | 포인트 잔액, 적립/사용 내역 | `/points` |
| 추천인 현황 페이지 | 내가 추천한 사람 목록, 보상 내역 | `/referrals` |
| 구매 내역 페이지 | 완료된 구매 목록 | `/purchases` |
| 프로필 수정 | 닉네임, 비밀번호 변경 | `/settings` |

#### 낮은 우선순위
| 작업 | 설명 |
|------|------|
| 토스트 알림 | alert 대신 토스트 UI |
| 로딩 스켈레톤 | 데이터 로딩 중 스켈레톤 UI |
| 다크/라이트 테마 | 테마 전환 기능 |
| 다국어 지원 | i18n (한국어/영어) |
| PWA 지원 | 모바일 앱 설치 |

---

### Backend (백엔드)

#### 높은 우선순위
| API | 메서드 | 설명 |
|-----|--------|------|
| `/auth/password-reset` | POST | 비밀번호 재설정 요청 |
| `/auth/password-reset/confirm` | POST | 비밀번호 재설정 확인 |
| `/points/my` | GET | 내 포인트 잔액 및 내역 |
| `/referrals/my` | GET | 내가 추천한 사람 목록 |
| `/purchases/my` | GET | 내 구매 내역 |

#### 중간 우선순위
| API | 메서드 | 설명 |
|-----|--------|------|
| `/exchange-rates` | GET | 현재 환율 조회 |
| `/admin/exchange-rates` | PUT | 환율 수정 (관리자) |
| `/admin/products` | CRUD | 상품 관리 (관리자) |
| `/admin/centers` | CRUD | 센터 관리 (관리자) |
| `/auth/profile` | PUT | 프로필 수정 |

#### 낮은 우선순위
| 작업 | 설명 |
|------|------|
| 이메일 발송 | 회원가입 환영, 입금 승인 알림 |
| 블록체인 연동 | USDT 입금 자동 확인 (TRC20/ERC20) |
| 로그인 기록 | IP, 시간, 디바이스 기록 |
| 2FA 인증 | Google Authenticator 연동 |
| API Rate Limiting | 요청 제한 |
| 로깅/모니터링 | 에러 추적, 성능 모니터링 |

---

### 입금 승인 → JOY 지급 로직 (미구현)

현재 입금 승인은 상태만 변경됨. 아래 로직 추가 필요:

```python
# 입금 승인 시 실행할 로직
def approve_deposit(deposit_id, actual_amount):
    # 1. DepositRequest 상태 변경 (approved)
    # 2. Purchase 상태 변경 (completed)
    # 3. Point 적립 (JOY 코인 지급)
    # 4. 추천인 보너스 지급 (있는 경우)
```

---

## 프로젝트 구조

```
JoyCoin_Website_Project_Full/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── auth/
│   │   │   │   ├── login/page.tsx      # 로그인 페이지
│   │   │   │   └── signup/page.tsx     # 회원가입 페이지
│   │   │   ├── buy/page.tsx            # 구매 페이지
│   │   │   ├── deposits/page.tsx       # 마이페이지 (입금 내역)
│   │   │   ├── guide/purchase/page.tsx # 구매 가이드
│   │   │   ├── layout.tsx              # 공통 레이아웃
│   │   │   ├── page.tsx                # 메인 페이지
│   │   │   └── globals.css             # 전역 스타일
│   │   ├── components/
│   │   │   └── Header.tsx              # 헤더 컴포넌트
│   │   └── lib/
│   │       └── api.ts                  # API 호출 함수
│   └── package.json
│
├── backend/
│   └── app/
│       ├── api/
│       │   ├── auth.py                 # 인증 API
│       │   ├── deposits.py             # 입금 API
│       │   ├── admin_deposits.py       # 관리자 입금 API
│       │   ├── admin_users.py          # 관리자 사용자 API
│       │   ├── products.py             # 상품 API
│       │   └── centers.py              # 센터 API
│       ├── models/
│       │   ├── user.py                 # 사용자 모델
│       │   ├── deposit_request.py      # 입금 요청 모델
│       │   ├── product.py              # 상품 모델
│       │   ├── purchase.py             # 구매 모델
│       │   ├── point.py                # 포인트 모델
│       │   ├── referral.py             # 추천인 모델
│       │   ├── center.py               # 센터 모델
│       │   └── exchange_rate.py        # 환율 모델
│       ├── core/
│       │   ├── auth.py                 # 인증 의존성
│       │   ├── config.py               # 환경 설정
│       │   ├── db.py                   # 데이터베이스
│       │   └── security.py             # 보안 (해싱, JWT)
│       ├── schemas/
│       │   ├── auth.py                 # 인증 스키마
│       │   └── deposits.py             # 입금 스키마
│       ├── services/
│       │   └── deposits.py             # 입금 서비스
│       └── main.py                     # FastAPI 앱
│
├── deploy/
│   ├── docker-compose.dev.yml          # Docker Compose 설정
│   ├── env/.env                        # 환경 변수
│   ├── Dockerfile.frontend
│   └── Dockerfile.backend
│
└── PROJECT_STATUS.md                   # 이 문서
```

---

## 실행 방법

### Docker Compose 사용 (권장)

```bash
cd deploy
docker compose -f docker-compose.dev.yml up -d
```

### 접속 주소
- **프론트엔드**: http://localhost:3000
- **백엔드 API**: http://localhost:8000
- **API 문서**: http://localhost:8000/docs

### 기본 관리자 계정
- **이메일**: admin@example.com
- **비밀번호**: admin12345678

### 환경 변수 (.env)
```env
APP_ENV=dev
CORS_ORIGINS=http://localhost:3000
NEXT_PUBLIC_API_BASE=http://localhost:8000
DB_URL=postgresql+psycopg://app:app@db:5432/app
JWT_SECRET=change_me
JWT_EXPIRE_MIN=20
USDT_ADMIN_ADDRESS=TSnS1pZL2rjAf6jMmq5xFfHyzxpoXyX5zB
SUPER_ADMIN_EMAIL=admin@example.com
SUPER_ADMIN_PASSWORD=admin12345678
```

---

## API 명세

### 인증 API

| 메서드 | 경로 | 설명 | 인증 |
|--------|------|------|------|
| POST | `/auth/signup` | 회원가입 | X |
| POST | `/auth/login` | 로그인 | X |
| GET | `/auth/me` | 내 정보 조회 | O |

### 입금 API

| 메서드 | 경로 | 설명 | 인증 |
|--------|------|------|------|
| POST | `/deposits/request` | 입금 요청 생성 | O |
| GET | `/deposits/my` | 내 입금 내역 | O |

### 관리자 API

| 메서드 | 경로 | 설명 | 인증 |
|--------|------|------|------|
| GET | `/admin/deposits` | 입금 목록 조회 | 관리자 |
| POST | `/admin/deposits/{id}/approve` | 입금 승인 | 관리자 |
| POST | `/admin/deposits/{id}/reject` | 입금 거부 | 관리자 |
| GET | `/admin/users` | 사용자 목록 | 관리자 |
| POST | `/admin/users/{id}/promote` | 관리자 승격 | 관리자 |

### 공개 API

| 메서드 | 경로 | 설명 | 인증 |
|--------|------|------|------|
| GET | `/products` | 상품 목록 | X |
| GET | `/centers` | 센터 목록 | X |
| GET | `/healthz` | 헬스 체크 | X |

---

## 데이터베이스 모델

### Users (사용자)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | INT | PK |
| email | VARCHAR(255) | 이메일 (UNIQUE) |
| password_hash | VARCHAR(255) | 비밀번호 해시 |
| username | VARCHAR(100) | 닉네임 |
| referral_code | VARCHAR(20) | 내 추천인 코드 (UNIQUE) |
| referred_by | INT | 추천인 ID (FK) |
| center_id | INT | 센터 ID (FK) |
| role | VARCHAR(16) | 역할 (user/admin) |
| is_email_verified | BOOLEAN | 이메일 인증 여부 |
| is_banned | BOOLEAN | 차단 여부 |
| created_at | TIMESTAMP | 생성일 |
| updated_at | TIMESTAMP | 수정일 |

### DepositRequests (입금 요청)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | INT | PK |
| user_id | INT | 사용자 ID (FK) |
| chain | VARCHAR(20) | 체인 (TRC20/ERC20/BSC/Polygon) |
| assigned_address | VARCHAR(128) | 입금 주소 |
| expected_amount | DECIMAL | 예상 금액 |
| actual_amount | DECIMAL | 실제 금액 |
| status | VARCHAR(20) | 상태 (pending/approved/rejected) |
| admin_id | INT | 처리 관리자 ID |
| admin_notes | VARCHAR(500) | 관리자 메모 |
| approved_at | TIMESTAMP | 승인일 |
| created_at | TIMESTAMP | 생성일 |

### Products (상품)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | INT | PK |
| name | VARCHAR(100) | 상품명 |
| joy_amount | INT | JOY 수량 |
| price_usdt | DECIMAL | USDT 가격 |
| price_krw | INT | KRW 가격 |
| discount_rate | INT | 할인율 |
| is_active | BOOLEAN | 활성화 여부 |

### Points (포인트)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | INT | PK |
| user_id | INT | 사용자 ID (FK) |
| amount | INT | 금액 (+/-) |
| balance_after | INT | 잔액 |
| type | VARCHAR(20) | 유형 (earn/spend/referral_bonus 등) |
| description | VARCHAR(200) | 설명 |
| created_at | TIMESTAMP | 생성일 |

---

## 초기 시딩 데이터

### 센터
| ID | 이름 | 지역 |
|----|------|------|
| 1 | 서울센터 | 서울 |
| 2 | 부산센터 | 부산 |
| 3 | 대구센터 | 대구 |

### 상품
| ID | 이름 | JOY | USDT | 할인율 |
|----|------|-----|------|--------|
| 1 | JOY 1000개 패키지 | 1,000 | $10.00 | 0% |
| 2 | JOY 2000개 패키지 | 2,000 | $19.00 | 5% |
| 3 | JOY 5000개 패키지 | 5,000 | $45.00 | 10% |

### 환율
| JOY/KRW | USDT/KRW |
|---------|----------|
| 13.0 | 1,300.0 |

---

## 문의

프로젝트 관련 문의사항이 있으시면 개발팀에 연락해주세요.

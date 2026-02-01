# JoyCoin 데이터베이스 구조 & 흐름 정리

---

## 1. DB 연결

- **엔진**: PostgreSQL (`DB_URL` 환경변수, 기본값 `postgresql+psycopg://app:app@db:5432/app`)
- **ORM**: SQLAlchemy 2.x (DeclarativeBase, Mapped)
- **테이블 생성**: 앱 기동 시 `Base.metadata.create_all(bind=engine)` 로 한 번에 생성 (마이그레이션 없음)

---

## 2. 테이블(모델) 구조

### 2.1 users (사용자)
| 컬럼 | 타입 | 비고 |
|------|------|------|
| id | PK | |
| email | unique, not null | |
| password_hash | not null | |
| username | not null | |
| referral_code | unique, not null | 자동 생성 (JOY + 5자리) |
| referred_by | FK → users.id | 나를 추천한 사람 (nullable) |
| center_id | FK → centers.id | 소속 센터 (nullable) |
| role | default 'user' | user / admin |
| is_email_verified | default false | |
| is_banned | default false | |
| created_at, updated_at | | |

**관계**
- referrer: 나를 추천한 User 1명
- center: 소속 Center 1개
- purchases, deposit_requests, point_history: 내 구매/입금요청/포인트 내역
- referrals_as_referrer / referrals_as_referred: 추천인·추천받은 사람 관계(Referral)

---

### 2.2 centers (센터)
| 컬럼 | 타입 | 비고 |
|------|------|------|
| id | PK | |
| name | unique, not null | |
| region | not null | |
| manager_name | nullable | |
| is_active | default true | |
| created_at | | |

**관계**: users (해당 센터 소속 유저들)

---

### 2.3 products (상품)
| 컬럼 | 타입 | 비고 |
|------|------|------|
| id | PK | |
| name | not null | |
| joy_amount | not null | JOY 개수 |
| price_usdt | not null | USDT 가격 |
| price_krw | nullable | KRW 참고가 |
| discount_rate | default 0 | % |
| description | nullable | |
| is_active | default true | |
| sort_order | default 0 | 노출 순서 |
| created_at, updated_at | | |

**관계**: purchases (이 상품으로 된 구매들)

---

### 2.4 purchases (구매)
| 컬럼 | 타입 | 비고 |
|------|------|------|
| id | PK | |
| user_id | FK → users.id | 구매자 |
| product_id | FK → products.id | 상품 |
| quantity | default 1 | |
| total_joy | not null | 총 JOY |
| total_usdt | not null | 총 USDT |
| total_krw | nullable | 참고용 KRW |
| payment_method | not null | |
| transaction_hash | nullable | |
| status | default 'pending' | pending / completed / failed / refunded |
| completed_at | nullable | |
| created_at | | |

**관계**
- user, product
- deposit_requests: 이 구매에 연결된 입금 요청들 (현재 서비스에서는 미연결 가능)
- point_records: 이 구매로 생긴 포인트 내역

---

### 2.5 deposit_requests (입금 요청)
| 컬럼 | 타입 | 비고 |
|------|------|------|
| id | PK | |
| user_id | FK → users.id | 요청자 |
| purchase_id | FK → purchases.id, nullable | 연결된 구매 (선택) |
| chain | not null | TRC20, ERC20, BSC, Polygon |
| assigned_address | not null | 관리자 USDT 주소 (설정값) |
| expected_amount | not null | 입금 예정 USDT |
| actual_amount | nullable | 관리자 확인 후 입력 |
| status | default 'pending' | pending / approved / rejected |
| admin_id | FK → users.id, nullable | 처리한 관리자 |
| admin_notes | nullable | |
| approved_at | nullable | |
| created_at | | |

**관계**: user, purchase(선택), admin

**참고**: 현재 서비스 로직(`create_deposit_request`)은 **Purchase 없이** user + chain + amount_usdt 만으로 DepositRequest만 생성함. purchase_id 는 비어 있음.

---

### 2.6 referrals (추천 관계)
| 컬럼 | 타입 | 비고 |
|------|------|------|
| id | PK | |
| referrer_id | FK → users.id | 추천한 사람 |
| referred_id | FK → users.id | 추천받은 사람 |
| reward_points | default 0 | 보상 포인트 |
| created_at | | |

**유일 제약**: (referrer_id, referred_id) 한 쌍당 1건

**관계**: referrer(User), referred(User)

---

### 2.7 points (포인트 내역)
| 컬럼 | 타입 | 비고 |
|------|------|------|
| id | PK | |
| user_id | FK → users.id | 소유자 |
| amount | not null | + 적립 / - 사용 |
| balance_after | not null | 변동 후 잔액 |
| type | not null | earn, spend, refund, admin_adjust, referral_bonus |
| description | not null | |
| purchase_id | FK → purchases.id, nullable | 관련 구매 |
| created_at | | |

**관계**: user, purchase(선택)

---

### 2.8 exchange_rates (환율)
| 컬럼 | 타입 | 비고 |
|------|------|------|
| id | PK | |
| joy_to_krw | not null | 1 JOY = ? KRW |
| usdt_to_krw | not null | 1 USDT = ? KRW |
| is_active | default true | |
| updated_by | FK → users.id, nullable | |
| created_at | | |

---

## 3. 엔티티 관계도 (요약)

```
Center 1 ----< User (center_id)
User 1 ----< Referral (referrer_id / referred_id)
User 1 ----< Purchase (user_id)
User 1 ----< DepositRequest (user_id)
User 1 ----< Point (user_id)

Product 1 ----< Purchase (product_id)
Purchase 1 ----< DepositRequest (purchase_id, 선택)
Purchase 1 ----< Point (purchase_id, 선택)
```

---

## 4. 주요 비즈니스 흐름

### 4.1 앱 기동 시 (startup)
1. `Base.metadata.create_all(engine)` → 위 테이블 전부 생성
2. **슈퍼관리자 시드**: `SUPER_ADMIN_EMAIL` / `SUPER_ADMIN_PASSWORD` 있으면 해당 User 생성(또는 role=admin 으로 수정)
3. **초기 데이터 시드** (없을 때만):
   - centers: 서울/부산/대구 3개
   - products: JOY 1000/2000/5000 패키지 3개
   - exchange_rates: joy_to_krw=13, usdt_to_krw=1300 1건

---

### 4.2 회원가입 (POST /auth/signup)
1. 이메일 중복 체크
2. **referral_code** 있으면: 해당 코드 가진 User 조회 → referrer 확정
3. **center_id** 있으면: 해당 Center 존재 여부 확인
4. User 생성 (email, password_hash, username, referred_by, center_id, role=user, is_email_verified=false)
5. **referrer 가 있으면**:
   - Referral 1건 생성 (referrer_id, referred_id, reward_points=100)
   - 추천인에게 Point 1건 생성 (amount=100, type=referral_bonus, balance_after 계산)
6. 이메일 인증 링크 발송 (Redis 토큰 + send_email)
7. commit 후 응답: `{ message, user_id, referral_code }` (JWT 없음)

**DB에 남는 것**: users 1행, (선택) referrals 1행, (선택) points 1행

---

### 4.3 로그인 (POST /auth/login)
- email / password 검증 → JWT(access) 발급
- DB: 조회만, 변경 없음

---

### 4.4 입금 요청 (POST /deposits/request)
1. JWT로 User 확인
2. `create_deposit_request(db, user, data)`:
   - `USDT_ADMIN_ADDRESS` 설정값으로 입금 주소 사용
   - DepositRequest 생성: user_id, chain, expected_amount, assigned_address, status=pending
   - **purchase_id 는 넣지 않음** (현재 로직)
3. commit 후 생성된 DepositRequest 반환

**DB에 남는 것**: deposit_requests 1행

---

### 4.5 내 입금 내역 (GET /deposits/my)
- JWT로 User 확인
- 해당 user_id 의 DepositRequest 목록 id 내림차순 조회 후 반환

---

### 4.6 관리자 입금 승인 (POST /admin/deposits/{id}/approve)
1. admin JWT로 관리자 User 확인
2. DepositRequest 조회 → status 가 pending 이면:
   - actual_amount (없으면 expected_amount 사용), admin_notes, admin_id, approved_at 설정
   - status = 'approved'
3. commit

**현재**: Purchase 생성/연동이나 포인트 지급 로직은 없음. 입금만 “승인” 상태로 바꿈.

---

### 4.7 관리자 입금 거절 (POST /admin/deposits/{id}/reject)
- 해당 DepositRequest 의 status = 'rejected', admin_notes 등 설정 후 commit

---

### 4.8 기타 API (DB만 사용)
- **GET /centers**: is_active=True 인 Center 목록
- **GET /products**: is_active=True 인 Product 목록, sort_order 순
- **GET /admin/deposits**: DepositRequest 목록 (필터: status)
- **GET /admin/users**, **POST /admin/users/{id}/promote**: User 조회/관리자 권한 부여

---

## 5. 현재 “끊겨 있는” 부분

- **Purchase ↔ DepositRequest**: 모델에는 purchase_id 가 있지만, 입금 요청 생성 시 Purchase를 만들지 않고 DepositRequest만 넣음. “상품 선택 → 구매 생성 → 입금 요청” 흐름은 미구현.
- **입금 승인 시**: approved 로만 바꾸고, JOY 지급이나 Point 적립 같은 후속 처리 없음.
- **reference_code**: deposit_requests 테이블에는 없음 (예전 백업 모델에만 존재). API 응답에 넣으려면 컬럼 추가하거나 응답 시점에 생성해야 함.

---

## 6. 요약

| 구분 | 내용 |
|------|------|
| DB | PostgreSQL, SQLAlchemy, create_all 로 테이블 생성 |
| 테이블 | users, centers, products, purchases, deposit_requests, referrals, points, exchange_rates |
| 회원가입 | User + (선택) Referral + (선택) 추천인 Point + 이메일 인증 발송 |
| 입금 | DepositRequest만 생성 (purchase_id 없음), 관리자 approve/reject |
| 구매(Purchase) | 테이블·관계만 있고, 실제 “상품 선택 → 구매 → 입금” 플로우는 미연결 |

이 문서만 보면 DB가 어떻게 되어 있고 어떤 흐름인지 한 번에 파악할 수 있음.

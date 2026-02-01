# 프론트엔드 개발자가 지금 진행할 수 있는 작업 범위

백엔드 API가 준비된 상태이므로, 아래 흐름까지 **전부 프론트에서 구현·연동 가능**합니다.

---

## ✅ 지금 바로 진행 가능한 작업

### 1. 인증 (완료된 화면 + 연동만 점검)

| 화면 | API | 상태 |
|------|-----|------|
| **회원가입** | `POST /auth/signup` | ✅ 연동됨 (username, center_id, referral_code) |
| **로그인** | `POST /auth/login` | ✅ 연동됨, JWT → localStorage 등 저장 |
| **로그인 필요 시** | - | 로그인 페이지로 리다이렉트 |

- 가입 후 JWT 없음 → 로그인 페이지로 이동 후 로그인하면 됨.
- 이메일 인증 없음 → 가입 직후 로그인 가능.

---

### 2. 공개 API (로그인 없이)

| 기능 | API | 프론트 작업 |
|------|-----|-------------|
| **센터 목록** | `GET /centers` | 회원가입 시 센터 선택 드롭다운 (선택) |
| **상품 목록** | `GET /products` | 구매 페이지에 상품 카드/목록 노출 |

**GET /centers**  
- 응답: `[{ "id", "name", "region" }, ...]`  
- 회원가입 화면에서 `center_id` 선택지로 사용 가능.

**GET /products**  
- 응답: `[{ "id", "name", "joy_amount", "price_usdt", "price_krw", "discount_rate", "description" }, ...]`  
- 구매 페이지에서 상품 선택 → 금액 계산 등에 사용.

---

### 3. 로그인 후 API (JWT 필요)

| 기능 | API | 프론트 작업 |
|------|-----|-------------|
| **입금 요청** | `POST /deposits/request` | 구매·입금 화면에서 “입금 요청” 버튼 |
| **내 입금 목록** | `GET /deposits/my` | 마이페이지·입금 내역 목록 |

**POST /deposits/request**  
- Header: `Authorization: Bearer <access>`  
- Body: `{ "chain": "TRC20" | "ERC20" | "BSC" | "Polygon", "amount_usdt": number }`  
- ⚠️ **chain 값**: 백엔드는 **TRC20, ERC20, BSC, Polygon** 만 허용. `TRON`, `ETH` 는 사용 불가 → **TRC20**(트론), **ERC20**(이더리움) 등으로 보내야 함.  
- 응답: `{ "id", "chain", "assigned_address", "expected_amount", "status", "created_at", ... }` (reference_code 없음 → 요청번호는 `id` 사용)

**GET /deposits/my**  
- Header: `Authorization: Bearer <access>`  
- 응답: `{ "items": [ { "id", "chain", "assigned_address", "expected_amount", "status", "created_at", ... } ] }`  
- **status 값**: `pending` | `approved` | `rejected`  
  - 프론트에서는 **approved = 입금 완료**, **rejected = 거절** 로 표시하면 됨. (`credited` 아님)

---

### 4. 관리자 전용 (admin API)

| 기능 | API | 비고 |
|------|-----|------|
| **입금 목록 조회** | `GET /admin/deposits?status=pending` 등 | 관리자 로그인 후 |
| **입금 승인** | `POST /admin/deposits/{id}/approve` | Body: `{ "actual_amount?", "admin_notes?" }` |
| **입금 거절** | `POST /admin/deposits/{id}/reject` | Body: `{ "admin_notes?" }` |
| **유저 목록** | `GET /admin/users` | 관리자 전용 |
| **유저 승급** | `POST /admin/users/{id}/promote` | 관리자 전용 |

- 관리자 계정: `SUPER_ADMIN_EMAIL` / `SUPER_ADMIN_PASSWORD` 로 로그인한 계정.
- 프론트: 관리자 전용 레이아웃/라우트 만들어서 위 API 연동하면 됨.

---

## 정리: 어디까지 진행할 수 있는지

| 구분 | 진행 가능 여부 |
|------|----------------|
| 랜딩 · 회원가입 · 로그인 | ✅ 전부 가능 (연동 완료된 부분 점검·UI 개선) |
| 센터/상품 목록 노출 | ✅ GET /centers, GET /products 연동 |
| 상품 선택 후 입금 요청 | ✅ POST /deposits/request (chain: TRC20/ERC20/BSC/Polygon) |
| 내 입금 내역 보기 | ✅ GET /deposits/my (status: pending/approved/rejected) |
| 관리자 입금 승인/거절 | ✅ Admin API 연동 가능 |
| 관리자 유저 목록/승급 | ✅ Admin API 연동 가능 |

---

## 프론트에서 반드시 맞출 것

1. **입금 요청 chain**  
   - 백엔드 허용 값: **TRC20, ERC20, BSC, Polygon**  
   - `TRON` → **TRC20**, `ETH` → **ERC20** 으로 보내기.

2. **내 입금 내역 status**  
   - 백엔드 값: **pending**, **approved**, **rejected**  
   - `approved` = 입금 완료, `credited` 는 사용하지 않음.

3. **입금 요청 응답**  
   - `reference_code` 필드는 백엔드에 없음. 있으면 무시하고, `id` 등으로 구분하면 됨.

---

## 아직 백엔드에 없는 것 (나중에 할 수 있는 것)

- **구매(Purchase) 연동**: “상품 선택 → 결제(입금) 요청” 시 `purchase_id` 를 붙이는 플로우는 아직 API 없음. 지금은 “입금 요청”만 (금액+체인) 가능.
- **회원가입 후 JWT 자동 발급**: 원하면 백엔드에서 signup 응답에 `access` 넣어주면, 프론트에서 가입 직후 로그인 상태로 처리 가능.

이 범위 안에서는 **전부 프론트 작업만으로 진행 가능**합니다.

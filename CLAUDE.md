# JoyCoin Project - Development Notes

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
  "center_id": "number (optional)",
  "referral_code": "string (optional)"
}
```

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

### Backend
1. **SQLAlchemy 관계**: foreign_keys 명시 필요한 경우 양쪽 모두 설정
2. **Enum 검증**: role, status 등에 validator 사용

### Docker (Windows)
1. **PostgreSQL 볼륨**: Windows에서 바인드 마운트 대신 네임드 볼륨 사용
   - 잘못된 예: `./docker-data/postgres:/var/lib/postgresql/data`
   - 올바른 예: `postgres_data:/var/lib/postgresql/data` + volumes 섹션 정의

## File Structure
```
backend/
  app/
    api/auth.py       - 인증 API (signup, login, me)
    schemas/auth.py   - Pydantic 스키마
    models/user.py    - User 모델
    core/enums.py     - Enum 정의 (UserRole, DepositStatus 등)

frontend/
  src/app/
    auth/signup/      - 회원가입 페이지
    auth/login/       - 로그인 페이지
    admin/            - 관리자 페이지
```

// frontend/src/lib/api.ts
const BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText} ${text}`);
  }
  return res.json();
}

// 회원가입
export async function signup(email: string, password: string, region_code?: string, referrer_code?: string) {
  return api<{ access: string }>("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password, region_code, referrer_code }),
  });
}

// 로그인
export async function login(email: string, password: string) {
  return api<{ access: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

// 입금요청 생성
export async function createDepositRequest(params: { token: string; chain: "TRON" | "ETH"; amount_usdt: string }) {
  return api<{
    id: number;
    chain: string;
    assigned_address: string;
    expected_amount: string;
    reference_code: string;
    status: string;
  }>("/deposits/request", {
    method: "POST",
    headers: { Authorization: `Bearer ${params.token}` },
    body: JSON.stringify({ chain: params.chain, amount_usdt: params.amount_usdt }),
  });
}

// 내 입금내역
export async function getMyDeposits(token: string) {
  return api<{ items: Array<any> }>("/deposits/my", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

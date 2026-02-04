"use client";
import { useState, useEffect } from "react";
import { signup, getCenters } from "@/lib/api";
import { useRouter } from "next/navigation";

type Center = { id: number; name: string; region: string };

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [username, setUsername] = useState("");
  const [centerId, setCenterId] = useState("");
  const [ref, setRef] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [centers, setCenters] = useState<Center[]>([]);
  const router = useRouter();

  useEffect(() => {
    getCenters().then(setCenters).catch(() => {});
  }, []);

  const onSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 12) {
      setError("비밀번호는 12자 이상이어야 합니다.");
      return;
    }
    if (password !== confirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!username.trim()) {
      setError("이름(닉네임)을 입력해 주세요.");
      return;
    }

    setLoading(true);
    try {
      await signup({
        email,
        password,
        username: username.trim(),
        referral_code: ref.trim() || undefined,
        center_id: centerId ? Number(centerId) : undefined,
      });
      // 백엔드는 JWT를 주지 않음 → 이메일 인증 후 로그인 필요
      router.push("/auth/login?registered=1");
    } catch (e: any) {
      setError(e.message || "회원가입 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="glass p-8 md:p-12 rounded-3xl w-full max-w-md shadow-2xl border border-slate-700/50">
        <h2 className="text-3xl font-black mb-8 text-center text-white">회원가입</h2>
        
        <form onSubmit={onSignup} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">이메일</label>
            <input 
              type="email"
              value={email} 
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-blue-500 outline-none transition text-white"
              placeholder="이메일을 입력하세요"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">비밀번호</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-blue-500 outline-none transition text-white"
              placeholder="12자 이상 입력하세요"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">비밀번호 확인</label>
            <input 
              type="password" 
              value={confirm} 
              onChange={e => setConfirm(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-blue-500 outline-none transition text-white"
              placeholder="비밀번호를 다시 입력하세요"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">이름 / 닉네임</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-blue-500 outline-none transition text-white"
              placeholder="2자 이상"
              minLength={2}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">센터 선택</label>
              <select
                value={centerId}
                onChange={e => setCenterId(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-blue-500 outline-none transition text-white"
              >
                <option value="">선택안함</option>
                {centers.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.region})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">추천인 코드</label>
              <input
                type="text"
                value={ref}
                onChange={e => setRef(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-4 py-3.5 focus:ring-2 focus:ring-blue-500 outline-none transition text-white"
                placeholder="선택 (JOY…)"
              />
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center font-bold bg-red-500/10 py-3 rounded-xl border border-red-500/20">
              {error}
            </p>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-black text-lg rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
          >
            {loading ? "회원가입 중..." : "회원가입"}
          </button>
        </form>

        <div className="mt-10 pt-6 border-t border-slate-800 text-center">
          <div className="flex flex-wrap justify-center gap-6 text-sm font-bold uppercase tracking-widest">
            <a href="/auth/login" className="text-slate-500 hover:text-white transition">
              로그인
            </a>
            <a href="/" className="text-slate-500 hover:text-white transition">
              홈으로
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

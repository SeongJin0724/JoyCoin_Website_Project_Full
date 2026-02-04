"use client";

import { useEffect, useState } from "react";
import { getMyDeposits, getMe } from "@/lib/api";
import { useRouter } from "next/navigation";

type User = {
  id: number;
  email: string;
  username: string;
  referral_code: string;
  role: string;
};

function Badge({ status }: { status: string }) {
  const styles = {
    pending: "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20",
    approved: "bg-green-500/10 text-green-500 border border-green-500/20",
    rejected: "bg-red-500/10 text-red-500 border border-red-500/20",
  }[status] || "bg-gray-500/10 text-gray-500 border border-gray-500/20";

  const labels: Record<string, string> = {
    pending: "대기중",
    approved: "입금완료",
    rejected: "거부됨",
  };

  return (
    <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm ${styles}`}>
      {labels[status] || status}
    </span>
  );
}

export default function MyDepositsPage() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("access") || "";
    if (!storedToken) {
      router.push("/auth/login");
      return;
    }
    setToken(storedToken);
  }, [router]);

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const [depositsRes, userRes] = await Promise.all([
          getMyDeposits(token),
          getMe(token),
        ]);
        setItems(depositsRes.items || []);
        setUser(userRes);
      } catch (e: any) {
        if (e.message?.includes("401")) {
          localStorage.removeItem("access");
          router.push("/auth/login");
          return;
        }
        alert("조회 실패: " + e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [token, router]);

  const copyReferralCode = () => {
    if (user?.referral_code) {
      navigator.clipboard.writeText(user.referral_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (token === null) return null;

  const totalUsdt = items.reduce((sum, item) => sum + parseFloat(item.expected_amount || 0), 0);
  const completedCount = items.filter(item => item.status === "approved").length;

  return (
    <div className="flex-1 max-w-6xl mx-auto w-full p-6 space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass p-10 rounded-[2.5rem] md:col-span-2 flex flex-col justify-between relative overflow-hidden border border-slate-800 shadow-2xl">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px]"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px]"></div>
          
          <div className="relative">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-slate-500 text-xs font-black uppercase tracking-[0.3em]">입금 내역</h3>
              <span className="bg-blue-600/10 text-blue-400 px-3 py-1 rounded-full text-[10px] font-black border border-blue-500/20">LIVE</span>
            </div>
            <div className="flex items-baseline space-x-4">
              <span className="text-8xl font-black text-white tracking-tighter">{items.length}</span>
              <span className="text-2xl font-black text-blue-500 italic">건</span>
            </div>
          </div>
          
          <div className="mt-12 flex space-x-12 relative border-t border-slate-800/50 pt-8">
            <div>
              <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest mb-1">총 입금액</p>
              <p className="text-2xl font-black text-slate-200">{totalUsdt.toFixed(2)} <span className="text-xs font-medium text-slate-500 tracking-normal">USDT</span></p>
            </div>
            <div>
              <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest mb-1">완료된 거래</p>
              <p className="text-2xl font-black text-slate-200">{completedCount} <span className="text-xs font-medium text-slate-500 tracking-normal">건</span></p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {/* 사용자 정보 카드 */}
          <div className="glass p-6 rounded-[2rem] border border-slate-800">
            <h3 className="text-slate-500 text-xs font-black uppercase tracking-[0.2em] mb-4">내 정보</h3>
            {user ? (
              <div className="space-y-3">
                <div>
                  <p className="text-slate-500 text-[10px] uppercase tracking-wider">이름</p>
                  <p className="text-white font-bold text-lg">{user.username}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-[10px] uppercase tracking-wider">이메일</p>
                  <p className="text-slate-300 font-medium text-sm">{user.email}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-[10px] uppercase tracking-wider mb-1">내 추천인 코드</p>
                  <button
                    onClick={copyReferralCode}
                    className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-xl border border-slate-700 hover:border-blue-500 transition-all group"
                  >
                    <span className="text-blue-400 font-mono font-bold">{user.referral_code}</span>
                    <svg className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                  {copied && <p className="text-green-400 text-xs mt-1">복사됨!</p>}
                </div>
              </div>
            ) : (
              <div className="h-24 flex items-center justify-center">
                <div className="w-5 h-5 animate-spin rounded-full border-2 border-slate-600 border-t-blue-500" />
              </div>
            )}
          </div>

          {/* 빠른 메뉴 */}
          <div className="glass p-6 rounded-[2rem] border border-slate-800 flex flex-col justify-center space-y-3">
            <h3 className="text-lg font-black italic text-white mb-1">빠른 메뉴</h3>
            <a
              href="/buy"
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 rounded-xl font-black transition-all shadow-lg shadow-blue-500/20 active:scale-95 flex items-center justify-center space-x-2"
            >
              <span>조이코인 구매</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <a
              href="/"
              className="w-full py-4 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-xl font-bold transition-all active:scale-95 text-center text-slate-300"
            >
              홈으로
            </a>
          </div>
        </div>
      </div>

      <div className="glass rounded-[2.5rem] overflow-hidden border border-slate-800 shadow-2xl">
        <div className="px-10 py-8 border-b border-slate-800 bg-slate-900/40 flex justify-between items-center">
          <h3 className="text-2xl font-black italic text-white">거래 내역</h3>
          <div className="flex gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 border border-slate-800">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              <span className="text-[10px] font-black text-slate-400 uppercase">동기화됨</span>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="px-10 py-24 text-center">
              <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
              <p className="text-slate-600 font-bold uppercase tracking-widest text-sm mt-4">불러오는 중...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="px-10 py-24 text-center">
              <div className="flex flex-col items-center space-y-4">
                <svg className="w-12 h-12 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-slate-600 font-bold uppercase tracking-widest text-sm">입금요청 내역이 없습니다</p>
              </div>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-slate-950 text-slate-600 text-[10px] uppercase font-black tracking-[0.2em]">
                <tr>
                  <th className="px-10 py-6">ID</th>
                  <th className="px-10 py-6">체인</th>
                  <th className="px-10 py-6">주소</th>
                  <th className="px-10 py-6">금액</th>
                  <th className="px-10 py-6">요청시간</th>
                  <th className="px-10 py-6 text-right">상태</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {items.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()).map((r) => (
                  <tr key={r.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-10 py-7 font-mono text-xs text-slate-400">{r.id}</td>
                    <td className="px-10 py-7 text-slate-500 font-medium text-sm">{r.chain}</td>
                    <td className="px-10 py-7 font-mono text-xs text-slate-400 break-all max-w-xs">{r.assigned_address}</td>
                    <td className="px-10 py-7 text-blue-500 font-black">{r.expected_amount} USDT</td>
                    <td className="px-10 py-7 text-slate-500 font-medium text-sm">{r.created_at?.replace("T"," ").slice(0,19) || "-"}</td>
                    <td className="px-10 py-7 text-right">
                      <Badge status={r.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

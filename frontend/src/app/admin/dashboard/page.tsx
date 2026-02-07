"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// --- [Helper Functions] ---
const maskEmail = (email: string) => {
  const [name, domain] = email.split('@');
  if (name.length <= 2) return `${name}***@${domain}`;
  return `${name.substring(0, 2)}***@${domain}`;
};

// --- [Types] ---
interface DepositRequest {
  id: number;
  user: { id: number; email: string; username: string };
  chain: string;
  expected_amount: number;
  joy_amount: number;
  actual_amount: number | null;
  status: string;
  created_at: string;
  assigned_address: string;
}

interface Sector {
  id: number;
  name: string;
  fee_percent: number;
}

export default function AdminDashboard() {
  const router = useRouter();

  const [requests, setRequests] = useState<DepositRequest[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'deposits' | 'sectors'>('deposits');

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

  useEffect(() => {
    fetchDeposits();
    fetchSectors();
  }, []);

  const fetchDeposits = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/admin/deposits`, { credentials: 'include' });
      if (response.status === 401) { router.push('/admin/login'); return; }
      if (!response.ok) throw new Error('입금 목록을 가져올 수 없습니다.');
      setRequests(await response.json());
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSectors = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/sectors`, { credentials: 'include' });
      if (response.ok) setSectors(await response.json());
    } catch (err) { console.error("섹터 로드 실패:", err); }
  };

  const handleApprove = async (id: number, userEmail: string) => {
    if (!confirm(`${maskEmail(userEmail)} 님의 입금 요청을 승인하시겠습니까?`)) return;
    try {
      setProcessingId(id);
      const response = await fetch(`${API_BASE_URL}/admin/deposits/${id}/approve`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ admin_notes: '승인 완료' })
      });
      if (!response.ok) { const e = await response.json(); throw new Error(e.detail || '승인 실패'); }
      alert('승인 완료. 사용자에게 JOY 코인을 전송하세요!');
      fetchDeposits();
    } catch (err: any) { alert(err.message); }
    finally { setProcessingId(null); }
  };

  const handleReject = async (id: number, userEmail: string) => {
    const reason = prompt(`${maskEmail(userEmail)} 님의 입금 요청 거절 사유:`);
    if (!reason) return;
    try {
      setProcessingId(id);
      const response = await fetch(`${API_BASE_URL}/admin/deposits/${id}/reject`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ admin_notes: reason })
      });
      if (!response.ok) { const e = await response.json(); throw new Error(e.detail || '거절 실패'); }
      alert('입금 요청이 거절되었습니다.');
      fetchDeposits();
    } catch (err: any) { alert(err.message); }
    finally { setProcessingId(null); }
  };

  const handleFeeChange = async (sectorId: number, fee: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/sectors/${sectorId}/fee`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, credentials: 'include',
        body: JSON.stringify({ fee_percent: fee })
      });
      if (!response.ok) throw new Error('Fee 변경 실패');
      fetchSectors();
    } catch (err: any) { alert(err.message); }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, { method: 'POST', credentials: 'include' });
      router.push('/admin/login');
    } catch (err) { router.push('/admin/login'); }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
      approved: "bg-green-500/10 text-green-400 border-green-500/20",
      rejected: "bg-red-500/10 text-red-400 border-red-500/20",
    };
    const labels: Record<string, string> = { pending: "대기중", approved: "승인완료", rejected: "거절됨" };
    return (
      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${styles[status] || styles.pending}`}>
        {labels[status] || status}
      </span>
    );
  };

  // 검색 + 필터링
  const filteredRequests = requests.filter(req => {
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    const matchesSearch = !searchQuery ||
      req.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.id.toString().includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  if (error) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 text-center">
        <div className="p-10 rounded-[2.5rem] border border-red-500/20 max-w-md w-full bg-slate-900/40">
          <h2 className="text-red-500 font-black mb-4 uppercase tracking-widest text-xl">System Error</h2>
          <p className="text-slate-400 text-sm mb-6">{error}</p>
          <button onClick={fetchDeposits} className="w-full py-4 bg-red-600/20 text-red-500 font-black rounded-2xl hover:bg-red-600 hover:text-white transition-all">재시도</button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#020617] text-white flex flex-col overflow-hidden font-sans">
      {/* 헤더 - 고정 */}
      <div className="flex-shrink-0 p-6 md:px-12 md:pt-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black italic tracking-tighter text-blue-500 uppercase">
              Admin <span className="text-white">Dashboard</span>
            </h1>
            <p className="text-slate-500 text-[10px] font-bold uppercase mt-1 tracking-[0.3em]">총관리자 시스템</p>
          </div>
          <div className="flex gap-3 items-center">
            <div className="hidden md:flex bg-green-500/10 border border-green-500/20 px-4 py-2 rounded-full items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-black text-green-500">ONLINE</span>
            </div>
            <button onClick={handleLogout} className="bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-full text-[10px] font-black text-red-500 hover:bg-red-500/20 transition-all">
              LOGOUT
            </button>
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="flex-shrink-0 px-6 md:px-12 pt-4">
        <div className="max-w-7xl mx-auto flex gap-2">
          <button
            onClick={() => setActiveTab('deposits')}
            className={`px-6 py-2 rounded-xl text-xs font-black uppercase transition-all ${activeTab === 'deposits' ? 'bg-blue-600 text-white' : 'bg-slate-800/50 text-slate-400 hover:text-white'}`}
          >
            입금 요청 관리
          </button>
          <button
            onClick={() => setActiveTab('sectors')}
            className={`px-6 py-2 rounded-xl text-xs font-black uppercase transition-all ${activeTab === 'sectors' ? 'bg-blue-600 text-white' : 'bg-slate-800/50 text-slate-400 hover:text-white'}`}
          >
            섹터 Fee 설정
          </button>
        </div>
      </div>

      {/* 메인 컨텐츠 - 스크롤 영역 */}
      <div className="flex-1 overflow-y-auto p-6 md:px-12 md:pb-8">
        <div className="max-w-7xl mx-auto space-y-6">

          {isLoading ? (
            <div className="py-20 text-center animate-pulse">
              <p className="text-blue-500 font-black tracking-[0.5em] text-sm uppercase italic">Loading Data...</p>
            </div>
          ) : activeTab === 'deposits' ? (
            <>
              {/* 통계 카드 */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/40">
                  <p className="text-yellow-500 text-[10px] font-black uppercase tracking-widest">대기중</p>
                  <p className="text-3xl font-black italic mt-2">{requests.filter(r => r.status === 'pending').length}</p>
                </div>
                <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/40">
                  <p className="text-green-500 text-[10px] font-black uppercase tracking-widest">승인완료</p>
                  <p className="text-3xl font-black italic mt-2">{requests.filter(r => r.status === 'approved').length}</p>
                </div>
                <div className="p-6 rounded-2xl border border-white/5 bg-slate-900/40">
                  <p className="text-red-500 text-[10px] font-black uppercase tracking-widest">거절됨</p>
                  <p className="text-3xl font-black italic mt-2">{requests.filter(r => r.status === 'rejected').length}</p>
                </div>
              </div>

              {/* 검색 + 필터 */}
              <div className="flex gap-3 items-center">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="이메일, 유저명, ID로 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-900/60 border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50"
                  />
                </div>
                <div className="flex gap-1">
                  {['all', 'pending', 'approved', 'rejected'].map(s => (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      className={`px-3 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${statusFilter === s ? 'bg-blue-600 text-white' : 'bg-slate-800/50 text-slate-500 hover:text-white'}`}
                    >
                      {s === 'all' ? '전체' : s === 'pending' ? '대기' : s === 'approved' ? '승인' : '거절'}
                    </button>
                  ))}
                </div>
              </div>

              {/* 입금 요청 테이블 */}
              <div className="rounded-2xl overflow-hidden border border-white/5 bg-slate-900/20">
                {filteredRequests.length === 0 ? (
                  <div className="p-16 text-center text-slate-600 font-bold uppercase tracking-widest text-sm">
                    {searchQuery ? '검색 결과가 없습니다' : '입금 요청이 없습니다'}
                  </div>
                ) : (
                  <div className="max-h-[50vh] overflow-y-auto">
                    <table className="w-full text-left">
                      <thead className="bg-white/5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] sticky top-0 z-10">
                        <tr>
                          <th className="p-5">ID</th>
                          <th className="p-5">유저</th>
                          <th className="p-5">네트워크</th>
                          <th className="p-5 text-right">금액</th>
                          <th className="p-5 text-right">JOY 수량</th>
                          <th className="p-5 text-center">상태</th>
                          <th className="p-5 text-center">요청일시</th>
                          <th className="p-5 text-right">액션</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm font-bold">
                        {filteredRequests.map((req) => (
                          <tr key={req.id} className="border-t border-white/5 hover:bg-white/[0.02] transition-colors">
                            <td className="p-5"><div className="font-mono text-xs text-slate-500">#{req.id}</div></td>
                            <td className="p-5">
                              <div className="font-mono text-xs text-blue-300">{maskEmail(req.user.email)}</div>
                              <div className="text-[9px] text-slate-600 mt-1">{req.user.username}</div>
                            </td>
                            <td className="p-5">
                              <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] text-blue-400 font-black uppercase italic">{req.chain}</span>
                            </td>
                            <td className="p-5 text-right font-mono italic text-slate-300">{req.expected_amount.toLocaleString()} USDT</td>
                            <td className="p-5 text-right font-mono italic text-blue-400">{(req.joy_amount || 0).toLocaleString()} JOY</td>
                            <td className="p-5 text-center">{getStatusBadge(req.status)}</td>
                            <td className="p-5 text-center text-slate-500 text-xs">{new Date(req.created_at).toLocaleString('ko-KR')}</td>
                            <td className="p-5 text-right">
                              {req.status === 'pending' ? (
                                <div className="flex gap-2 justify-end">
                                  <button onClick={() => handleApprove(req.id, req.user.email)} disabled={processingId === req.id}
                                    className="px-3 py-1.5 bg-green-600 hover:bg-green-500 disabled:bg-slate-700 text-white text-[10px] font-black rounded-lg transition-all uppercase">
                                    {processingId === req.id ? '...' : '승인'}
                                  </button>
                                  <button onClick={() => handleReject(req.id, req.user.email)} disabled={processingId === req.id}
                                    className="px-3 py-1.5 bg-red-600 hover:bg-red-500 disabled:bg-slate-700 text-white text-[10px] font-black rounded-lg transition-all uppercase">
                                    거절
                                  </button>
                                </div>
                              ) : (
                                <span className="text-slate-600 text-[10px] uppercase font-black tracking-widest">
                                  {req.status === 'approved' ? '완료' : '거절됨'}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              <p className="text-slate-600 text-[10px] text-right">총 {filteredRequests.length}건</p>
            </>
          ) : (
            /* 섹터 Fee 설정 탭 */
            <div className="space-y-6">
              <h2 className="text-slate-400 text-xs font-black uppercase tracking-[0.3em] italic">섹터별 Fee 설정</h2>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {sectors.map(sector => (
                  <div key={sector.id} className="p-6 rounded-2xl border border-white/5 bg-slate-900/40 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-2xl font-black italic text-blue-400">Sector {sector.name}</h3>
                      <span className="text-xl font-black text-green-400">{sector.fee_percent}%</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1">
                      {[5, 10, 15, 20].map(fee => (
                        <button
                          key={fee}
                          onClick={() => handleFeeChange(sector.id, fee)}
                          className={`py-2 rounded-lg text-xs font-black transition-all ${sector.fee_percent === fee
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-800 text-slate-500 hover:bg-slate-700 hover:text-white'
                          }`}
                        >
                          {fee}%
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

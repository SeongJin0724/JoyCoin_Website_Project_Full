"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { createDepositRequest } from "@/lib/api";
import QRCode from "react-qr-code";

const JOYCOIN_PRICE_USD = 0.20;

export default function BuyPage() {
  const [amount, setAmount] = useState(0);
  const [showPayment, setShowPayment] = useState(false);
  const [checkout, setCheckout] = useState<null | {
    assigned_address: string;
    expected_amount: string;
    reference_code: string;
  }>(null);
  const [isLoading, setIsLoading] = useState(false);
  const token = typeof window !== "undefined" ? localStorage.getItem("access") || "" : "";

  const handleIncrement = (val: number) => setAmount(prev => prev + val);
  const handleReset = (val: number) => setAmount(val);

  const usdtAmount = (amount * JOYCOIN_PRICE_USD).toFixed(2);

  const handleBuy = async () => {
    if (amount <= 0) return;
    if (!token) {
      alert("로그인이 필요합니다");
      window.location.href = "/auth/login";
      return;
    }
    try {
      setShowPayment(true);
      setIsLoading(true);
      const resp = await createDepositRequest({
        token,
        chain: "TRON",
        amount_usdt: parseFloat(usdtAmount),
      });
      setCheckout(resp);
      setIsLoading(false);
    } catch (e: any) {
      setIsLoading(false);
      setShowPayment(false);
      alert("입금요청 실패: " + e.message);
    }
  };

  function Modal(props: { open: boolean; onClose: () => void; children: React.ReactNode }) {
    const { open, onClose, children } = props;
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    if (!open || !mounted) return null;
    const content = (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/80" onClick={onClose} />
        <div className="relative z-[10000] w-full max-w-md">{children}</div>
      </div>
    );
    return createPortal(content, document.body);
  }

  if (showPayment) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <Modal open={showPayment} onClose={() => (!isLoading ? setShowPayment(false) : () => {})}>
          <div className="glass p-8 rounded-3xl w-full text-center space-y-6">
            {isLoading || !checkout ? (
              <div className="py-6 text-center">
                <div className="mx-auto mb-3 h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600" />
                <div className="text-sm text-slate-400">입금 요청 중...</div>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-black text-white">입금 확인</h2>
                <div className="bg-slate-900 p-4 rounded-2xl mx-auto w-48 h-48 flex items-center justify-center relative shadow-inner border border-slate-800">
                  <QRCode 
                    value={`USDT Payment\nAddr:${checkout.assigned_address}\nAmt:${checkout.expected_amount}`} 
                    size={180}
                    className="w-full h-full"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-slate-400 text-sm font-medium">USDT (TRC20)를 이 주소로 전송하세요</p>
                  <p className="text-4xl font-black text-blue-500">{checkout.expected_amount} <span className="text-lg">USDT</span></p>
                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 break-all font-mono text-xs text-blue-400 select-all">
                    {checkout.assigned_address}
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 break-all font-mono text-xs text-slate-400">
                    참조코드: {checkout.reference_code}
                  </div>
                </div>
                <div className="pt-4 space-y-3">
                  <button 
                    onClick={() => setShowPayment(false)}
                    className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-black rounded-xl transition-all shadow-lg shadow-green-500/20 active:scale-95"
                  >
                    확인했습니다
                  </button>
                  <button 
                    onClick={() => setShowPayment(false)}
                    className="w-full py-4 bg-slate-800 text-slate-400 font-bold rounded-xl transition hover:text-white"
                  >
                    취소
                  </button>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl">
                  <p className="text-[10px] text-blue-400 font-bold uppercase leading-relaxed">
                    관리자가 입금을 확인하면 상태가 "입금완료"로 변경됩니다. 
                    마이페이지에서 확인하실 수 있습니다.
                  </p>
                </div>
              </>
            )}
          </div>
        </Modal>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center py-12 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="w-full max-w-3xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h2 className="text-5xl font-black mb-3 italic tracking-tighter text-white">조이코인 구매</h2>
            <p className="text-slate-500 font-medium">고정 환율: <span className="text-white">1 JOY = $0.20 USDT</span></p>
          </div>
          <div className="text-right glass px-8 py-4 rounded-2xl border border-slate-800">
            <p className="text-xs text-slate-500 uppercase font-black tracking-widest mb-1">소계 (JOY)</p>
            <p className="text-6xl font-black text-blue-500 tracking-tighter">{amount.toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-10">
            <div className="space-y-4">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                시작 수량 선택
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[1000, 5000, 10000].map(v => (
                  <button 
                    key={v}
                    onClick={() => handleReset(v)}
                    className={`py-4 rounded-2xl font-black transition-all border-2 ${
                      amount === v 
                        ? 'bg-blue-600 border-blue-400 text-white shadow-xl shadow-blue-600/20' 
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {v.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                수량 추가
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[1000, 5000, 10000].map(v => (
                  <button 
                    key={v}
                    onClick={() => handleIncrement(v)}
                    className="py-4 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border-2 border-indigo-500/20 rounded-2xl font-black transition-all active:scale-95"
                  >
                    +{v.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="glass p-10 rounded-[2.5rem] flex flex-col justify-between border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
            </div>
            
            <div className="space-y-6 relative">
              <h3 className="text-lg font-black italic text-slate-400 uppercase tracking-widest">주문 요약</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-slate-500 font-bold border-b border-slate-800 pb-4">
                  <span>수량</span>
                  <span className="text-white font-black">{amount.toLocaleString()} JOY</span>
                </div>
                <div className="flex justify-between items-center text-slate-500 font-bold border-b border-slate-800 pb-4">
                  <span>JOY당 가격</span>
                  <span className="text-white font-black">$0.20 USDT</span>
                </div>
                <div className="flex justify-between items-end pt-4">
                  <span className="text-slate-300 font-black uppercase tracking-widest text-sm">총액</span>
                  <div className="text-right">
                    <span className="text-4xl font-black text-blue-500">{usdtAmount}</span>
                    <span className="text-lg font-black text-blue-600 ml-2">USDT</span>
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={handleBuy}
              disabled={amount <= 0}
              className="mt-12 w-full py-6 bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:grayscale text-white font-black text-2xl rounded-3xl shadow-2xl shadow-blue-600/30 transition-all active:scale-[0.98] uppercase tracking-tighter italic"
            >
              결제 진행하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

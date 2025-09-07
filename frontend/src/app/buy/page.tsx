"use client";
import { useState, useEffect } from "react";
import { createDepositRequest } from "@/lib/api";
import QRCode from "qrcode.react";

type Pack = { snp: number; usdt: number };

const PACKS: Pack[] = [
  { snp: 500, usdt: 100 },
  { snp: 1000, usdt: 200 },
  { snp: 2500, usdt: 500 },
  { snp: 5000, usdt: 1000 },
  { snp: 25000, usdt: 5000 },
  { snp: 50000, usdt: 10000 },
];

export default function BuyPage() {
  const [cart, setCart] = useState<Pack[]>([]);
  const [checkout, setCheckout] = useState<null | {
    assigned_address: string;
    expected_amount: string;
    reference_code: string;
  }>(null);

  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const add = (p: Pack) => setCart([...cart, p]);
  const clear = () => setCart([]);
  const total = cart.reduce((s, p) => s + p.usdt, 0);

  const token = typeof window !== "undefined" ? localStorage.getItem("access") || "" : "";

  const onCheckout = async () => {
    if (!token) {
      alert("로그인이 필요합니다");
      return;
    }
    try {
      const resp = await createDepositRequest({
        token,
        chain: "TRON", // 또는 ETH 선택 기능 추후 추가
        amount_usdt: String(total),
      });
      setCheckout(resp);
    } catch (e: any) {
      alert("입금요청 실패: " + e.message);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">구매하기</h2>

      <div className="rounded-xl border bg-white p-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded bg-violet-500"></div>
          <span className="font-semibold">지갑 앱 설치(예시)</span>
          <div className="ml-auto text-sm text-slate-500">iOS / Android</div>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-4 mb-6">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">장바구니</h3>
          <button onClick={clear} className="text-sm text-slate-500 hover:underline">
            비우기
          </button>
        </div>

        {cart.length === 0 ? (
          <p className="text-sm text-slate-500">장바구니가 비어 있어요</p>
        ) : (
          <div className="mt-2 space-y-1">
            {cart.map((p, i) => (
              <div key={i} className="text-sm flex justify-between">
                <span>{p.snp} SNP</span>
                <span>{p.usdt.toLocaleString()} USDT</span>
              </div>
            ))}
            <div className="mt-2 pt-2 border-t flex justify-between font-semibold">
              <span>합계</span>
              <span>{total.toLocaleString()} USDT</span>
            </div>
          </div>
        )}

        <div className="mt-4">
          <button
            className="px-4 py-2 rounded-full bg-fuchsia-600 text-white disabled:opacity-40"
            disabled={cart.length === 0}
            onClick={onCheckout}
          >
            구매하기
          </button>
        </div>
      </div> {/* ←← 여기 닫는 태그 추가! (장바구니 카드 종료) */}

      {checkout && (
        <div className="mt-6 p-4 rounded-xl border space-y-3">
          <h3 className="font-semibold">입금 정보</h3>
          <div className="font-mono break-all">주소: {checkout.assigned_address}</div>
          <div className="font-mono">금액: {checkout.expected_amount} USDT</div>
          <div className="font-mono">참조코드: {checkout.reference_code}</div>
          <div className="flex justify-center">
            <QRCode
              value={`USDT Payment\nAddr:${checkout.assigned_address}\nAmt:${checkout.expected_amount}`}
              size={180}
            />
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-4 mt-6">
        {PACKS.map((p) => (
          <div key={p.snp} className="rounded-xl border bg-white p-4">
            <div className="h-40 rounded-lg bg-gradient-to-br from-slate-50 to-violet-50 mb-4" />
            <div className="flex items-center justify-between">
              <span className="font-semibold">{p.snp} SNP</span>
              <button
                className="px-3 py-1 rounded-full bg-fuchsia-500 text-white text-sm"
                onClick={() => setCart([...cart, p])}
              >
                추가
              </button>
            </div>
            <div className="mt-2 text-sm text-slate-600">🔴 {p.usdt.toLocaleString()} USDT</div>
          </div>
        ))}
      </div>
    </div>
  );
}

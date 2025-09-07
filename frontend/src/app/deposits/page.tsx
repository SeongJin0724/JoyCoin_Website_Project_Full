"use client";

import { useEffect, useMemo, useState } from "react";
import { getMyDeposits } from "@/lib/api";

function Badge({ status }: { status: string }) {
  const color = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    credited: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    review_required: "bg-orange-100 text-orange-800",
  }[status] || "bg-gray-100 text-gray-800";
  return <span className={`px-2 py-1 rounded-full text-xs ${color}`}>{status}</span>;
}

export default function MyDepositsPage() {
  const token = useMemo(() => (typeof window !== "undefined" ? localStorage.getItem("access") || "" : ""), []);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }
    (async () => {
      try {
        const r = await getMyDeposits(token);
        setItems(r.items || []);
      } catch (e: any) {
        alert("조회 실패: " + e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  if (!token) return null;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">내 입금내역</h1>
      {loading ? (
        <div>불러오는 중…</div>
      ) : items.length === 0 ? (
        <div className="text-gray-600">입금요청 내역이 없습니다.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 border">ID</th>
                <th className="p-2 border">체인</th>
                <th className="p-2 border">주소</th>
                <th className="p-2 border">요청금액</th>
                <th className="p-2 border">상태</th>
                <th className="p-2 border">Tx</th>
                <th className="p-2 border">요청시간</th>
                <th className="p-2 border">확정시간</th>
              </tr>
            </thead>
            <tbody>
              {items.map((r) => (
                <tr key={r.id} className="odd:bg-white even:bg-gray-50">
                  <td className="p-2 border text-center">{r.id}</td>
                  <td className="p-2 border">{r.chain}</td>
                  <td className="p-2 border font-mono break-all">{r.assigned_address}</td>
                  <td className="p-2 border font-mono">{r.expected_amount}</td>
                  <td className="p-2 border"><Badge status={r.status} /></td>
                  <td className="p-2 border font-mono break-all">{r.tx_hash || "-"}</td>
                  <td className="p-2 border text-xs">{r.created_at?.replace("T"," ").slice(0,19) || "-"}</td>
                  <td className="p-2 border text-xs">{r.confirmed_at?.replace("T"," ").slice(0,19) || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

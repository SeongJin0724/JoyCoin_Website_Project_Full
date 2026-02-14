"use client";

import { useLanguage } from "@/lib/LanguageContext";

export default function TokenPage() {
  const { locale } = useLanguage();
  const ko = locale === "ko";

  return (
    <div className="min-h-screen pt-28 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-slate-900/80 border border-slate-700/50 rounded-2xl p-8 md:p-12 backdrop-blur-sm">
          <h1 className="text-3xl font-bold text-white mb-2">
            {ko ? "JOY 토큰 성격 안내" : "JOY Token Nature Statement"}
          </h1>
          <p className="text-sm text-cyan-400 font-medium mb-8 border-b border-slate-700/50 pb-6">
            {ko
              ? "본 플랫폼은 디지털 참여 서비스를 제공하며, 금융, 투자 또는 증권 상품을 제공하지 않습니다."
              : "This platform provides digital participation services and does not offer financial, investment, or securities products."}
          </p>

          <div className="space-y-6 text-slate-300 text-sm leading-relaxed">
            <p>
              {ko
                ? "JOY는 플랫폼 생태계 내에서 사용하도록 설계된 디지털 참여 단위입니다."
                : "JOY is a digital participation unit designed for use within the platform ecosystem."}
            </p>

            <section>
              <p className="mb-2 font-semibold text-white">
                {ko ? "JOY는 다음에 해당하지 않습니다:" : "JOY does NOT represent:"}
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-slate-400">
                <li>{ko ? "투자 상품" : "investment instruments"}</li>
                <li>{ko ? "증권" : "securities"}</li>
                <li>{ko ? "소유권" : "ownership rights"}</li>
                <li>{ko ? "수익 배분 권리" : "profit entitlement"}</li>
                <li>{ko ? "지분 참여" : "equity participation"}</li>
              </ul>
            </section>

            <p className="text-yellow-400 font-semibold">
              {ko
                ? "JOY는 내부 접근 및 참여 메커니즘으로만 기능합니다."
                : "JOY functions solely as an internal access and participation mechanism."}
            </p>

            <section>
              <p className="mb-2 font-semibold text-white">
                {ko ? "플랫폼은 다음을 보장하지 않습니다:" : "The platform does not guarantee:"}
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-slate-400">
                <li>{ko ? "재판매 가치" : "resale value"}</li>
                <li>{ko ? "유동성" : "liquidity"}</li>
                <li>{ko ? "가격 상승" : "price appreciation"}</li>
              </ul>
            </section>

            <p>
              {ko
                ? "외부 거래가 있는 경우 이는 회사와 무관합니다."
                : "External trading, if any, is independent of the Company."}
            </p>

            <p className="text-yellow-400 font-semibold mt-4">
              {ko
                ? "사용자는 JOY가 투자 목적으로 구매되지 않음을 인정합니다."
                : "Users acknowledge JOY is not purchased for investment purposes."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useLanguage } from "@/lib/LanguageContext";

export default function RiskPage() {
  const { locale } = useLanguage();
  const ko = locale === "ko";

  return (
    <div className="min-h-screen pt-28 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-slate-900/80 border border-slate-700/50 rounded-2xl p-8 md:p-12 backdrop-blur-sm">
          <h1 className="text-3xl font-bold text-white mb-1">
            {ko ? "위험 고지" : "Risk Disclosure"}
          </h1>
          <h2 className="text-lg text-yellow-400 font-semibold mb-2">
            {ko ? "디지털 자산 위험 안내" : "Digital Asset Risk Notice"}
          </h2>
          <p className="text-sm text-cyan-400 font-medium mb-8 border-b border-slate-700/50 pb-6">
            {ko
              ? "본 플랫폼은 디지털 참여 서비스를 제공하며, 금융, 투자 또는 증권 상품을 제공하지 않습니다."
              : "This platform provides digital participation services and does not offer financial, investment, or securities products."}
          </p>

          <p className="text-slate-300 text-sm leading-relaxed mb-8">
            {ko
              ? "JOYCOIN 플랫폼 참여는 디지털 자산 상호작용을 포함하며 고유한 위험을 수반합니다. 사용자는 다음을 인정하고 수락합니다:"
              : "Participation in the JOYCOIN platform involves digital asset interactions and carries inherent risks. Users acknowledge and accept the following:"}
          </p>

          <div className="space-y-8 text-slate-300 text-sm leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                {ko ? "1. 규제 위험" : "1. Regulatory Risk"}
              </h2>
              <p>
                {ko
                  ? "디지털 자산 규제는 언제든지 변경될 수 있으며 플랫폼 운영이나 이용 가능성에 영향을 미칠 수 있습니다."
                  : "Digital asset regulations may change at any time and may affect platform operation or availability."}
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                {ko ? "2. 변동성 위험" : "2. Volatility Risk"}
              </h2>
              <p>
                {ko
                  ? "디지털 참여 단위 및 관련 자산의 인식된 가치나 유용성이 변동될 수 있습니다."
                  : "Digital participation units and related assets may fluctuate in perceived value or utility."}
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                {ko ? "3. 기술적 위험" : "3. Technical Risk"}
              </h2>
              <p className="mb-2">{ko ? "플랫폼에 다음이 발생할 수 있습니다:" : "The platform may experience:"}</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-slate-400">
                <li>{ko ? "다운타임" : "downtime"}</li>
                <li>{ko ? "시스템 오류" : "system errors"}</li>
                <li>{ko ? "스마트 컨트랙트 문제" : "smart contract issues"}</li>
                <li>{ko ? "블록체인 네트워크 지연" : "blockchain network delays"}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                {ko ? "4. 전송 위험" : "4. Transfer Risk"}
              </h2>
              <p>
                {ko
                  ? "디지털 자산 전송은 되돌릴 수 없습니다. 잘못된 지갑 주소는 영구적인 손실을 초래할 수 있습니다."
                  : "Digital asset transfers are irreversible. Incorrect wallet addresses may result in permanent loss."}
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                {ko ? "5. 추천 및 배분 변경" : "5. Referral & Allocation Changes"}
              </h2>
              <p>
                {ko
                  ? "추천 비율, 배분 모델 및 섹터 구조는 언제든지 변경될 수 있습니다."
                  : "Referral ratios, allocation models, and sector structures may change at any time."}
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                {ko ? "6. 보증 없음" : "6. No Guarantee"}
              </h2>
              <p className="mb-2">{ko ? "회사는 다음을 보장하지 않습니다:" : "The Company does not guarantee:"}</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-slate-400">
                <li>{ko ? "배분" : "allocation"}</li>
                <li>{ko ? "가치 유지" : "value retention"}</li>
                <li>{ko ? "유동성" : "liquidity"}</li>
                <li>{ko ? "서비스 지속성" : "continuity of service"}</li>
              </ul>
              <p className="mt-4 text-yellow-400 font-semibold">
                {ko
                  ? "참여는 자발적이며 전적으로 사용자의 위험 부담하에 이루어집니다."
                  : "Participation is voluntary and at the user's sole risk."}
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

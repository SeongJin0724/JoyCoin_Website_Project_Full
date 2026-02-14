"use client";

import { useLanguage } from "@/lib/LanguageContext";

export default function TermsPage() {
  const { locale } = useLanguage();
  const ko = locale === "ko";

  return (
    <div className="min-h-screen pt-28 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-slate-900/80 border border-slate-700/50 rounded-2xl p-8 md:p-12 backdrop-blur-sm">
          <h1 className="text-3xl font-bold text-white mb-2">
            {ko ? "JOYCOIN 이용약관" : "JOYCOIN Terms of Use"}
          </h1>
          <p className="text-sm text-cyan-400 font-medium mb-8 border-b border-slate-700/50 pb-6">
            {ko
              ? "본 플랫폼은 디지털 참여 서비스를 제공하며, 금융, 투자 또는 증권 상품을 제공하지 않습니다."
              : "This platform provides digital participation services and does not offer financial, investment, or securities products."}
          </p>

          <div className="space-y-8 text-slate-300 text-sm leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                {ko ? "1. 플랫폼 정의" : "1. Platform Definition"}
              </h2>
              <p className="mb-3">
                {ko
                  ? 'JOYCOIN은 자체 생태계 내에서 사용하기 위한 내부 참여 단위("JOY")를 배분하는 디지털 플랫폼입니다.'
                  : 'JOYCOIN is a digital platform that allocates internal participation units ("JOY") for use within its ecosystem.'}
              </p>
              <p className="mb-2">{ko ? "JOY는 다음에 해당하지 않습니다:" : "JOY does not represent:"}</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-slate-400">
                <li>{ko ? "증권" : "securities"}</li>
                <li>{ko ? "지분" : "equity"}</li>
                <li>{ko ? "소유권" : "ownership"}</li>
                <li>{ko ? "금융 상품" : "financial instruments"}</li>
                <li>{ko ? "투자 계약" : "investment contracts"}</li>
              </ul>
              <p className="mt-3">
                {ko
                  ? "본 플랫폼은 서비스 시스템으로 운영되며, 금융 기관, 중개업체 또는 거래소로 운영되지 않습니다."
                  : "The platform operates as a service system and not as a financial institution, brokerage, or exchange."}
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                {ko ? "2. 비투자 성격 인정" : "2. Acknowledgement of Non-Investment Nature"}
              </h2>
              <p className="mb-2">{ko ? "사용자는 다음을 인정하고 동의합니다:" : "Users acknowledge and agree that:"}</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-slate-400">
                <li>{ko ? "JOY는 투자 상품이 아닙니다" : "JOY is not an investment product"}</li>
                <li>{ko ? "JOY는 금전적 수익을 위해 제공되지 않습니다" : "JOY is not offered for financial return"}</li>
                <li>{ko ? "회사는 가치, 유동성 또는 가격 상승을 보장하지 않습니다" : "the Company does not guarantee value, liquidity, or appreciation"}</li>
              </ul>
              <p className="mt-3">
                {ko ? "플랫폼 참여는 자발적이며 서비스 이용 목적으로만 제공됩니다." : "Participation in the platform is voluntary and for service use only."}
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                {ko ? "3. 참여 및 배분 방식" : "3. Participation & Allocation Mechanism"}
              </h2>
              <p className="mb-3">
                {ko ? "사용자는 플랫폼 참여를 통해 JOY 배분을 요청할 수 있습니다." : "Users may request JOY allocation through platform participation."}
              </p>
              <p className="mb-2">
                {ko ? "디지털 자산 전송(USDT 포함)은 다음으로 처리됩니다:" : "Digital asset transfers (including USDT) are processed as:"}
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-slate-400">
                <li>{ko ? "참여 요청" : "participation requests"}</li>
                <li>{ko ? "구매 계약이 아님" : "not purchase agreements"}</li>
                <li>{ko ? "투자 거래가 아님" : "not investment transactions"}</li>
              </ul>
              <p className="mt-3">
                {ko ? "JOY는 관리자 확인 후에만 배분됩니다." : "JOY is allocated only after administrative verification."}
              </p>
              <p className="mt-3 mb-2">{ko ? "회사는 다음 권리를 보유합니다:" : "The Company reserves the right to:"}</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-slate-400">
                <li>{ko ? "승인" : "approve"}</li>
                <li>{ko ? "거절" : "reject"}</li>
                <li>{ko ? "지연" : "delay"}</li>
                <li>{ko ? "검토" : "review"}</li>
              </ul>
              <p className="mt-2">
                {ko ? "모든 배분 요청을 회사의 재량에 따라 처리합니다." : "any allocation request at its discretion."}
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                {ko ? "4. 디지털 자산 전송 책임" : "4. Digital Asset Transfer Responsibility"}
              </h2>
              <p className="mb-2">{ko ? "사용자는 다음을 인정합니다:" : "Users acknowledge:"}</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-slate-400">
                <li>{ko ? "블록체인 거래는 되돌릴 수 없습니다" : "blockchain transactions are irreversible"}</li>
                <li>{ko ? "지갑 주소 정확성은 사용자 책임입니다" : "wallet accuracy is user responsibility"}</li>
                <li>{ko ? "회사는 블록체인 네트워크를 통제하지 않습니다" : "the Company does not control blockchain networks"}</li>
                <li>{ko ? "거래 확인은 제3자 인프라에 의존합니다" : "transaction confirmation depends on third-party infrastructure"}</li>
              </ul>
              <p className="mt-3 mb-2">{ko ? "회사는 다음에 대해 책임지지 않습니다:" : "The Company is not liable for:"}</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-slate-400">
                <li>{ko ? "잘못된 전송" : "incorrect transfers"}</li>
                <li>{ko ? "네트워크 장애" : "network failures"}</li>
                <li>{ko ? "사용자 실수로 인한 자산 손실" : "lost assets due to user error"}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                {ko ? "5. 추천인 프로그램" : "5. Referral Program"}
              </h2>
              <p className="mb-3">
                {ko ? "추천 시스템은 참여 기반 활동 기능입니다." : "The referral system is a participation-based engagement feature."}
              </p>
              <p className="mb-2">{ko ? "이것은 다음에 해당하지 않습니다:" : "It does not constitute:"}</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-slate-400">
                <li>{ko ? "수입 보장" : "income guarantee"}</li>
                <li>{ko ? "투자 인센티브" : "investment incentive"}</li>
                <li>{ko ? "수익 분배 프로그램" : "profit-sharing program"}</li>
                <li>{ko ? "금전적 배분 권리" : "financial distribution right"}</li>
              </ul>
              <p className="mt-3">
                {ko
                  ? "추천 비율은 사전 통보 없이 수정, 중단 또는 종료될 수 있습니다."
                  : "Referral ratios may be modified, suspended, or discontinued at any time without notice."}
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                {ko ? "6. 섹터 구조" : "6. Sector Structure"}
              </h2>
              <p className="mb-3">
                {ko
                  ? "섹터 배정 및 섹터 기여 모델은 운영 관리 구조입니다."
                  : "Sector assignments and sector contribution models are operational management structures."}
              </p>
              <p className="mb-2">{ko ? "이것은 다음을 나타내지 않습니다:" : "They do not represent:"}</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-slate-400">
                <li>{ko ? "소유권" : "ownership"}</li>
                <li>{ko ? "지분 참여" : "equity participation"}</li>
                <li>{ko ? "수익 권리" : "revenue rights"}</li>
                <li>{ko ? "파트너십 계약" : "partnership arrangements"}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                {ko ? "7. 거래소 또는 중개 서비스 미제공" : "7. No Exchange or Brokerage Services"}
              </h2>
              <p className="mb-2">{ko ? "JOYCOIN은 다음을 하지 않습니다:" : "JOYCOIN does not:"}</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-slate-400">
                <li>{ko ? "암호화폐 거래소 운영" : "operate a cryptocurrency exchange"}</li>
                <li>{ko ? "중개 서비스 제공" : "provide brokerage services"}</li>
                <li>{ko ? "외부 거래 지원" : "facilitate external trading"}</li>
                <li>{ko ? "토큰 유동성 보장" : "guarantee token liquidity"}</li>
              </ul>
              <p className="mt-3">
                {ko
                  ? "제3자 거래 활동은 회사의 책임 범위 밖입니다."
                  : "Any third-party trading activity is outside the Company's responsibility."}
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                {ko ? "8. 위험 고지" : "8. Risk Disclosure"}
              </h2>
              <p className="mb-2">
                {ko ? "사용자는 디지털 참여와 관련된 위험을 인정합니다:" : "Users acknowledge risks associated with digital participation, including:"}
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-slate-400">
                <li>{ko ? "규제 불확실성" : "regulatory uncertainty"}</li>
                <li>{ko ? "디지털 자산 변동성" : "digital asset volatility"}</li>
                <li>{ko ? "기술적 장애" : "technical failures"}</li>
                <li>{ko ? "블록체인 네트워크 지연" : "blockchain network delays"}</li>
                <li>{ko ? "시스템 다운타임" : "system downtime"}</li>
              </ul>
              <p className="mt-3">
                {ko
                  ? "참여는 자발적이며 전적으로 사용자의 위험 부담하에 이루어집니다."
                  : "Participation is voluntary and undertaken at the user's sole risk."}
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                {ko ? "9. 사용자 책임" : "9. User Responsibility"}
              </h2>
              <p className="mb-2">{ko ? "사용자는 다음에 대해 전적으로 책임집니다:" : "Users are solely responsible for:"}</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-slate-400">
                <li>{ko ? "현지 법률 준수" : "compliance with local laws"}</li>
                <li>{ko ? "세금 의무" : "tax obligations"}</li>
                <li>{ko ? "지갑 보안" : "wallet security"}</li>
                <li>{ko ? "디지털 자산 관리" : "digital asset management"}</li>
                <li>{ko ? "개인 계정 보호" : "personal account protection"}</li>
              </ul>
              <p className="mt-3">
                {ko ? "회사는 사용자의 과실이나 결정에 대해 책임지지 않습니다." : "The Company shall not be liable for user negligence or decisions."}
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                {ko ? "10. 책임 제한" : "10. Limitation of Liability"}
              </h2>
              <p className="mb-2">{ko ? "회사는 다음에 대해 책임지지 않습니다:" : "The Company is not responsible for:"}</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-slate-400">
                <li>{ko ? "토큰 가치 변동" : "token value changes"}</li>
                <li>{ko ? "추천 구조 변경" : "referral structure changes"}</li>
                <li>{ko ? "섹터 정책 조정" : "sector policy adjustments"}</li>
                <li>{ko ? "제3자 지갑 문제" : "third-party wallet issues"}</li>
                <li>{ko ? "블록체인 장애" : "blockchain failures"}</li>
                <li>{ko ? "외부 거래소 활동" : "external exchange activity"}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                {ko ? "11. 서비스 변경" : "11. Service Modification"}
              </h2>
              <p className="mb-2">{ko ? "회사는 언제든지 다음을 할 수 있습니다:" : "The Company may at any time:"}</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-slate-400">
                <li>{ko ? "JOY 구조 수정" : "modify JOY structure"}</li>
                <li>{ko ? "배분 로직 조정" : "adjust allocation logic"}</li>
                <li>{ko ? "추천 프로그램 중단" : "suspend referral programs"}</li>
                <li>{ko ? "섹터 설정 변경" : "change sector settings"}</li>
                <li>{ko ? "참여 패키지 중단" : "discontinue participation packages"}</li>
              </ul>
              <p className="mt-2">{ko ? "사전 통보 없이 변경될 수 있습니다." : "without prior notice."}</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                {ko ? "12. 접근 제한" : "12. Access Restriction"}
              </h2>
              <p className="mb-2">{ko ? "다음의 경우 회사는 접근을 중단하거나 종료할 수 있습니다:" : "The Company may suspend or terminate access if:"}</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-slate-400">
                <li>{ko ? "불법 활동이 의심되는 경우" : "illegal activity is suspected"}</li>
                <li>{ko ? "플랫폼 남용이 발생한 경우" : "misuse of the platform occurs"}</li>
                <li>{ko ? "시스템 악용이 감지된 경우" : "system abuse is detected"}</li>
                <li>{ko ? "규정 준수 위험이 발생한 경우" : "compliance risks arise"}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                {ko ? "13. 규정 준수 및 법적 책임" : "13. Compliance & Legal Responsibility"}
              </h2>
              <p className="mb-3">
                {ko
                  ? "사용자는 해당 관할권 내 디지털 자산에 관한 모든 적용 법률을 준수해야 합니다."
                  : "Users must comply with all applicable laws regarding digital assets within their jurisdiction."}
              </p>
              <p className="mb-2">{ko ? "회사는 다음에 대해 책임지지 않습니다:" : "The Company is not responsible for:"}</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-slate-400">
                <li>{ko ? "사용자의 규제 위반" : "regulatory violations by users"}</li>
                <li>{ko ? "불법적인 참여" : "unlawful participation"}</li>
                <li>{ko ? "디지털 자산 남용" : "misuse of digital assets"}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                {ko ? "14. 준거법" : "14. Governing Law"}
              </h2>
              <p>
                {ko
                  ? "본 플랫폼은 미국에 등록된 법인이 운영합니다. 모든 분쟁은 해당 미국 법률 및 관할권에 따라 규율됩니다."
                  : "This platform is operated by a U.S.-registered entity. All disputes shall be governed by applicable U.S. law and relevant jurisdiction."}
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                {ko ? "15. 법적 확인" : "15. Legal Acknowledgement"}
              </h2>
              <p className="mb-2">{ko ? "플랫폼에 접근함으로써 사용자는 다음을 확인합니다:" : "By accessing the platform, users confirm that:"}</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-slate-400">
                <li>{ko ? "JOY가 투자 상품이 아님을 이해합니다" : "they understand JOY is not an investment"}</li>
                <li>{ko ? "참여가 자발적임을 인정합니다" : "participation is voluntary"}</li>
                <li>{ko ? "수익 기대가 없음을 인정합니다" : "no profit expectation exists"}</li>
                <li>{ko ? "모든 위험을 인지합니다" : "all risks are acknowledged"}</li>
                <li>{ko ? "본 이용약관을 전적으로 수락합니다" : "they accept these Terms fully"}</li>
              </ul>
              <p className="mt-3">
                {ko
                  ? "플랫폼에 대한 접근 및 지속적인 사용은 본 약관의 수락으로 간주됩니다."
                  : "Access and continued use of the platform constitutes acceptance of this agreement."}
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useLanguage } from "@/lib/LanguageContext";

export default function PrivacyPage() {
  const { locale } = useLanguage();
  const ko = locale === "ko";

  return (
    <div className="min-h-screen pt-28 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-slate-900/80 border border-slate-700/50 rounded-2xl p-8 md:p-12 backdrop-blur-sm">
          <h1 className="text-3xl font-bold text-white mb-2">
            {ko ? "개인정보처리방침" : "Privacy Policy"}
          </h1>
          <p className="text-sm text-cyan-400 font-medium mb-8 border-b border-slate-700/50 pb-6">
            {ko
              ? "본 플랫폼은 디지털 참여 서비스를 제공하며, 금융, 투자 또는 증권 상품을 제공하지 않습니다."
              : "This platform provides digital participation services and does not offer financial, investment, or securities products."}
          </p>

          <div className="space-y-8 text-slate-300 text-sm leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                {ko ? "수집하는 정보" : "Data Collection"}
              </h2>
              <p className="mb-2">{ko ? "플랫폼은 다음을 수집할 수 있습니다:" : "The platform may collect:"}</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-slate-400">
                <li>{ko ? "이메일 주소" : "email address"}</li>
                <li>{ko ? "IP 주소" : "IP address"}</li>
                <li>{ko ? "로그인 기록" : "login records"}</li>
                <li>{ko ? "지갑 주소" : "wallet address"}</li>
                <li>{ko ? "거래 기록" : "transaction logs"}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                {ko ? "이용 목적" : "Purpose of Use"}
              </h2>
              <p className="mb-2">{ko ? "데이터는 다음 목적으로 사용됩니다:" : "Data is used for:"}</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-slate-400">
                <li>{ko ? "계정 인증" : "account authentication"}</li>
                <li>{ko ? "서비스 배분" : "service allocation"}</li>
                <li>{ko ? "사기 방지" : "fraud prevention"}</li>
                <li>{ko ? "운영 분석" : "operational analytics"}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                {ko ? "데이터 저장" : "Data Storage"}
              </h2>
              <p>
                {ko
                  ? "사용자 데이터는 보안 서버에 저장되며 운영 및 규정 준수 목적으로 보관될 수 있습니다."
                  : "User data may be stored on secure servers and retained for operational and compliance purposes."}
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                {ko ? "제3자 서비스" : "Third-Party Services"}
              </h2>
              <p className="mb-2">{ko ? "플랫폼은 다음을 사용할 수 있습니다:" : "The platform may use:"}</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-slate-400">
                <li>{ko ? "블록체인 API" : "blockchain APIs"}</li>
                <li>{ko ? "분석 도구" : "analytics tools"}</li>
                <li>{ko ? "보안 서비스" : "security services"}</li>
              </ul>
              <p className="mt-3">
                {ko
                  ? "이러한 제공업체는 제한된 기술 데이터를 처리할 수 있습니다."
                  : "These providers may process limited technical data."}
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                {ko ? "사용자 책임" : "User Responsibility"}
              </h2>
              <p className="mb-2">{ko ? "사용자는 다음을 보호해야 합니다:" : "Users must protect their:"}</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-slate-400">
                <li>{ko ? "계정 정보" : "credentials"}</li>
                <li>{ko ? "지갑 접근 권한" : "wallet access"}</li>
                <li>{ko ? "기기 보안" : "device security"}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">
                {ko ? "방침 변경" : "Policy Updates"}
              </h2>
              <p>
                {ko ? "본 방침은 사전 통보 없이 변경될 수 있습니다." : "This policy may be updated without prior notice."}
              </p>
              <p className="mt-2">
                {ko
                  ? "플랫폼의 지속적인 사용은 변경 사항의 수락으로 간주됩니다."
                  : "Continued platform use constitutes acceptance."}
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

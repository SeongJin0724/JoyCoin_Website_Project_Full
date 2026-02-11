"use client";
import { useState, useEffect, useRef, useCallback } from "react";

const TABS = [
  { key: "terms", label: "Terms of Use" },
  { key: "risk", label: "Risk Disclosure" },
  { key: "token", label: "Token Nature" },
  { key: "privacy", label: "Privacy Policy" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

/* ── Terms of Use content ── */
function TermsContent() {
  return (
    <div className="space-y-6">
      <Section title="1. Platform Definition">
        <p>JOYCOIN is a digital platform that allocates internal participation units (&quot;JOY&quot;) for use within its ecosystem.</p>
        <p className="mt-2">JOY does not represent:</p>
        <BulletList items={["securities","equity","ownership","financial instruments","investment contracts"]} />
        <p className="mt-2">The platform operates as a service system and not as a financial institution, brokerage, or exchange.</p>
      </Section>
      <Section title="2. Acknowledgement of Non-Investment Nature">
        <p>Users acknowledge and agree that:</p>
        <BulletList items={["JOY is not an investment product","JOY is not offered for financial return","the Company does not guarantee value, liquidity, or appreciation"]} />
        <p className="mt-2">Participation in the platform is voluntary and for service use only.</p>
      </Section>
      <Section title="3. Participation & Allocation Mechanism">
        <p>Users may request JOY allocation through platform participation. Digital asset transfers (including USDT) are processed as participation requests, not purchase agreements or investment transactions.</p>
        <p className="mt-2">JOY is allocated only after administrative verification. The Company reserves the right to approve, reject, delay, or review any allocation request at its discretion.</p>
      </Section>
      <Section title="4. Digital Asset Transfer Responsibility">
        <p>Users acknowledge blockchain transactions are irreversible, wallet accuracy is user responsibility, the Company does not control blockchain networks, and transaction confirmation depends on third-party infrastructure.</p>
        <p className="mt-2">The Company is not liable for incorrect transfers, network failures, or lost assets due to user error.</p>
      </Section>
      <Section title="5. Referral Program">
        <p>The referral system is a participation-based engagement feature. It does not constitute income guarantee, investment incentive, profit-sharing program, or financial distribution right.</p>
        <p className="mt-2">Referral ratios may be modified, suspended, or discontinued at any time without notice.</p>
      </Section>
      <Section title="6. Sector Structure">
        <p>Sector assignments and sector contribution models are operational management structures. They do not represent ownership, equity participation, revenue rights, or partnership arrangements.</p>
      </Section>
      <Section title="7. No Exchange or Brokerage Services">
        <p>JOYCOIN does not operate a cryptocurrency exchange, provide brokerage services, facilitate external trading, or guarantee token liquidity. Any third-party trading activity is outside the Company&apos;s responsibility.</p>
      </Section>
      <Section title="8. Risk Disclosure">
        <p>Users acknowledge risks associated with digital participation, including regulatory uncertainty, digital asset volatility, technical failures, blockchain network delays, and system downtime. Participation is voluntary and undertaken at the user&apos;s sole risk.</p>
      </Section>
      <Section title="9. User Responsibility">
        <p>Users are solely responsible for compliance with local laws, tax obligations, wallet security, digital asset management, and personal account protection. The Company shall not be liable for user negligence or decisions.</p>
      </Section>
      <Section title="10. Limitation of Liability">
        <p>The Company is not responsible for token value changes, referral structure changes, sector policy adjustments, third-party wallet issues, blockchain failures, or external exchange activity.</p>
      </Section>
      <Section title="11. Service Modification">
        <p>The Company may at any time modify JOY structure, adjust allocation logic, suspend referral programs, change sector settings, or discontinue participation packages without prior notice.</p>
      </Section>
      <Section title="12. Access Restriction">
        <p>The Company may suspend or terminate access if illegal activity is suspected, misuse of the platform occurs, system abuse is detected, or compliance risks arise.</p>
      </Section>
      <Section title="13. Compliance & Legal Responsibility">
        <p>Users must comply with all applicable laws regarding digital assets within their jurisdiction. The Company is not responsible for regulatory violations by users, unlawful participation, or misuse of digital assets.</p>
      </Section>
      <Section title="14. Governing Law">
        <p>This platform is operated by a U.S.-registered entity. All disputes shall be governed by applicable U.S. law and relevant jurisdiction.</p>
      </Section>
      <Section title="15. Legal Acknowledgement">
        <p>By accessing the platform, users confirm that they understand JOY is not an investment, participation is voluntary, no profit expectation exists, all risks are acknowledged, and they accept these Terms fully.</p>
        <p className="mt-2">Access and continued use of the platform constitutes acceptance of this agreement.</p>
      </Section>
    </div>
  );
}

/* ── Risk Disclosure content ── */
function RiskContent() {
  return (
    <div className="space-y-6">
      <p>Participation in the JOYCOIN platform involves digital asset interactions and carries inherent risks. Users acknowledge and accept the following:</p>
      <Section title="1. Regulatory Risk">
        <p>Digital asset regulations may change at any time and may affect platform operation or availability.</p>
      </Section>
      <Section title="2. Volatility Risk">
        <p>Digital participation units and related assets may fluctuate in perceived value or utility.</p>
      </Section>
      <Section title="3. Technical Risk">
        <p>The platform may experience downtime, system errors, smart contract issues, and blockchain network delays.</p>
      </Section>
      <Section title="4. Transfer Risk">
        <p>Digital asset transfers are irreversible. Incorrect wallet addresses may result in permanent loss.</p>
      </Section>
      <Section title="5. Referral & Allocation Changes">
        <p>Referral ratios, allocation models, and sector structures may change at any time.</p>
      </Section>
      <Section title="6. No Guarantee">
        <p>The Company does not guarantee allocation, value retention, liquidity, or continuity of service.</p>
        <p className="mt-3 text-yellow-400 font-semibold">Participation is voluntary and at the user&apos;s sole risk.</p>
      </Section>
    </div>
  );
}

/* ── Token Nature content ── */
function TokenContent() {
  return (
    <div className="space-y-6">
      <p>JOY is a digital participation unit designed for use within the platform ecosystem.</p>
      <div>
        <p className="font-semibold text-white mb-2">JOY does NOT represent:</p>
        <BulletList items={["investment instruments","securities","ownership rights","profit entitlement","equity participation"]} />
      </div>
      <p className="text-yellow-400 font-semibold">JOY functions solely as an internal access and participation mechanism.</p>
      <div>
        <p className="font-semibold text-white mb-2">The platform does not guarantee:</p>
        <BulletList items={["resale value","liquidity","price appreciation"]} />
      </div>
      <p>External trading, if any, is independent of the Company.</p>
      <p className="text-yellow-400 font-semibold">Users acknowledge JOY is not purchased for investment purposes.</p>
    </div>
  );
}

/* ── Privacy Policy content ── */
function PrivacyContent() {
  return (
    <div className="space-y-6">
      <Section title="Data Collection">
        <p>The platform may collect:</p>
        <BulletList items={["email address","IP address","login records","wallet address","transaction logs"]} />
      </Section>
      <Section title="Purpose of Use">
        <p>Data is used for:</p>
        <BulletList items={["account authentication","service allocation","fraud prevention","operational analytics"]} />
      </Section>
      <Section title="Data Storage">
        <p>User data may be stored on secure servers and retained for operational and compliance purposes.</p>
      </Section>
      <Section title="Third-Party Services">
        <p>The platform may use blockchain APIs, analytics tools, and security services. These providers may process limited technical data.</p>
      </Section>
      <Section title="User Responsibility">
        <p>Users must protect their credentials, wallet access, and device security.</p>
      </Section>
      <Section title="Policy Updates">
        <p>This policy may be updated without prior notice. Continued platform use constitutes acceptance.</p>
      </Section>
    </div>
  );
}

/* ── Helpers ── */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-white mb-2">{title}</h3>
      <div className="text-slate-400 text-xs leading-relaxed">{children}</div>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc list-inside space-y-0.5 ml-3 mt-1">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

const TAB_CONTENT: Record<TabKey, React.FC> = {
  terms: TermsContent,
  risk: RiskContent,
  token: TokenContent,
  privacy: PrivacyContent,
};

/* ══════════════════════════════════════════════════
   ENTRY GATE COMPONENT
   ══════════════════════════════════════════════════ */
export default function EntryGate({ children }: { children: React.ReactNode }) {
  const [agreed, setAgreed] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("terms");
  const [scrolledTabs, setScrolledTabs] = useState<Record<TabKey, boolean>>({
    terms: false,
    risk: false,
    token: false,
    privacy: false,
  });
  const [checks, setChecks] = useState({
    notInvestment: false,
    risks: false,
    terms: false,
    privacy: false,
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAgreed(localStorage.getItem("legal_agreed") === "true");
  }, []);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 30;
    if (atBottom && !scrolledTabs[activeTab]) {
      setScrolledTabs((prev) => ({ ...prev, [activeTab]: true }));
    }
  }, [activeTab, scrolledTabs]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [activeTab]);

  const allScrolled = TABS.every((tab) => scrolledTabs[tab.key]);
  const allChecked = checks.notInvestment && checks.risks && checks.terms && checks.privacy;

  const handleEnter = () => {
    localStorage.setItem("legal_agreed", "true");
    setAgreed(true);
  };

  if (agreed === null) {
    return (
      <div className="fixed inset-0 bg-black z-[9999] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (agreed) return <>{children}</>;

  const ContentComponent = TAB_CONTENT[activeTab];

  return (
    <div className="fixed inset-0 bg-black z-[9999] flex items-center justify-center p-2 sm:p-4 overflow-auto">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700/50 rounded-xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[98vh] sm:max-h-[95vh]">
        {/* Header */}
        <div className="p-3 sm:p-6 pb-2 sm:pb-4 border-b border-slate-700/50 flex-shrink-0">
          <h1 className="text-base sm:text-xl font-bold text-white text-center">Legal Acknowledgement Required</h1>
          <p className="text-[10px] sm:text-xs text-slate-400 text-center mt-1 sm:mt-2 leading-relaxed">
            Before accessing the JOYCOIN platform, please review and acknowledge the following:
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-700/50 flex-shrink-0">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 min-w-0 py-2 sm:py-3 text-[9px] sm:text-xs font-medium transition-colors relative px-1 ${
                activeTab === tab.key
                  ? "text-cyan-400 bg-slate-800/50"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {tab.label}
              {scrolledTabs[tab.key] && (
                <span className="absolute top-0.5 right-0.5 text-green-400 text-[8px] sm:text-[10px]">&#10003;</span>
              )}
              {activeTab === tab.key && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400" />
              )}
            </button>
          ))}
        </div>

        {/* Scrollable content */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-3 sm:p-6 min-h-0"
          style={{ maxHeight: "45vh" }}
        >
          <p className="text-[10px] text-cyan-400/60 mb-3 italic">
            This platform provides digital participation services and does not offer financial, investment, or securities products.
          </p>
          <ContentComponent />
          {!scrolledTabs[activeTab] && (
            <p className="text-[10px] text-yellow-400/80 text-center mt-6 animate-pulse">
              &#8595; Scroll to the bottom to continue &#8595;
            </p>
          )}
        </div>

        {/* Checkboxes + Button */}
        <div className="p-3 sm:p-6 pt-2 sm:pt-4 border-t border-slate-700/50 flex-shrink-0 space-y-2 sm:space-y-3">
          {!allScrolled && (
            <p className="text-[10px] text-slate-500 text-center">
              Please scroll through all four documents to enable the checkboxes below.
            </p>
          )}

          <label className={`flex items-start gap-2 text-[11px] sm:text-xs cursor-pointer ${allScrolled ? "text-slate-300" : "text-slate-600 pointer-events-none"}`}>
            <input type="checkbox" checked={checks.notInvestment} onChange={(e) => setChecks((p) => ({ ...p, notInvestment: e.target.checked }))} disabled={!allScrolled} className="mt-0.5 accent-cyan-400 min-w-[16px]" />
            I confirm JOY is not an investment product
          </label>

          <label className={`flex items-start gap-2 text-[11px] sm:text-xs cursor-pointer ${allScrolled ? "text-slate-300" : "text-slate-600 pointer-events-none"}`}>
            <input type="checkbox" checked={checks.risks} onChange={(e) => setChecks((p) => ({ ...p, risks: e.target.checked }))} disabled={!allScrolled} className="mt-0.5 accent-cyan-400 min-w-[16px]" />
            I acknowledge digital asset participation risks
          </label>

          <label className={`flex items-start gap-2 text-[11px] sm:text-xs cursor-pointer ${allScrolled ? "text-slate-300" : "text-slate-600 pointer-events-none"}`}>
            <input type="checkbox" checked={checks.terms} onChange={(e) => setChecks((p) => ({ ...p, terms: e.target.checked }))} disabled={!allScrolled} className="mt-0.5 accent-cyan-400 min-w-[16px]" />
            I agree to the Terms of Use
          </label>

          <label className={`flex items-start gap-2 text-[11px] sm:text-xs cursor-pointer ${allScrolled ? "text-slate-300" : "text-slate-600 pointer-events-none"}`}>
            <input type="checkbox" checked={checks.privacy} onChange={(e) => setChecks((p) => ({ ...p, privacy: e.target.checked }))} disabled={!allScrolled} className="mt-0.5 accent-cyan-400 min-w-[16px]" />
            I accept the Privacy Policy
          </label>

          <button
            onClick={handleEnter}
            disabled={!allChecked}
            className={`w-full py-3 rounded-xl text-sm font-bold tracking-wider transition-all mt-2 ${
              allChecked
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20"
                : "bg-slate-800 text-slate-600 cursor-not-allowed"
            }`}
          >
            ENTER PLATFORM
          </button>
        </div>
      </div>
    </div>
  );
}

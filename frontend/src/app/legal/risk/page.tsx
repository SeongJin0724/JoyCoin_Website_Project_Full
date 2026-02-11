export default function RiskPage() {
  return (
    <div className="min-h-screen pt-28 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-slate-900/80 border border-slate-700/50 rounded-2xl p-8 md:p-12 backdrop-blur-sm">
          <h1 className="text-3xl font-bold text-white mb-1">Risk Disclosure</h1>
          <h2 className="text-lg text-yellow-400 font-semibold mb-2">Digital Asset Risk Notice</h2>
          <p className="text-sm text-cyan-400 font-medium mb-8 border-b border-slate-700/50 pb-6">
            This platform provides digital participation services and does not offer financial, investment, or securities products.
          </p>

          <p className="text-slate-300 text-sm leading-relaxed mb-8">
            Participation in the JOYCOIN platform involves digital asset interactions and carries inherent risks.
            Users acknowledge and accept the following:
          </p>

          <div className="space-y-8 text-slate-300 text-sm leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">1. Regulatory Risk</h2>
              <p>Digital asset regulations may change at any time and may affect platform operation or availability.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">2. Volatility Risk</h2>
              <p>Digital participation units and related assets may fluctuate in perceived value or utility.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">3. Technical Risk</h2>
              <p className="mb-2">The platform may experience:</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-slate-400">
                <li>downtime</li>
                <li>system errors</li>
                <li>smart contract issues</li>
                <li>blockchain network delays</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">4. Transfer Risk</h2>
              <p>Digital asset transfers are irreversible. Incorrect wallet addresses may result in permanent loss.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">5. Referral &amp; Allocation Changes</h2>
              <p>Referral ratios, allocation models, and sector structures may change at any time.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">6. No Guarantee</h2>
              <p className="mb-2">The Company does not guarantee:</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-slate-400">
                <li>allocation</li>
                <li>value retention</li>
                <li>liquidity</li>
                <li>continuity of service</li>
              </ul>
              <p className="mt-4 text-yellow-400 font-semibold">Participation is voluntary and at the user&apos;s sole risk.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

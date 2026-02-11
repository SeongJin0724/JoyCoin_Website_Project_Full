export default function TokenPage() {
  return (
    <div className="min-h-screen pt-28 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-slate-900/80 border border-slate-700/50 rounded-2xl p-8 md:p-12 backdrop-blur-sm">
          <h1 className="text-3xl font-bold text-white mb-2">JOY Token Nature Statement</h1>
          <p className="text-sm text-cyan-400 font-medium mb-8 border-b border-slate-700/50 pb-6">
            This platform provides digital participation services and does not offer financial, investment, or securities products.
          </p>

          <div className="space-y-6 text-slate-300 text-sm leading-relaxed">
            <p>JOY is a digital participation unit designed for use within the platform ecosystem.</p>

            <section>
              <p className="mb-2 font-semibold text-white">JOY does NOT represent:</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-slate-400">
                <li>investment instruments</li>
                <li>securities</li>
                <li>ownership rights</li>
                <li>profit entitlement</li>
                <li>equity participation</li>
              </ul>
            </section>

            <p className="text-yellow-400 font-semibold">JOY functions solely as an internal access and participation mechanism.</p>

            <section>
              <p className="mb-2 font-semibold text-white">The platform does not guarantee:</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-slate-400">
                <li>resale value</li>
                <li>liquidity</li>
                <li>price appreciation</li>
              </ul>
            </section>

            <p>External trading, if any, is independent of the Company.</p>

            <p className="text-yellow-400 font-semibold mt-4">Users acknowledge JOY is not purchased for investment purposes.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

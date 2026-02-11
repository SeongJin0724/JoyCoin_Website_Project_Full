export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-28 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-slate-900/80 border border-slate-700/50 rounded-2xl p-8 md:p-12 backdrop-blur-sm">
          <h1 className="text-3xl font-bold text-white mb-2">Privacy Policy</h1>
          <p className="text-sm text-cyan-400 font-medium mb-8 border-b border-slate-700/50 pb-6">
            This platform provides digital participation services and does not offer financial, investment, or securities products.
          </p>

          <div className="space-y-8 text-slate-300 text-sm leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-white mb-3">Data Collection</h2>
              <p className="mb-2">The platform may collect:</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-slate-400">
                <li>email address</li>
                <li>IP address</li>
                <li>login records</li>
                <li>wallet address</li>
                <li>transaction logs</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">Purpose of Use</h2>
              <p className="mb-2">Data is used for:</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-slate-400">
                <li>account authentication</li>
                <li>service allocation</li>
                <li>fraud prevention</li>
                <li>operational analytics</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">Data Storage</h2>
              <p>User data may be stored on secure servers and retained for operational and compliance purposes.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">Third-Party Services</h2>
              <p className="mb-2">The platform may use:</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-slate-400">
                <li>blockchain APIs</li>
                <li>analytics tools</li>
                <li>security services</li>
              </ul>
              <p className="mt-3">These providers may process limited technical data.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">User Responsibility</h2>
              <p className="mb-2">Users must protect their:</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-slate-400">
                <li>credentials</li>
                <li>wallet access</li>
                <li>device security</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-white mb-3">Policy Updates</h2>
              <p>This policy may be updated without prior notice.</p>
              <p className="mt-2">Continued platform use constitutes acceptance.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

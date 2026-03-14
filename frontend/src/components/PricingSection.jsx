const PLANS = [
  {
    name: 'Lite Spark',
    price: 99,
    description: 'A sweet, single-page surprise for quick celebrations.',
    features: ['Single template', 'Photo gallery', 'Custom message', 'Background music'],
    badge: 'Perfect for birthdays'
  },
  {
    name: 'Signature Story',
    price: 149,
    description: 'Tell a richer story with more photos and sections.',
    features: [
      'All Lite features',
      'Multiple sections',
      'Countdown timer',
      'Custom ending message'
    ],
    badge: 'Most loved'
  },
  {
    name: 'Cinematic Premium',
    price: 199,
    description: 'For big moments like proposals and anniversaries.',
    features: ['All Signature features', 'Password protection', 'Video support', 'Custom animations'],
    badge: 'For unforgettable moments'
  }
];

export function PricingSection() {
  return (
    <section id="pricing" className="section mt-16">
      <div className="mx-auto max-w-3xl text-center">
        <p className="pill mx-auto">Simple, transparent pricing in ₹</p>
        <h2 className="mt-4 text-2xl font-semibold text-slate-50 sm:text-3xl">
          Compare plans at a glance
        </h2>
        <p className="mt-3 text-sm text-slate-400">
          One-time payment. Your personalized website stays live for 12 months, with an option to
          renew.
        </p>
      </div>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-slate-400">
              <th className="py-3 pr-6">Plan</th>
              {PLANS.map((plan) => (
                <th key={plan.name} className="py-3 px-4">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="text-sm font-semibold text-slate-50">{plan.name}</div>
                      <div className="text-xs text-slate-400">₹{plan.price} / surprise</div>
                    </div>
                    {plan.price === 149 && (
                      <span className="rounded-full bg-love-pink px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white shadow-lg shadow-pink-500/60">
                        Recommended
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-slate-800">
              <td className="py-4 pr-6 text-xs font-medium text-slate-300">Description</td>
              {PLANS.map((plan) => (
                <td key={plan.name} className="py-4 px-4 text-xs text-slate-300">
                  {plan.description}
                </td>
              ))}
            </tr>
            <tr className="border-t border-slate-800">
              <td className="py-4 pr-6 text-xs font-medium text-slate-300">Features</td>
              {PLANS.map((plan) => (
                <td key={plan.name} className="py-4 px-4 text-xs text-slate-300">
                  <ul className="space-y-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <span className="mt-1 block h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>
            <tr className="border-t border-slate-800">
              <td className="py-4 pr-6 text-xs font-medium text-slate-300">Highlight</td>
              {PLANS.map((plan) => (
                <td key={plan.name} className="py-4 px-4 text-xs font-medium text-love-pink">
                  {plan.badge}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}


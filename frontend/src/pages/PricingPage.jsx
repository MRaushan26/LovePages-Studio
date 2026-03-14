import { PricingSection } from '../components/PricingSection.jsx';

export function PricingPage() {
  return (
    <main className="section mt-10">
      <div className="mx-auto max-w-3xl text-center">
        <p className="pill mx-auto">Pricing</p>
        <h1 className="mt-3 text-2xl font-semibold text-slate-50 sm:text-3xl">
          Plans that give your surprise some sparkle
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Choose the plan that fits your celebration. All plans include a full shareable page, a custom message, and your own photo gallery.
        </p>
      </div>
      <PricingSection />
    </main>
  );
}

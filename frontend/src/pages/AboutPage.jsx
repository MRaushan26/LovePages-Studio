export function AboutPage() {
  return (
    <section className="section mt-10">
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-3xl font-semibold text-slate-50">About LovePages Studio</h1>
        <p className="text-sm text-slate-300">
          LovePages Studio is a small demo project built to create personalized surprise websites in
          minutes. The goal is to make the process fun, fast, and completely free — no payment
          required.
        </p>
        <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
          <h2 className="text-xl font-semibold text-slate-100">What you can do here</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm text-slate-300">
            <li>Create a surprise website using a template and your own photos, music, and message.</li>
            <li>Preview your surprise page instantly before generating the shareable link.</li>
            <li>Share a unique link (with QR) that anyone can open without logging in.</li>
            <li>Save and reuse your account even when the backend is unavailable.</li>
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
          <h2 className="text-xl font-semibold text-slate-100">How it works</h2>
          <p className="text-sm text-slate-300">
            The app stores generated pages in a small database when backend is running. If the backend
            is not available (for example in a simple static deployment), your link still works because it
            saves a copy locally in your browser.
          </p>
        </div>
      </div>
    </section>
  );
}

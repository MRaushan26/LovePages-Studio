import { Link } from 'react-router-dom';

const CATEGORIES = [
  {
    key: 'birthday',
    title: 'Birthday',
    gradient: 'from-pink-500 via-rose-500 to-orange-400',
    description: 'Countdowns, confetti, and memories from every year together.'
  },
  {
    key: 'proposal',
    title: 'Proposal',
    gradient: 'from-purple-500 via-fuchsia-500 to-pink-500',
    description: 'Build a cinematic moment with music, photos, and a final question.'
  },
  {
    key: 'anniversary',
    title: 'Anniversary',
    gradient: 'from-amber-400 via-rose-400 to-red-500',
    description: 'Re-live your journey as a scrollable love story.'
  },
  {
    key: 'friendship',
    title: 'Friendship',
    gradient: 'from-sky-400 via-emerald-400 to-teal-400',
    description: 'Inside jokes, polaroid-style collages, and shared playlists.'
  }
];

export function LandingPage() {
  return (
    <>
      <section className="section mt-6 grid gap-10 md:grid-cols-[1.4fr,1fr] md:items-center">
        <div className="space-y-6">
          <p className="pill">Create a surprise website in minutes</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl lg:text-5xl">
            Turn your love stories into
            <span className="bg-gradient-to-r from-love-pink via-love-purple to-love-gold bg-clip-text text-transparent">
              {' '}
              living web pages.
            </span>
          </h1>
          <p className="max-w-xl text-sm text-slate-300 sm:text-base">
            LovePages Studio helps you craft personalized surprise websites for birthdays, proposals,
            anniversaries, and friendship memories. No coding, just your photos, words, and music.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/templates" className="btn-primary">
              Start with a template
            </Link>
            <a href="#how-it-works" className="btn-ghost">
              How it works
            </a>
          </div>
          <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>Ready in under 15 minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
              <span>Mobile-friendly surprise website</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-love-gold" />
              <span>Starting at just ₹99</span>
            </div>
          </div>
        </div>
        <div className="card relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-pink-500/10 via-sky-500/5 to-amber-400/10" />
          <div className="relative space-y-4 text-xs text-slate-200">
            <p className="font-medium text-slate-100">Live preview</p>
            <div className="rounded-2xl border border-slate-700/70 bg-slate-900/70 p-4">
              <div className="mb-2 flex items-center gap-2 text-[10px] text-slate-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span>lovepages.site/ananya-birthday</span>
              </div>
              <p className="text-sm font-semibold text-slate-50">Happy 21st, Ananya! 🎂</p>
              <p className="mt-1 text-[11px] text-slate-300">
                365 days of laughter, 21 years of you. Scroll down for a little time capsule we
                built just for today.
              </p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <div className="h-20 rounded-xl bg-gradient-to-tr from-pink-500/60 to-orange-400/60" />
                <div className="h-20 rounded-xl bg-gradient-to-tr from-sky-500/60 to-emerald-400/60" />
                <div className="h-20 rounded-xl bg-gradient-to-tr from-purple-500/60 to-fuchsia-500/60" />
              </div>
            </div>
            <p className="text-[11px] text-slate-400">
              Add photos, a custom message, music, and even a countdown to the big moment — all in a
              guided flow.
            </p>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="section mt-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="pill mx-auto">Designed for real celebrations</p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-50 sm:text-3xl">
            Four categories, endless ways to say "you matter"
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            Pick a category, choose a template, fill in your story, preview everything, and share
            your unique link when it is time.
          </p>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-4">
          {CATEGORIES.map((cat) => (
            <div key={cat.key} className="card flex flex-col gap-3">
              <div
                className={`h-20 rounded-2xl bg-gradient-to-br ${cat.gradient} shadow-lg shadow-black/50`}
              />
              <h3 className="text-sm font-semibold text-slate-50">{cat.title}</h3>
              <p className="text-xs text-slate-400">{cat.description}</p>
              <Link
                to="/templates"
                state={{ category: cat.key }}
                className="mt-auto text-xs font-medium text-love-pink hover:text-love-gold"
              >
                Explore {cat.title} templates →
              </Link>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}


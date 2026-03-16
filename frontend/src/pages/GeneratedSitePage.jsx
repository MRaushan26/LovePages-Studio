import { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useParams } from 'react-router-dom';
import api from '../services/api.js';
import { FloatingHearts } from '../components/FloatingHearts.jsx';

function useCountdown(targetDate) {
  const [diff, setDiff] = useState(() => {
    const now = new Date();
    const target = targetDate ? new Date(targetDate) : now;
    return Math.max(0, target - now);
  });

  useEffect(() => {
    if (!targetDate) return;
    const id = setInterval(() => {
      const now = new Date();
      const target = new Date(targetDate);
      setDiff(Math.max(0, target - now));
    }, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return useMemo(() => {
    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / (24 * 3600));
    const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return { days, hours, minutes, seconds };
  }, [diff]);
}

export function GeneratedSitePage() {
  const { slug } = useParams();
  const location = useLocation();
  const justCreated = location.state?.justCreated;
  const fallbackData = location.state?.siteData;

  const [data, setData] = useState(fallbackData || null);
  const [loading, setLoading] = useState(!fallbackData);
  const [error, setError] = useState('');

  useEffect(() => {
    // If we already have data from navigation state, skip the API call.
    if (data) {
      setLoading(false);
      return;
    }

    const fetchSite = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/websites/${slug}`);
        setData(res.data);
      } catch (e) {
        // Fallback to local storage if backend is unavailable.
        const stored = JSON.parse(localStorage.getItem('lp_sites') || '{}');
        if (stored[slug]) {
          setData(stored[slug]);
        } else {
          setError(e.response?.data?.message || 'Unable to load this surprise page.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchSite();
  }, [data, slug]);

  const countdown = useCountdown(data?.countdownTo);

  if (loading) {
    return (
      <section className="section mt-10 text-center text-slate-300">Loading your surprise…</section>
    );
  }

  if (error || !data) {
    return (
      <section className="section mt-10 text-center text-slate-300">
        {error || 'This page is not available.'}
      </section>
    );
  }

  const template = data.template;
  const customization = data.customization || data;

  const recipientName = customization?.name || 'Your special someone';
  const message = customization?.message || '';

  const getPhotoUrl = (p) => {
    if (!p) return '';
    if (typeof p === 'string') return p;
    return p.url || p.previewUrl || '';
  };

  const photos = (customization?.photos || []).map(getPhotoUrl).filter(Boolean);
  const music = customization?.music || {};
  const themeColor = customization?.themeColor || template?.baseConfig?.themeColor || '#f43f5e';
  const endingMessage = customization?.endingMessage;

  const shareImage = photos[0] || template?.previewImageUrl || '';
  const shareTitle = `A surprise for ${recipientName}`;
  const shareDescription = (message || '').slice(0, 120);
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <Helmet>
        <title>{shareTitle}</title>
        <meta property="og:type" content="website" />
        <meta property="og:title" content={shareTitle} />
        <meta property="og:description" content={shareDescription} />
        <meta property="og:image" content={shareImage} />
        <meta property="og:url" content={shareUrl} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-black via-slate-950 to-black opacity-70" />
      <FloatingHearts />
      <main className="relative z-10">
        <section className="section flex min-h-[60vh] flex-col items-center justify-center py-12 text-center">
          <div className="mb-6 animate-pulse-slow">
            <div
              className="mx-auto flex h-20 w-20 items-center justify-center rounded-full shadow-2xl shadow-black/70"
              style={{
                background: `conic-gradient(from 180deg, ${themeColor}, rgba(15,23,42,1))`
              }}
            >
              <span className="text-3xl">❤</span>
            </div>
          </div>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
            A LovePages Studio surprise
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            For{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: `linear-gradient(90deg, ${themeColor}, #f97316)`
              }}
            >
              {recipientName}
            </span>
          </h1>
          {template?.category && (
            <p className="mt-2 text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
              {template.category} edition
            </p>
          )}

          {data.countdownTo && (
            <div className="mt-6 rounded-2xl border border-slate-700/80 bg-slate-900/80 px-4 py-3 text-xs text-slate-200">
              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">
                Countdown to the moment
              </p>
              <div className="mt-2 flex items-center justify-center gap-3">
                {['days', 'hours', 'minutes', 'seconds'].map((unit) => (
                  <div key={unit} className="flex flex-col items-center gap-1">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-base font-semibold">
                      {countdown[unit]}
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                      {unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {justCreated && (
            <div className="mt-4 flex flex-col items-center gap-2">
              <p className="text-xs text-emerald-400">
                Your link is live! Click below to copy the URL and share it.
              </p>
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(shareUrl);
                    alert('Link copied to clipboard!');
                  } catch {
                    alert('Unable to copy automatically. Please copy the URL manually.');
                  }
                }}
                className="btn-primary rounded-full px-4 py-2 text-xs"
              >
                Copy shareable link
              </button>
            </div>
          )}
        </section>

        <section className="section pb-10">
          <div className="grid gap-8 md:grid-cols-[minmax(0,1.3fr),minmax(0,1fr)]">
            <div className="space-y-4">
              <div className="card">
                <h2 className="text-sm font-semibold text-slate-50">A message from the heart</h2>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-200">
                  {message}
                </p>
              </div>
              {!!photos.length && (
                <div className="card">
                  <h2 className="text-sm font-semibold text-slate-50">Memories gallery</h2>
                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {photos.map((p, idx) => (
                      <img
                        key={idx}
                        src={p}
                        alt=""
                        className="h-28 w-full rounded-xl object-cover"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="card">
                <h2 className="text-sm font-semibold text-slate-50">Background music</h2>
                <p className="mt-1 text-xs text-slate-400">
                  {music?.label || 'Custom track'} · Hit play and then scroll through the story.
                </p>
                {music?.url && (
                  <audio
                    controls
                    autoPlay
                    loop
                    className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-900/80 p-2"
                  >
                    <source src={music.url} type="audio/mpeg" />
                  </audio>
                )}
              </div>

              {endingMessage && (
                <div className="card text-center">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Ending note
                  </p>
                  <p className="mt-2 text-sm text-slate-100">{endingMessage}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}


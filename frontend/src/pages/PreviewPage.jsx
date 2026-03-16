import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import api from '../services/api.js';
import { useToast } from '../components/ToastContext.jsx';

function CountdownPreview() {
  const [secondsLeft] = useState(3600);
  const hours = Math.floor(secondsLeft / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);

  return (
    <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-900/80 px-4 py-1.5 text-xs text-slate-200">
      <span className="h-2 w-2 rounded-full bg-emerald-400" />
      Surprise goes live in{' '}
      <span className="font-semibold text-love-gold">
        {hours}h {minutes}m
      </span>
    </div>
  );
}

export function PreviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const audioRef = useRef(null);
  const state = location.state || {};

  const template = state.template;
  const customization = state.customization;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [demoMode, setDemoMode] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (!template || !customization) {
      setError('Missing preview data. Please start again from the template picker.');
    }
  }, [template, customization]);

  const canGenerate = Boolean(template && customization);

  if (!canGenerate) {
    return (
      <section className="section mt-10 text-center text-slate-300">
        <p className="text-sm">Missing preview information. Please create a surprise again.</p>
        <p className="mt-2 text-sm">
          <Link to="/create" className="font-semibold text-love-pink hover:text-love-purple">
            Start over from templates
          </Link>
          .
        </p>
      </section>
    );
  }

  const toDataUrl = (input) => {
    if (!input) return Promise.resolve('');

    // Keep already-serializable strings
    if (typeof input === 'string') {
      if (input.startsWith('data:')) return Promise.resolve(input);
      if (!input.startsWith('blob:')) return Promise.resolve(input);

      // Convert blob URL to data URL
      return fetch(input)
        .then((res) => res.blob())
        .then(
          (blob) =>
            new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result || '');
              reader.readAsDataURL(blob);
            })
        )
        .catch(() => input);
    }

    // Handle File objects
    if (input instanceof File || input instanceof Blob) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result || '');
        reader.readAsDataURL(input);
      });
    }

    // Handle objects with url / previewUrl
    if (typeof input === 'object') {
      const url = input.url || input.previewUrl;
      return toDataUrl(url);
    }

    return Promise.resolve('');
  };

  const normalizePhotosAsync = async (photos) => {
    if (!Array.isArray(photos)) return [];
    const results = await Promise.all(photos.map((p) => toDataUrl(p)));
    return results.filter(Boolean);
  };

  const createLocalSite = async () => {
    const baseName = `${customization.name || 'surprise'}`
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .slice(0, 40);
    const baseEvent = (template?.category || 'surprise').toLowerCase();
    const random = Math.random().toString(36).slice(2, 6);
    const slug = `${baseName}-${baseEvent}-${random}`;

    const stored = JSON.parse(localStorage.getItem('lp_sites') || '{}');
    stored[slug] = {
      template,
      customization: {
        ...customization,
        photos: await normalizePhotosAsync(customization.photos)
      },
      createdAt: Date.now()
    };
    localStorage.setItem('lp_sites', JSON.stringify(stored));

    return slug;
  };

  const handleGenerateLink = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.post('/websites', {
        templateId: template._id || template.slug,
        recipientName: customization.name,
        message: customization.message,
        themeColor: customization.themeColor,
        music: customization.music,
        photos: customization.photos
      });
      const { slug } = res.data;
      navigate(`/site/${slug}`, {
        replace: true,
        state: {
          justCreated: true,
          siteData: {
            template,
            customization,
            slug
          }
        }
      });
    } catch (e) {
      console.warn('Create website API failed, falling back to local storage.', e);
      setDemoMode(true);
      const slug = await createLocalSite();
      setError('No backend available; using local demo storage.');
      toast.addToast('Offline demo mode: your surprise is stored locally.', 'info');
      navigate(`/site/${slug}`, {
        replace: true,
        state: {
          justCreated: true,
          siteData: {
            template,
            customization,
            slug
          }
        }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section mt-8">
      <p className="pill">Step 3 · Preview your page</p>
      <h1 className="mt-3 text-2xl font-semibold text-slate-50 sm:text-3xl">
        This is how your surprise website will feel
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-slate-400">
        We have added a watermark to this preview. Generate your shareable link below and it will
        be instantly available at a unique URL like{' '}
        <span className="font-mono">lovepages.site/ananya-birthday</span>.
      </p>

      {demoMode && (
        <div className="mt-6 rounded-2xl border border-love-pink/40 bg-slate-900/60 px-4 py-3 text-sm text-love-pink">
          You’re in <span className="font-semibold">offline demo mode</span>. Your creation is stored locally on this
          device and won’t be accessible from other browsers.
        </div>
      )}

      <div className="card mt-6 overflow-hidden">
        <div
          className="relative grid gap-6 rounded-3xl border border-slate-700/80 bg-slate-900/80 p-6 md:grid-cols-[1.4fr,1fr]"
          style={{
            borderColor: customization.themeColor
          }}
        >
          <div>
            <div className="flex items-center justify-between gap-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-[10px]">
                  ❤
                </span>
                <div>
                  <p className="font-semibold">
                    {customization.name || 'Your special someone'} ·{' '}
                    <span className="text-love-pink">
                      {template?.category || 'Custom surprise'}
                    </span>
                  </p>
                  <p className="text-[11px] text-slate-400">
                    A LovePages Studio experience · Preview version
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <h2 className="text-xl font-semibold text-slate-50">
                For {customization.name || 'you'}, with all my heart.
              </h2>
              <p className="text-sm leading-relaxed text-slate-200 whitespace-pre-line">
                {customization.message}
              </p>
              <CountdownPreview />
            </div>

            {!!customization.photos?.length && (
              <div className="mt-5 grid grid-cols-3 gap-2">
                {customization.photos.slice(0, 6).map((src, idx) => (
                  <div
                    key={idx}
                    className="relative h-24 overflow-hidden rounded-xl border border-slate-700/70"
                  >
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="relative space-y-4 text-xs text-slate-300">
            <div className="rounded-2xl border border-dashed border-love-pink/70 bg-slate-950/70 p-4 text-center uppercase tracking-[0.2em] text-love-pink/80">
              Preview Version · Watermarked
            </div>
            <p>
              Background music:{' '}
              <span className="font-medium text-slate-100">
                {customization.music?.label || 'No music selected'}
              </span>
            </p>
            {customization.music?.url ? (
              <audio
                ref={audioRef}
                controls
                className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900/80 p-2"
              >
                <source src={customization.music.url} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            ) : (
              <p className="text-xs text-slate-400">No music file selected yet.</p>
            )}
            <p className="mt-3 text-[11px] text-slate-400">
              On the final website, we will remove the watermark, optimize your photos for fast
              loading, and host the page on a unique URL you can share.
            </p>
            {error && <p className="text-xs text-red-400">{error}</p>}
            <button
              type="button"
              disabled={loading}
              onClick={handleGenerateLink}
              className="btn-primary mt-2 w-full justify-center disabled:opacity-60"
            >
              {loading ? 'Generating link…' : 'Looks good · Generate shareable link'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}


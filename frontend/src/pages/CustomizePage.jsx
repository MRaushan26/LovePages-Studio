import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import api from '../services/api.js';

const MUSIC_OPTIONS = [
  { id: 'soft-piano', label: 'Soft piano', url: '/music/soft-piano.mp3' },
  { id: 'warm-lofi', label: 'Warm lo-fi', url: '/music/warm-lofi.mp3' },
  { id: 'grand-moment', label: 'Grand proposal track', url: '/music/grand-moment.mp3' }
];

const THEME_COLORS = [
  { id: 'rose', label: 'Rose', value: '#f43f5e' },
  { id: 'violet', label: 'Violet', value: '#8b5cf6' },
  { id: 'amber', label: 'Amber', value: '#f59e0b' },
  { id: 'emerald', label: 'Emerald', value: '#10b981' }
];

export function CustomizePage() {
  const { templateId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const template = location.state?.template;

  const [form, setForm] = useState({
    name: '',
    message: '',
    music: MUSIC_OPTIONS[0],
    themeColor: THEME_COLORS[0].value,
    photos: []
  });

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [musicUploading, setMusicUploading] = useState(false);
  const [musicError, setMusicError] = useState('');

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const previews = files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file)
    }));
    setForm((prev) => ({ ...prev, photos: previews }));

    const upload = async () => {
      try {
        setUploading(true);
        setUploadError('');
        const formData = new FormData();
        files.forEach((file) => {
          formData.append('photos', file);
        });
        const res = await api.post('/uploads/photos', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        const urls = res.data?.urls || [];
        setForm((prev) => ({
          ...prev,
          photos: previews.map((p, idx) => ({
            ...p,
            url: urls[idx] || p.previewUrl
          }))
        }));
      } catch (err) {
        setUploadError(
          err.response?.data?.message ||
            'Unable to upload photos right now. Preview will still work locally.'
        );
      } finally {
        setUploading(false);
      }
    };

    void upload();
  };

  const handleMusicUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMusicUploading(true);
    setMusicError('');

    try {
      const formData = new FormData();
      formData.append('music', file);
      const res = await api.post('/uploads/music', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const url = res.data?.url;
      if (url) {
        setForm((prev) => ({...prev, music: { label: file.name, url }}));
      }
    } catch (err) {
      setMusicError(err.response?.data?.message || 'Unable to upload music.');
    } finally {
      setMusicUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/preview', {
      state: {
        templateId,
        template,
        customization: {
          name: form.name,
          message: form.message,
          themeColor: form.themeColor,
          music: form.music,
          // Prefer uploaded Cloudinary URLs, fall back to local previews for development
          photos: form.photos.map((p) => p.url || p.previewUrl)
        }
      }
    });
  };

  return (
    <section className="section mt-8">
      <p className="pill">Step 2 · Personalize your page</p>
      <h1 className="mt-3 text-2xl font-semibold text-slate-50 sm:text-3xl">
        Tell us about the person you are surprising
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-slate-400">
        We will use this information to generate a preview of your surprise website. You can tweak
        things on the next step before payment.
      </p>

      <form
        onSubmit={handleSubmit}
        className="card mt-6 grid gap-6 md:grid-cols-[minmax(0,1.3fr),minmax(0,1fr)]"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300">Name on the page</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Ananya, Rahul, Mom, Bestie..."
              className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-50 outline-none ring-love-pink/40 focus:ring-2"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300">
              Your custom message / story
            </label>
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              placeholder="Write a heartfelt note, story, or the words you want to say on their special day…"
              className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-50 outline-none ring-love-pink/40 focus:ring-2"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300">
              Upload photos (we will create a gallery)
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block w-full text-xs text-slate-300 file:mr-3 file:rounded-full file:border-0 file:bg-love-pink/90 file:px-4 file:py-1.5 file:text-xs file:font-medium file:text-white hover:file:bg-love-pink"
            />
            {uploading && (
              <p className="mt-2 text-[11px] text-slate-400">Uploading photos to Cloudinary…</p>
            )}
            {uploadError && <p className="mt-2 text-[11px] text-red-400">{uploadError}</p>}
            {!!form.photos.length && (
              <div className="mt-3 grid grid-cols-4 gap-2">
                {form.photos.map((p, idx) => (
                  <img
                    key={idx}
                    src={p.previewUrl}
                    alt=""
                    className="h-16 w-full rounded-lg object-cover"
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-slate-300">Background music</label>
            <div className="mt-2 space-y-3">
              {MUSIC_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setForm((f) => ({ ...f, music: opt }))}
                  className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-xs ${
                    form.music.id === opt.id
                      ? 'border-love-pink bg-love-pink/10 text-slate-50'
                      : 'border-slate-700 bg-slate-900/70 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  <span>{opt.label}</span>
                  {form.music.id === opt.id && (
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  )}
                </button>
              ))}

              <div className="rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-300">Upload your own audio</span>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleMusicUpload}
                    className="text-[11px] text-slate-300"
                  />
                </div>
                {musicUploading && (
                  <p className="mt-2 text-[11px] text-slate-400">Uploading…</p>
                )}
                {musicError && <p className="mt-2 text-[11px] text-red-400">{musicError}</p>}
                {form.music?.url && (
                  <p className="mt-2 text-[11px] text-slate-400">
                    Selected: <span className="font-medium text-slate-100">{form.music.label}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300">Theme color</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {THEME_COLORS.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setForm((f) => ({ ...f, themeColor: c.value }))}
                  className={`flex h-9 items-center gap-2 rounded-full border px-3 text-xs ${
                    form.themeColor === c.value
                      ? 'border-love-pink bg-slate-900/80'
                      : 'border-slate-700 bg-slate-900/60'
                  }`}
                >
                  <span
                    className="inline-block h-4 w-4 rounded-full"
                    style={{ backgroundColor: c.value }}
                  />
                  <span>{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 text-xs text-slate-400">
            You will be able to preview everything with a watermark before paying. We will securely
            upload your photos when you complete the payment.
          </div>

          <button type="submit" className="btn-primary w-full justify-center">
            Continue to preview
          </button>
        </div>
      </form>
    </section>
  );
}


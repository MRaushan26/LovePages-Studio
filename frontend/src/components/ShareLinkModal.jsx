import { useEffect } from 'react';

export function ShareLinkModal({ open, onClose, url }) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const encoded = encodeURIComponent(url);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encoded}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-100">Share your surprise</p>
            <p className="mt-1 text-xs text-slate-400">Copy the link or scan the QR code.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-200 hover:bg-slate-700"
          >
            Close
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div className="rounded-xl border border-slate-700 bg-slate-950/40 p-4">
            <p className="text-xs text-slate-400">Shareable link</p>
            <div className="mt-2 flex items-center gap-2">
              <input
                readOnly
                value={url}
                className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-200"
              />
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(url);
                    alert('Copied!');
                  } catch {
                    alert('Copy failed. Please select the link manually.');
                  }
                }}
                className="rounded-xl bg-love-pink px-3 py-2 text-xs font-semibold text-white hover:bg-love-purple"
              >
                Copy
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-slate-700 bg-slate-950/40 p-4 text-center">
            <p className="text-xs text-slate-400">Scan to open</p>
            <img src={qrUrl} alt="QR code" className="mx-auto mt-3 h-40 w-40" />
          </div>
        </div>
      </div>
    </div>
  );
}

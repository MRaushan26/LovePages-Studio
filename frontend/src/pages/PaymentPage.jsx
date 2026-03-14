import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import api from '../services/api.js';

export function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const state = location.state;

  if (!state) {
    navigate('/templates');
    return null;
  }

  const { template, customization } = state;

  const simulatedAmount = template?.priceTier || template?.price || 149;
  const expiryText = simulatedAmount === 99 ? '30 days' : simulatedAmount === 149 ? '6 months' : '1 year';

  const handleSimulatePayment = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.post('/websites', {
        templateId: template?._id || template?.slug,
        recipientName: customization.name,
        message: customization.message,
        themeColor: customization.themeColor,
        music: customization.music,
        photos: customization.photos,
        amount: simulatedAmount
      });
      const { slug } = res.data;
      navigate(`/site/${slug}`, { replace: true, state: { justCreated: true } });
    } catch (e) {
      setError(e.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section mt-8">
      <p className="pill">Step 4 · Simulated Razorpay payment</p>
      <h1 className="mt-3 text-2xl font-semibold text-slate-50 sm:text-3xl">
        Complete payment to unlock your shareable link
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-slate-400">
        This screen simulates a Razorpay checkout experience. In a production deployment, you would
        plug in real Razorpay keys and webhooks. For now, clicking “Pay ₹{simulatedAmount}” will
        confirm the payment and generate your unique URL, which stays active for {expiryText}.
      </p>

      <div className="card mt-6 max-w-xl">
        <div className="flex items-center justify-between text-sm">
          <div>
            <p className="font-semibold text-slate-100">LovePages Studio</p>
            <p className="text-xs text-slate-400">
              {template?.name || 'Signature Story'} ·{' '}
              <span className="text-love-pink">Simulated</span> payment
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400">Amount</p>
            <p className="text-lg font-semibold text-love-gold">₹{simulatedAmount}</p>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-slate-700 bg-slate-900/60 p-4 text-xs text-slate-300">
          <p className="font-medium text-slate-100">Payment method (simulated)</p>
          <ul className="mt-2 space-y-1 text-slate-400">
            <li>• UPI / Wallets</li>
            <li>• Credit / Debit card</li>
            <li>• Netbanking</li>
          </ul>
          <p className="mt-3 text-[11px] text-slate-500">
            This is a sandbox flow for development and demos. No real money is charged.
          </p>
        </div>

        {error && <p className="mt-3 text-xs text-red-400">{error}</p>}

        <button
          type="button"
          disabled={loading}
          onClick={handleSimulatePayment}
          className="btn-primary mt-4 w-full justify-center disabled:opacity-60"
        >
          {loading ? 'Processing…' : `Pay ₹${simulatedAmount} · Generate link`}
        </button>
      </div>
    </section>
  );
}


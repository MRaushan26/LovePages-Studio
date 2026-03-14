import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    website: { type: mongoose.Schema.Types.ObjectId, ref: 'GeneratedWebsite' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'paid', 'failed'], default: 'paid' },
    paymentProvider: { type: String, default: 'simulated-razorpay' },
    paymentReference: { type: String }
  },
  { timestamps: true }
);

export const Order = mongoose.model('Order', orderSchema);


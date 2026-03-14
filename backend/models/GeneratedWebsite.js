import mongoose from 'mongoose';

const generatedWebsiteSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    recipientName: { type: String, required: true },
    message: { type: String, required: true },
    photos: [{ type: String }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    music: {
      label: String,
      url: String
    },
    themeColor: { type: String, default: '#f43f5e' },
    template: { type: mongoose.Schema.Types.ObjectId, ref: 'Template' },
    countdownTo: { type: Date },
    endingMessage: { type: String },
    premium: {
      passwordProtected: { type: Boolean, default: false },
      passwordHash: { type: String },
      supportsVideo: { type: Boolean, default: false },
      customAnimations: { type: Boolean, default: false },
      videoUrl: { type: String }
    },
    priceTier: { type: Number, enum: [99, 149, 199], default: 149 },
    expiryDate: { type: Date },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const GeneratedWebsite = mongoose.model('GeneratedWebsite', generatedWebsiteSchema);


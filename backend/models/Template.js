import mongoose from 'mongoose';

const templateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: {
      type: String,
      enum: ['Birthday', 'Proposal', 'Anniversary', 'Friendship', 'Custom'],
      default: 'Custom'
    },
    description: { type: String },
    previewImageUrl: { type: String },
    baseConfig: {
      themeColor: { type: String, default: '#f43f5e' },
      supportsVideo: { type: Boolean, default: false },
      supportsPassword: { type: Boolean, default: false },
      supportsCustomAnimations: { type: Boolean, default: false },
      sections: [{ type: String }]
    },
    features: [{ type: String }],
    priceTier: { type: Number, enum: [99, 149, 199], default: 149 }
  },
  { timestamps: true }
);

export const Template = mongoose.model('Template', templateSchema);


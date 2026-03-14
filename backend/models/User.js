import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    email: { type: String, unique: true, sparse: true },
    passwordHash: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    googleId: { type: String },
    banned: { type: Boolean, default: false },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);


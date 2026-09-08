const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true, index: true },
  fullName: { type: String, trim: true },
  email: { type: String, trim: true, lowercase: true },
  mobile: { type: String, trim: true, index: true },
  photoUrl: { type: String },
  provider: { type: String, enum: ['password', 'google', 'phone'], default: 'password' },
  agreeToTerms: { type: Boolean, default: false },
  emailUpdates: { type: Boolean, default: false },
  whatsappUpdates: { type: Boolean, default: false },
  lastLoginAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

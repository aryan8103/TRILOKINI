const User = require('../models/User');
const { getFirebaseAdmin } = require('../config/firebaseAdmin');

function publicUser(user) {
  return {
    id: user._id,
    firebaseUid: user.firebaseUid,
    fullName: user.fullName,
    email: user.email,
    mobile: user.mobile,
    photoUrl: user.photoUrl,
    provider: user.provider,
    emailUpdates: user.emailUpdates,
    whatsappUpdates: user.whatsappUpdates,
  };
}

const sync = async (req, res) => {
  try {
    const decoded = req.firebaseUser;
    const {
      fullName,
      mobile,
      agreeToTerms,
      emailUpdates,
      whatsappUpdates,
    } = req.body || {};

    const provider = decoded.firebase?.sign_in_provider === 'google.com'
      ? 'google'
      : decoded.phone_number
        ? 'phone'
        : 'password';

    const payload = {
      firebaseUid: decoded.uid,
      email: decoded.email || undefined,
      mobile: mobile || decoded.phone_number || undefined,
      fullName: fullName || decoded.name || undefined,
      photoUrl: decoded.picture || undefined,
      provider,
      lastLoginAt: new Date(),
    };

    if (typeof agreeToTerms === 'boolean') payload.agreeToTerms = agreeToTerms;
    if (typeof emailUpdates === 'boolean') payload.emailUpdates = emailUpdates;
    if (typeof whatsappUpdates === 'boolean') payload.whatsappUpdates = whatsappUpdates;

    const user = await User.findOneAndUpdate(
      { firebaseUid: decoded.uid },
      { $set: payload },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.json(publicUser(user));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const me = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.firebaseUser.uid });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(publicUser(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { fullName, email, mobile } = req.body || {};
    const user = await User.findOneAndUpdate(
      { firebaseUid: req.firebaseUser.uid },
      { $set: { fullName, email, mobile } },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(publicUser(user));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const listUsers = async (_req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users.map(publicUser));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { sync, me, updateProfile, listUsers, getFirebaseAdmin };

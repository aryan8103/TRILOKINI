const { getFirebaseAdmin } = require('../config/firebaseAdmin');
const { getAuth } = require('firebase-admin/auth');

async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const admin = getFirebaseAdmin();
    const app = admin.getApp();
    const decoded = await getAuth(app).verifyIdToken(token);
    req.firebaseUser = decoded;
    next();
  } catch (error) {
    console.error("Firebase auth error:", error);
    res.status(401).json({ message: error.message || 'Invalid or expired session' });
  }
}

module.exports = { requireAuth };

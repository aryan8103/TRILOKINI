const { getFirebaseAdmin } = require('../config/firebaseAdmin');

async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const admin = getFirebaseAdmin();
    const decoded = await admin.auth().verifyIdToken(token);
    req.firebaseUser = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired session' });
  }
}

module.exports = { requireAuth };

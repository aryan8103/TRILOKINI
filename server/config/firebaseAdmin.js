const admin = require('firebase-admin');

let initialized = false;

function getFirebaseAdmin() {
  if (initialized) return admin;

  const { getApps, initializeApp, cert, applicationDefault } = admin;

  const apps = getApps();
  if (apps && apps.length) {
    initialized = true;
    return admin;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (projectId && clientEmail && privateKey) {
    initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
    });
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    initializeApp({
      credential: applicationDefault(),
    });
  } else {
    throw new Error('Firebase Admin is not configured. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.');
  }

  initialized = true;
  return admin;
}

module.exports = { getFirebaseAdmin };

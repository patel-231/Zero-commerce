import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Try to load the local config file, but fallback to process.env for Vercel deployments
let config: any = {};
try {
  config = require("../../../firebase-applet-config.json");
} catch (e) {
  // Ignored in production, will use env vars
}

const firebaseConfig = {
  apiKey: config.apiKey || process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: config.authDomain || process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: config.projectId || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: config.storageBucket || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: config.messagingSenderId || process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: config.appId || process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app, config.firestoreDatabaseId || "(default)");
const storage = getStorage(app);

export { app, auth, db, storage };

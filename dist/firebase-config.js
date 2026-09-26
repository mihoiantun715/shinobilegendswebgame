// Firebase configuration - uses environment variables in production
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getAuth, GoogleAuthProvider } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js';

const firebaseConfig = {
  apiKey: "AIzaSyAiWy4M5VhaR2Zh6SKZaXYruOySw0p26pA",
  authDomain: "shinobilegendswebgame.firebaseapp.com",
  projectId: "shinobilegendswebgame",
  storageBucket: "shinobilegendswebgame.firebasestorage.app",
  messagingSenderId: "86964290591",
  appId: "1:86964290591:web:1377f4b8839b9ba58f412a",
  measurementId: "G-070456R9VR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, analytics, googleProvider };

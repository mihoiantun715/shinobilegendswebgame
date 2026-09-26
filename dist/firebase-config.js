// Firebase configuration - initialized after scripts load
const firebaseConfig = {
  apiKey: "AIzaSyAiWy4M5VhaR2Zh6SKZaXYruOySw0p26pA",
  authDomain: "shinobilegendswebgame.firebaseapp.com",
  projectId: "shinobilegendswebgame",
  storageBucket: "shinobilegendswebgame.firebasestorage.app",
  messagingSenderId: "86964290591",
  appId: "1:86964290591:web:1377f4b8839b9ba58f412a",
  measurementId: "G-070456R9VR"
};

// Wait for Firebase SDK to load, then initialize
window.initializeFirebase = function() {
  if (!firebase) {
    console.error('Firebase SDK not loaded');
    return;
  }
  
  // Initialize Firebase
  const app = firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.firestore();
  const googleProvider = new firebase.auth.GoogleAuthProvider();
  
  // Make available globally
  window.firebaseApp = app;
  window.firebaseAuth = auth;
  window.firebaseDb = db;
  window.googleProvider = googleProvider;
  
  console.log('Firebase initialized successfully');
};

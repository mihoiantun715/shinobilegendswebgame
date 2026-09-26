# Firebase Setup Instructions

## Firestore Security Rules

Go to Firebase Console → Firestore Database → Rules and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Players collection - users can only read/write their own data
    match /players/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Game data collection - users can only read/write their own data
    match /gameData/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Public leaderboard (read-only for all authenticated users)
    match /leaderboard/{entry} {
      allow read: if request.auth != null;
      allow write: if false; // Only server can write
    }
  }
}
```

## Firestore Indexes

No custom indexes needed for current implementation.

## Authentication Providers

Already enabled in your Firebase project:
- ✅ Email/Password
- ✅ Google Sign-In

## Authorized Domains

Add your Vercel domain to Firebase Console → Authentication → Settings → Authorized domains:
- `shinobilegendswebgame.vercel.app`
- Or your custom domain

## Environment Variables for Vercel

Add these in Vercel Dashboard → Project Settings → Environment Variables:

```
VITE_FIREBASE_API_KEY=AIzaSyAiWy4M5VhaR2Zh6SKZaXYruOySw0p26pA
VITE_FIREBASE_AUTH_DOMAIN=shinobilegendswebgame.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=shinobilegendswebgame
VITE_FIREBASE_STORAGE_BUCKET=shinobilegendswebgame.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=86964290591
VITE_FIREBASE_APP_ID=1:86964290591:web:1377f4b8839b9ba58f412a
VITE_FIREBASE_MEASUREMENT_ID=G-070456R9VR
```

**Note:** These are already hardcoded in `firebase-config.js` for simplicity. Environment variables are optional but recommended for production.

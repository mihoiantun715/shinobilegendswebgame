# Shinobi Legends - Deployment Guide

## 🚀 Deploy to Vercel + Firebase

### Prerequisites
- GitHub account
- Vercel account (free tier)
- Firebase project (already set up)

---

## Step 1: Push to GitHub

1. **Initialize Git** (if not already done):
```bash
git init
git add .
git commit -m "Initial commit - Shinobi Legends with Firebase"
```

2. **Add your GitHub repository**:
```bash
git remote add origin https://github.com/mihoiantun715/shinobilegendswebgame.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy to Vercel

### Option A: Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your GitHub repository: `mihoiantun715/shinobilegendswebgame`
4. Configure project:
   - **Framework Preset**: Other
   - **Root Directory**: `./`
   - **Build Command**: Leave empty (no build needed)
   - **Output Directory**: `dist`

5. **Add Environment Variables** (click "Environment Variables"):
   ```
   VITE_FIREBASE_API_KEY = AIzaSyAiWy4M5VhaR2Zh6SKZaXYruOySw0p26pA
   VITE_FIREBASE_AUTH_DOMAIN = shinobilegendswebgame.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID = shinobilegendswebgame
   VITE_FIREBASE_STORAGE_BUCKET = shinobilegendswebgame.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID = 86964290591
   VITE_FIREBASE_APP_ID = 1:86964290591:web:1377f4b8839b9ba58f412a
   VITE_FIREBASE_MEASUREMENT_ID = G-070456R9VR
   ```

6. Click **"Deploy"**

### Option B: Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

---

## Step 3: Configure Firebase

### Update Firebase Authentication Settings

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: **shinobilegendswebgame**
3. Go to **Authentication** → **Settings** → **Authorized domains**
4. Add your Vercel domain:
   - `shinobilegendswebgame.vercel.app` (or your custom domain)

### Set up Firestore Database

1. Go to **Firestore Database** in Firebase Console
2. Click **"Create database"**
3. Choose **"Start in production mode"** (we'll add rules next)
4. Select a location (choose closest to your users)

### Add Firestore Security Rules

Go to **Firestore Database** → **Rules** and paste:

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

Click **"Publish"**

---

## Step 4: Test Your Deployment

1. Visit your Vercel URL: `https://shinobilegendswebgame.vercel.app`
2. Register a new account with email/password
3. Or sign in with Google
4. Your progress will now save to Firebase!

---

## 🔄 Continuous Deployment

Every time you push to GitHub, Vercel will automatically redeploy:

```bash
git add .
git commit -m "Update game features"
git push
```

---

## 🎮 Features Now Available

✅ **Real Authentication** - Email/password + Google Sign-In  
✅ **Cloud Saves** - Progress synced to Firebase  
✅ **Auto-save** - Game saves every 30 seconds  
✅ **Cross-device** - Play on any device with same account  
✅ **Secure** - Firestore security rules protect player data  

---

## 🔧 Troubleshooting

### Firebase Connection Issues
- Check Firebase API keys in Vercel environment variables
- Verify authorized domains in Firebase Console
- Check browser console for error messages

### Authentication Not Working
- Ensure Email/Password provider is enabled in Firebase
- Verify Google Sign-In is configured with correct OAuth client

### Data Not Saving
- Check Firestore security rules
- Verify user is authenticated before saving
- Check browser console for Firestore errors

---

## 📊 Monitor Your Game

### Vercel Analytics
- Go to your Vercel project → Analytics
- View page views, performance, and user data

### Firebase Analytics
- Go to Firebase Console → Analytics
- Track user engagement, retention, and events

---

## 🎯 Next Steps

1. **Custom Domain**: Add your own domain in Vercel settings
2. **Email Verification**: Enable in Firebase Authentication settings
3. **Password Reset**: Already supported by Firebase Auth
4. **Multiplayer Features**: Extend Firestore for real-time PvP
5. **Leaderboards**: Create global rankings with Cloud Functions

---

## 💰 Cost Estimate

### Free Tier Limits:
- **Vercel**: Unlimited bandwidth, 100GB/month
- **Firebase Auth**: Unlimited
- **Firestore**: 50K reads, 20K writes, 20K deletes per day
- **Firebase Storage**: 1GB storage, 10GB/month transfer

Your game should stay **completely free** until you reach thousands of daily active users!

---

## 🆘 Support

- Vercel Docs: https://vercel.com/docs
- Firebase Docs: https://firebase.google.com/docs
- GitHub Issues: https://github.com/mihoiantun715/shinobilegendswebgame/issues

# Shinobi Legends — Browser RPG

**Version:** 26.09.2026 - Firebase + Vercel Production Ready  
**Live Demo:** [Deploy to Vercel](https://vercel.com/new/clone?repository-url=https://github.com/mihoiantun715/shinobilegendswebgame)

A browser-based ninja RPG with real authentication, cloud saves, and cross-device progression powered by Firebase and Vercel.

## 🚀 Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/mihoiantun715/shinobilegendswebgame)

**See [DEPLOYMENT.md](DEPLOYMENT.md) for complete deployment instructions.**

---

## 🎮 Features

✅ **Real Authentication** - Email/password + Google Sign-In via Firebase  
✅ **Cloud Saves** - Progress synced to Firestore  
✅ **Auto-save** - Game saves every 30 seconds  
✅ **Cross-device Play** - Same account on any device  
✅ **90 Missions** - 6 grades (E/D/C/B/A/S)  
✅ **90 Jutsus** - Master techniques for combat bonuses  
✅ **Interactive Duties** - Real-time missions with choices  
✅ **Team System** - Recruit companions for stat bonuses  
✅ **Story Chapters** - Multi-mission narrative arcs  

---

## 💻 Local Development

### Windows
```bash
START-WINDOWS.bat
```
Opens http://127.0.0.1:8000

### Linux/macOS
```bash
python3 run_game.py
```

### Custom Port
```bash
python run_game.py 8001
```

**Note:** Use HTTP server for proper Firebase functionality. Direct file opening won't work with modules.

## 📁 Project Structure

```
dist/
├── index.html              # Entry point
├── firebase-config.js      # Firebase initialization
├── firebase-service.js     # Authentication service
├── firestore-service.js    # Cloud save service
├── game.js                 # Core game engine
├── catalog.js              # 90 missions + 90 jutsus
├── systems.js              # Inventory, team, story, etc.
├── duties.js               # Interactive timed missions
├── auth.js                 # Auth UI logic
├── classic.css             # Blue/parchment theme
└── assets/                 # Logo, backgrounds, icon atlases

vercel.json                 # Vercel deployment config
DEPLOYMENT.md               # Complete deployment guide
```

## 🔐 Authentication & Data

### Firebase Integration
- **Email/Password** authentication
- **Google Sign-In** with popup
- **Firestore** for cloud saves
- **Auto-save** every 30 seconds
- **Local migration** - Existing localStorage saves can be migrated to cloud

### Guest Mode
Guest mode still available for quick testing (progress saved locally only).

### Data Storage
- **Cloud:** Firestore collections `players/` and `gameData/`
- **Local:** localStorage fallback for guest mode
- **Security:** Firestore rules protect user data

## 🧪 Development Checks

Run validation scripts:
```bash
node checks/catalog.cjs
node checks/systems.cjs
node checks/auth.cjs
```

## 🛠️ Tech Stack

- **Frontend:** Vanilla JavaScript (ES6 modules)
- **Styling:** Custom CSS (no frameworks)
- **Backend:** Firebase (Auth + Firestore)
- **Hosting:** Vercel (static site)
- **No build step** - Direct deployment

## 📊 Free Tier Limits

- **Vercel:** Unlimited bandwidth
- **Firebase Auth:** Unlimited users
- **Firestore:** 50K reads, 20K writes/day
- **Firebase Storage:** 1GB storage

Your game stays **free** until thousands of daily active users!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally with Firebase
5. Submit a pull request

## 📝 License

This project is open source. See repository for details.

## 🆘 Support

- **Deployment Issues:** See [DEPLOYMENT.md](DEPLOYMENT.md)
- **Firebase Setup:** Check Firebase Console
- **Bug Reports:** Open a GitHub issue

---

**Made with ⚔️ by the Shinobi Legends team**

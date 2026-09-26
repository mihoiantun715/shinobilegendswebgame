// Firebase Authentication Service - replaces demo auth
// Uses Firebase compat SDK loaded via CDN

// Real Firebase authentication service
window.ShinobiAuthService = {
  mode: 'firebase',
  
  async login({identifier, password}) {
    try {
      // Firebase requires email for login
      const email = identifier.includes('@') ? identifier : null;
      if (!email) {
        throw new Error('Please use your email address to sign in.');
      }
      
      const userCredential = await window.firebaseAuth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;
      
      // Get user profile from Firestore
      const userDoc = await window.firebaseDb.collection('players').doc(user.uid).get();
      const displayName = userDoc.exists ? userDoc.data().displayName : user.displayName || user.email.split('@')[0];
      
      // Update last login
      await window.firebaseDb.collection('players').doc(user.uid).update({
        lastLogin: firebase.firestore.FieldValue.serverTimestamp()
      });
      
      return { displayName, uid: user.uid };
    } catch (error) {
      console.error('Login error:', error);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        throw new Error('Invalid email or password.');
      } else if (error.code === 'auth/too-many-requests') {
        throw new Error('Too many failed attempts. Please try again later.');
      }
      throw new Error(error.message || 'Login failed. Please try again.');
    }
  },
  
  async register({displayName, email, password}) {
    try {
      // Create Firebase user
      const userCredential = await window.firebaseAuth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;
      
      // Update Firebase Auth profile
      await user.updateProfile({ displayName: displayName.trim() });
      
      // Create player document in Firestore
      await window.firebaseDb.collection('players').doc(user.uid).set({
        displayName: displayName.trim(),
        email: email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
        level: 1,
        element: 'Storm'
      });
      
      return { displayName: displayName.trim(), uid: user.uid };
    } catch (error) {
      console.error('Registration error:', error);
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('This email is already registered. Please sign in instead.');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('Password is too weak. Use at least 8 characters.');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email address.');
      }
      throw new Error(error.message || 'Registration failed. Please try again.');
    }
  },
  
  async signInWithGoogle() {
    try {
      const result = await window.firebaseAuth.signInWithPopup(window.googleProvider);
      const user = result.user;
      
      // Check if player document exists
      const userDoc = await window.firebaseDb.collection('players').doc(user.uid).get();
      
      if (!userDoc.exists) {
        // Create new player document for Google sign-in
        await window.firebaseDb.collection('players').doc(user.uid).set({
          displayName: user.displayName || user.email.split('@')[0],
          email: user.email,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
          level: 1,
          element: 'Storm'
        });
      } else {
        // Update last login
        await window.firebaseDb.collection('players').doc(user.uid).update({
          lastLogin: firebase.firestore.FieldValue.serverTimestamp()
        });
      }
      
      return { displayName: user.displayName || user.email.split('@')[0], uid: user.uid };
    } catch (error) {
      console.error('Google sign-in error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        throw new Error('Sign-in cancelled.');
      }
      throw new Error('Google sign-in failed. Please try again.');
    }
  },
  
  async signOut() {
    try {
      await window.firebaseAuth.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
      throw new Error('Sign out failed.');
    }
  },
  
  // Listen for auth state changes
  onAuthStateChanged(callback) {
    return window.firebaseAuth.onAuthStateChanged(callback);
  },
  
  // Get current user
  getCurrentUser() {
    return window.firebaseAuth.currentUser;
  }
};

// Firestore service for player data persistence
// Uses Firebase compat SDK loaded via CDN

const SAVE_KEY = 'veilstorm-save-v1';

// Firestore player data service
window.ShinobiFirestore = {
  
  // Load player data from Firestore
  async loadPlayerData(uid) {
    try {
      const playerDoc = await window.firebaseDb.collection('players').doc(uid).get();
      const gameDoc = await window.firebaseDb.collection('gameData').doc(uid).get();
      
      if (!playerDoc.exists) {
        console.warn('Player document not found');
        return null;
      }
      
      // Merge player profile with game data
      const playerData = playerDoc.data();
      const gameData = gameDoc.exists ? gameDoc.data() : {};
      
      return {
        ...gameData,
        name: playerData.displayName,
        element: playerData.element || 'Storm',
        uid: uid
      };
    } catch (error) {
      console.error('Error loading player data:', error);
      return null;
    }
  },
  
  // Save player data to Firestore
  async savePlayerData(uid, gameState) {
    try {
      // Don't save the uid in the game state
      const { uid: _, ...dataToSave } = gameState;
      
      // Update player profile
      await window.firebaseDb.collection('players').doc(uid).update({
        displayName: gameState.name,
        element: gameState.element || 'Storm',
        level: gameState.level,
        lastSaved: firebase.firestore.FieldValue.serverTimestamp()
      });
      
      // Save full game state
      await window.firebaseDb.collection('gameData').doc(uid).set({
        ...dataToSave,
        lastSaved: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true });
      
      return true;
    } catch (error) {
      console.error('Error saving player data:', error);
      return false;
    }
  },
  
  // Migrate local save to Firestore
  async migrateLocalSave(uid) {
    try {
      // Check if local save exists
      const localSave = localStorage.getItem(SAVE_KEY);
      if (!localSave) return false;
      
      const localData = JSON.parse(localSave);
      
      // Check if Firestore already has data
      const gameDoc = await window.firebaseDb.collection('gameData').doc(uid).get();
      if (gameDoc.exists) {
        // Ask user if they want to overwrite cloud save
        const overwrite = confirm(
          'You have existing progress in the cloud. Do you want to replace it with your local progress?\n\n' +
          'Click OK to use local save, or Cancel to keep cloud save.'
        );
        if (!overwrite) return false;
      }
      
      // Save local data to Firestore
      await this.savePlayerData(uid, localData);
      console.log('Local save migrated to Firestore');
      return true;
    } catch (error) {
      console.error('Error migrating local save:', error);
      return false;
    }
  },
  
  // Auto-save functionality
  enableAutoSave(uid, getGameState) {
    // Save every 30 seconds
    const autoSaveInterval = setInterval(async () => {
      const gameState = getGameState();
      if (gameState && uid) {
        await this.savePlayerData(uid, gameState);
        console.log('Auto-saved to Firestore');
      }
    }, 30000);
    
    // Save on page unload
    window.addEventListener('beforeunload', async () => {
      const gameState = getGameState();
      if (gameState && uid) {
        await this.savePlayerData(uid, gameState);
      }
    });
    
    return autoSaveInterval;
  }
};

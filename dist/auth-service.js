/* Frontend integration boundary. Demo mode never sends or stores credentials. */
window.ShinobiAuthService = {
  mode: 'demo',
  async login({identifier, password}) {
    // Replace with your authenticated server request, returning {displayName}.
    return {displayName: identifier.includes('@') ? null : identifier.trim(), demo: true};
  },
  async register({displayName, email, password}) {
    // Replace with your registration request. Do not persist passwords in browser storage.
    return {displayName: displayName.trim(), demo: true};
  },
  async signOut() {
    // Replace with your server session invalidation request.
  }
};

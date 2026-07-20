// Firebase Console → Project settings → Your apps → Web app
// Paste your real Firebase web configuration below.
//
// This is a plain script (not a module) on purpose, so the whole site
// can be opened directly from a folder (file://) without needing to
// run a local server. It just sets two global variables that
// auth.js and auth-state.js read directly.
window.firebaseConfig = {
  apiKey: "AIzaSyCC_ODi52dY92vb3Ex7979q8JYWhc8FgSQ",
  authDomain: "elementalscience-cab8a.firebaseapp.com",
  projectId: "elementalscience-cab8a",
  storageBucket: "elementalscience-cab8a.firebasestorage.app",
  messagingSenderId: "566104846386",
  appId: "1:566104846386:web:6c0ebf0b368e0803b5cc2b"
};

window.firebaseConfigured = !Object.values(window.firebaseConfig).some(
  value => String(value).includes("PASTE_YOUR")
);
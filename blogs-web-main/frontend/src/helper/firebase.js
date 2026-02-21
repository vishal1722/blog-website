
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
const firebaseConfig = {
  apiKey: import.meta.env.VITE_Firebase_API_KEY,
  authDomain: "chetan-blogs-web-7266f.firebaseapp.com",
  projectId: "chetan-blogs-web-7266f",
  storageBucket: "chetan-blogs-web-7266f.firebasestorage.app",
  messagingSenderId: "391282069396",
  appId: "1:391282069396:web:4c1b39c9af842d11aa0981",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };

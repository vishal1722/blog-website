// firebase.js

import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC2jxLBE_lZ6KFuP3-ee98M910XKrGCVKg",
  authDomain: "mern-blog-9f268.firebaseapp.com",
  projectId: "mern-blog-9f268",
  storageBucket: "mern-blog-9f268.appspot.com",
  messagingSenderId: "45434974038",
  appId: "1:45434974038:web:f4bab6fecd2c6eef94f0f7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Auth
const auth = getAuth(app);

// Google Auth Provider
const provider = new GoogleAuthProvider();

export { auth, provider };
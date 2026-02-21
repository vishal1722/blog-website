import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getAuth, 
  GoogleAuthProvider 
} from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API,
  authDomain: "mern-blog-9f268.firebaseapp.com",
  projectId: "mern-blog-9f268",
  storageBucket: "mern-blog-9f268.appspot.com",
  messagingSenderId: "45434974038",
  appId: "1:45434974038:web:f4bab6fecd2c6eef94f0f7",
  measurementId: "G-HHM5RH1G6C",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Analytics (optional)
const analytics = getAnalytics(app);

// Auth & Google Provider
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };

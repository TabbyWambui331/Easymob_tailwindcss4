// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAkqYZDtYN_jPkNaCNfe8KgRXwyK1A4Y6Y",
  authDomain: "easymobpos.firebaseapp.com",
  projectId: "easymobpos",
  storageBucket: "easymobpos.appspot.com", // FIXED: changed to .appspot.com
  messagingSenderId: "674255424127",
  appId: "1:674255424127:web:d6da1cc130bb9e53c30d4a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Export auth and db
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";



// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAkqYZDtYN_jPkNaCNfe8KgRXwyK1A4Y6Y",
  authDomain: "easymobpos.firebaseapp.com",
  projectId: "easymobpos",
  storageBucket: "easymobpos.firebasestorage.app",
  messagingSenderId: "674255424127",
  appId: "1:674255424127:web:8d25f8f63c32ef2bc30d4a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
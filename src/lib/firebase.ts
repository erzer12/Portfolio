// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCN0Fcr4Xv6nksogPHY0cX58cXL7lLuedg",
  authDomain: "portfolio-9afb3.firebaseapp.com",
  projectId: "portfolio-9afb3",
  storageBucket: "portfolio-9afb3.appspot.com",
  messagingSenderId: "476695241442",
  appId: "1:476695241442:web:e5670b2b2185156b6074bb",
  measurementId: "G-GCX80LRB6W"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };

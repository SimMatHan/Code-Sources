// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDR1JwotZQVLSfOP6cXmmOA3Jg2Zi0_ghQ",
  authDomain: "sladeshapp.firebaseapp.com",
  projectId: "sladeshapp",
  storageBucket: "sladeshapp.appspot.com",
  messagingSenderId: "929671423726",
  appId: "1:929671423726:web:2a039112fecfcfcfe8b5ff",
  measurementId: "G-J61WDZSHFK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };
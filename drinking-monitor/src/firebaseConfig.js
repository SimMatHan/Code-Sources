// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };

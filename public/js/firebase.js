import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = Object.freeze({
  apiKey: "AIzaSyD9ojNdDkM9M6iO16SW8k7wfWnnJbvHS40",
  authDomain: "itpinkclub-a786e.firebaseapp.com",
  projectId: "itpinkclub-a786e",
  storageBucket: "itpinkclub-a786e.firebasestorage.app",
  messagingSenderId: "716111814812",
  appId: "1:716111814812:web:06e1c76950d39021698d59",
  measurementId: "G-3XSF7CYT1D"
});

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

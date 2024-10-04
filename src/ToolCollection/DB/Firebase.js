// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
 import { getFirestore } from "firebase/firestore"; //
import { getAuth } from "firebase/auth";
 
const firebaseConfig = {
  apiKey: "AIzaSyCmxUKqdp1A5yd5uYDYCQDZIJA9uZLUwec",
  authDomain: "passwordgenerator-322a1.firebaseapp.com",
  projectId: "passwordgenerator-322a1",
  storageBucket: "passwordgenerator-322a1.appspot.com",
  messagingSenderId: "870311033263",
  appId: "1:870311033263:web:c5620e6af3be293811575a",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
 const db = getFirestore(app); // Initialize Firestore
const auth = getAuth(app);
export { auth };
export { db }; // Export Firestore
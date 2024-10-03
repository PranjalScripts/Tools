// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
 import { getFirestore } from "firebase/firestore"; //
import { getAuth } from "firebase/auth";
 
const firebaseConfig = {
  apiKey: "AIzaSyAWYAOvHHYLctuFK95U7q_CnG8O8ucGb48",
  authDomain: "pizeonfly-e73fc.firebaseapp.com",
  projectId: "pizeonfly-e73fc",
  storageBucket: "pizeonfly-e73fc.appspot.com",
  messagingSenderId: "833389843948",
  appId: "1:833389843948:web:254f728d4dab0288f3dcc9",
  measurementId: "G-PK45ZLMGC5",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
 const db = getFirestore(app); // Initialize Firestore
const auth = getAuth(app);
export { auth };
export { db }; // Export Firestore
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDUP0-7U3A_NLgkIE0xPyq5jKvJDfcgy20",
  authDomain: "propertyai-a9c15.firebaseapp.com",
  projectId: "propertyai-a9c15",
  storageBucket: "propertyai-a9c15.firebasestorage.app",
  messagingSenderId: "586997309561",
  appId: "1:586997309561:web:180df766aa5018107db4a8",
  measurementId: "G-B68HR285CP"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

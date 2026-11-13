import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase configuration — Auth only (database replaced by local MongoDB)
const firebaseConfig = {
  apiKey: "AIzaSyB7AYBWdenYQnwhb0DKXj2mH0JN0xQetBE",
  authDomain: "campusconnect-5e23f.firebaseapp.com",
  projectId: "campusconnect-5e23f",
  storageBucket: "campusconnect-5e23f.firebasestorage.app",
  messagingSenderId: "672206410878",
  appId: "1:672206410878:web:38f5fa8cbf9cfc5de4f42f",
  measurementId: "G-B21Z7BJXYB",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export only Auth — Firestore & Storage are replaced by local MongoDB
export const auth = getAuth(app);

export default app;

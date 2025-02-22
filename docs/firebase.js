import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDqw7nw5kgUIAeJz0XpCNEgeamXImlYnQA",
  authDomain: "budjetplanner-wt.firebaseapp.com",
  projectId: "budjetplanner-wt",
  storageBucket: "budjetplanner-wt.firebasestorage.app",
  messagingSenderId: "911434227812",
  appId: "1:911434227812:web:5dd9ff27da4f934ef77f71",
  measurementId: "G-HMNFS8SF0Y",
};

// Initialize Firebase only if not already initialized
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app);
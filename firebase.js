// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);

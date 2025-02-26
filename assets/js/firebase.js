import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { GoogleGenerativeAI } from "@google/generative-ai"; 

const firebaseConfig = {
  apiKey: "AIzaSyDqw7nw5kgUIAeJz0XpCNEgeamXImlYnQA",
  authDomain: "budjetplanner-wt.firebaseapp.com",
  projectId: "budjetplanner-wt",
  storageBucket: "budjetplanner-wt.firebasestorage.app",
  messagingSenderId: "911434227812",
  appId: "1:911434227812:web:5dd9ff27da4f934ef77f71",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

// Function to get API Auth Code
export async function getAuthCode() {
  const docRef = doc(db, "apiAuthCodes", "authCode1");
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log("Auth Code:", docSnap.data().authCode);
    return docSnap.data().authCode;
  } else {
    console.log("No such document!");
    return null;
  }
}
// 🔹 Automatically Redirect on Auth State Change
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("User logged in:", user.email);
      if (window.location.pathname.includes("index.html")) {
        window.location.href = "app.html"; // Redirect only if on login/signup page
      }
    } else {
      console.log("No user detected.");
      if (window.location.pathname.includes("app.html")) {
        window.location.href = "index.html"; // Redirect back to login if not authenticated
      }
    }
  });

let genAI = null;
let model = null;

// Function to get the Gemini AI API key from Firestore
export async function getApiKey() {
  try {
    const docRef = doc(db, "apikey", "googlegenai");
    // Collection: "apikey", Document: "googlegenai"
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const apiKey = docSnap.data().key;
      console.log("Retrieved Gemini API Key:", apiKey);
      genAI = new GoogleGenerativeAI(apiKey);
      model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      return apiKey;
    } else {
      console.error("No API key document found!");
      return null;
    }
  } catch (error) {
    console.error("Error retrieving API key:", error);
    return null;
  }
}

// Function to send a request to the Gemini chatbot
export async function askChatBot(request) {
  if (!model) {
    console.error("Chatbot model is not initialized. Ensure API key is loaded.");
    return "Chatbot is unavailable.";
  }

  try {
    const response = await model.generateContent(request);
    return response.data.candidates[0].content; // Extract chatbot response
  } catch (error) {
    console.error("Error communicating with Chatbot:", error);
    return "There was an issue processing your request.";
  }
}

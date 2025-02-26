import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

let model = null;

// Function to Initialize and Retrieve AI Model
export async function getModel() {
  if (model) return model; 

  try {
    const docRef = doc(db, "static", "googlegemini");
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
      console.error("No API key found in Firestore!");
      return null;
    }

    const apiKey = snapshot.get("key");
    if (!apiKey) {
      console.error("API key field is empty!");
      return null;
    }

    console.log("Gemini AI API Key Loaded");
    model = new GoogleGenerativeAI(apiKey).getGenerativeModel({ model: "gemini-1.5-flash" });
    return model;
  } catch (error) {
    console.error("Error fetching API key:", error);
    return null;
  }
}

// Function to Process User Messages through AI
export async function processMessage(message) {
  const aiModel = await getModel();

  if (!aiModel) return "Chatbot is currently unavailable. Please try again later.";

  try {
    const response = await aiModel.generateContent(message);

    if (response.data && response.data.candidates.length > 0) {
      const botResponse = response.data.candidates[0].content.parts[0].text;
      console.log("AI Response:", botResponse);
      return botResponse;
    } else {
      return "I didn't understand that. Could you please rephrase?";
    }
  } catch (error) {
    console.error("Error communicating with Gemini AI:", error);
    return "I encountered an error. Please try again later!";
  }
}

async function testChatbot() {
    const reply = await processMessage("Hello! What can you do?");
    console.log("Chatbot says:", reply);
}

testChatbot();

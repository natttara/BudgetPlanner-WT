import { auth } from './firebase.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from 'firebase/auth';

// 🔹 Redirect user if already logged in
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("✅ User logged in:", user.email);
        // Detect if running on GitHub Pages or locally
        const isProduction = window.location.hostname !== "localhost";
        const redirectURL = isProduction ? "/BudgetPlanner-WT/app.html" : "app.html";
        
        window.location.href = redirectURL;
    }
});

// 🔹 Sign Up User
window.signUpUser = async function () {
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("✅ Sign up successful!", userCredential.user);
        
        // Redirect to app.html after signup
        window.location.href = "app.html"; 
    } catch (error) {
        console.error("🔥 Sign-up error:", error);
        alert(`Error: ${error.message}`);
    }
};

// 🔹 Login User
window.loginUser = async function () {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("✅ Login successful!", userCredential.user);

        // Redirect to app.html after login
        window.location.href = "app.html"; 
    } catch (error) {
        console.error("🔥 Login error:", error);
        alert(`Error: ${error.message}`);
    }
};

// 🔹 Toggle Login and Sign Up Pages
window.showLogin = function () {
    document.getElementById('signupPage').style.display = 'none';
    document.getElementById('loginPage').style.display = 'block';
};

window.showSignUp = function () {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('signupPage').style.display = 'block';
};

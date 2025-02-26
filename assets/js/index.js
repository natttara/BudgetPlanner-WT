import { auth } from './firebase.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from 'firebase/auth';

// if already logged in
onAuthStateChanged(auth, (user) => {
    console.log("Current Path:", window.location.pathname);
    if (user) {
        console.log("User logged in:", user.email);
        // Detect if running on GitHub Pages or locally
        const isProduction = window.location.hostname !== "localhost";
        const redirectURL = isProduction ? "/BudgetPlanner-WT/app.html" : "app.html";
        // window.location.href = redirectURL;

        console.log("Redirecting to:", redirectURL);
        // window.location.assign(redirectURL);
        // if (window.location.pathname.includes("index.html")) {
            // console.log("Redirecting to app.html...");
        //     window.location.href = "app.html";
        // }
        if (window.location.pathname.includes("index.html") || window.location.pathname === "/") {
            window.location.href = redirectURL;
        }
    } 
    else {
        console.log("No user detected.");

        // if (window.location.pathname.includes("app.html")) {
        //     console.log("Redirecting to index.html...");
        //     window.location.href = "index.html";
        // }
}
});

// Sign Up User
window.signUpUser = async function () {
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log("Sign up successful!", userCredential.user);
        // window.location.href = "app.html"; 
        window.location.replace("app.html");
        
    } catch (error) {
        console.error("Sign-up error:", error);
        alert(`Error: ${error.message}`);
    }
};

// Login User
window.loginUser = async function () {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Login successful!", userCredential.user);
        alert('Login successful!');
        // window.location.href = "app.html"; 
        window.location.replace("app.html");
    } catch (error) {
        console.error("Login error:", error);
        alert(`Error: ${error.message}`);
    }
};

// Toggle Login and Sign Up Pages
window.showLogin = function () {
    document.getElementById('signupPage').style.display = 'none';
    document.getElementById('loginPage').style.display = 'block';
};

window.showSignUp = function () {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('signupPage').style.display = 'block';
};
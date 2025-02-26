import { auth } from './firebase.js';
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

// Redirect user if already logged in
onAuthStateChanged(auth, (user) => {
    console.log(user);
    if (user) {
        const isProduction = window.location.hostname !== "localhost";
        const redirectURL = isProduction ? "/BudgetPlanner-WT/app.html" : "/app.html";

        window.location.href = redirectURL;
    }
});

// Sign Up User
window.signUpUser = async function () {
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    try {
        await createUserWithEmailAndPassword(auth, email, password);
        alert('Sign up successful!');
        window.location.href = "/app.html"; // Redirect to the main page after sign up
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
};

// Login User
window.loginUser = async function () {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        alert('Login successful!');
        window.location.href = "/app.html"; // Redirect after login
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
};

// Toggle between Sign Up and Login
window.showLogin = function () {
    document.getElementById('signupPage').style.display = 'none';
    document.getElementById('loginPage').style.display = 'block';
};

window.showSignUp = function () {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('signupPage').style.display = 'block';
};

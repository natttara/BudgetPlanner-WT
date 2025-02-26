import { db } from './firebase.js';
import { collection, addDoc, updateDoc, getDocs, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { getAuthCode } from "./firestore";
import { processMessage } from "./chatAI";

// Form elements
const form = document.getElementById('transactionForm');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const categoryInput = document.getElementById('category');
const transactionList = document.getElementById('transactionList');
const totalIncome = document.getElementById('totalIncome');
const totalExpenses = document.getElementById('totalExpenses');
const balance = document.getElementById('balance');

// Add Transaction
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const description = sanitizeInput(descriptionInput.value);
    const amount = parseFloat(amountInput.value);
    const category = categoryInput.value;

    if (description && amount && category) {
        try {
            await addDoc(collection(db, 'transactions'), {
                description,
                amount,
                category,
                date: new Date().toISOString()
            });

            console.log("Transaction added successfully!");
            form.reset();
        } catch (error) {
            console.error("Error adding transaction: ", error);
        }
    } else {
        alert("Please fill out all fields.");
    }
});

// Render Transactions
function renderTransactions() {
    onSnapshot(collection(db, 'transactions'), (snapshot) => {
        let income = 0;
        let expenses = 0;
        transactionList.innerHTML = '';

        snapshot.forEach((doc) => {
            const { description, amount, category } = doc.data();

            // Create list item
            const li = document.createElement('li');

            // Transaction details
            li.innerHTML = `
                <div class="transaction-details">
                    <span>${description} - $${amount} (${category})</span>
                </div>
                <div class="transaction-actions">
                    <button class="edit-btn" onclick="editTransaction('${doc.id}', '${description}', ${amount}, '${category}')">Edit</button>
                    <button class="delete-btn" onclick="deleteTransaction('${doc.id}')">Delete</button>
                </div>
            `;

            // Update totals
            if (category === 'Income') {
                income += amount;
            } else {
                expenses += amount;
            }

            transactionList.appendChild(li);
        });

        // Update summary
        totalIncome.textContent = `$${income}`;
        totalExpenses.textContent = `$${expenses}`;
        balance.textContent = `$${income - expenses}`;
    });
}

// Edit Transaction
window.editTransaction = (id, description, amount, category) => {
    const newDescription = prompt("Edit description:", description);
    const newAmount = parseFloat(prompt("Edit amount:", amount));
    const newCategory = prompt("Edit category:", category);

    if (newDescription && !isNaN(newAmount) && newCategory) {
        updateTransaction(id, newDescription, newAmount, newCategory);
    } else {
        alert("Invalid input. Please try again.");
    }
};

async function updateTransaction(id, description, amount, category) {
    const transactionRef = doc(db, 'transactions', id);

    try {
        await updateDoc(transactionRef, {
            description,
            amount,
            category,
            date: new Date().toISOString()
        });

        alert("Transaction updated successfully!");
    } catch (error) {
        console.error("Error updating transaction:", error);
    }
}

// Fetch All Transactions (getDocs)
async function fetchAllTransactions() {
    try {
        const querySnapshot = await getDocs(collection(db, 'transactions'));
        if (querySnapshot.empty) {
            console.log("No transactions found.");
            return;
        }

        querySnapshot.forEach((doc) => {
            console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
        });

    } catch (error) {
        console.error("Error fetching transactions: ", error);
    }
}

// Delete Transaction
window.deleteTransaction = async (id) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
        try {
            await deleteDoc(doc(db, 'transactions', id));
            alert("Transaction deleted.");
        } catch (error) {
            alert("Error deleting transaction:", error);
        }
    }
};

// Sanitize Input
function sanitizeInput(input) {
    const div = document.createElement("div");
    div.textContent = input;
    return div.innerHTML.trim();
}

// Service Worker Registration
const sw = new URL('service-worker.js', import.meta.url);
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register(sw.href, { scope: '/BudgetPlanner-WT/' })
        .then(() => console.log('Service Worker Registered'))
        .catch((err) => console.error('Service Worker Error:', err));
}

async function fetchAuthCode() {
    const authCode = await getAuthCode();
    if (authCode) {
      console.log("Fetched Auth Code:", authCode);
    } else {
      console.log("Failed to fetch the auth code.");
    }
  }
  
fetchAuthCode();

// chatAI
document.addEventListener("DOMContentLoaded", async () => {
    const aiButton = document.getElementById("send-btn");
    const aiInput = document.getElementById("chat-input");
    const chatHistory = document.getElementById("chat-history");
  
    function appendMessage(text, isAI) {
      const message = document.createElement("div");
      message.textContent = isAI ? " 🤖 " + text : "🧑 " + text;
      message.className = `chat-message ${isAI ? "ai" : "user"}`;
      chatHistory.appendChild(message);
      chatHistory.scrollTop = chatHistory.scrollHeight;
    }
  
    async function submit() {
      const message = aiInput.value.trim();
      if (message.length === 0) return;
  
      appendMessage(message, false);
      aiInput.value = "...";
      aiInput.disabled = true;
  
      const response = await processMessage(message);
      aiInput.value = "";
      aiInput.disabled = false;
  
      appendMessage(response, true);
      aiInput.focus();
    }
  
    aiButton.addEventListener("click", submit);
    aiInput.addEventListener("keypress", (event) => {
      if (event.key === "Enter") submit();
    });
  
    appendMessage("Hello! How can I assist you with budgeting today?", true);
  });

// Initialize App
renderTransactions();

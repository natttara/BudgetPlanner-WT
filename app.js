import { db } from './firebase.js';
import { collection, addDoc, getDocs, deleteDoc, doc, onSnapshot } from 'firebase/firestore';

// Form elements
const form = document.getElementById('transactionForm');
const description = document.getElementById('description');
const amount = document.getElementById('amount');
const category = document.getElementById('category');
const transactionList = document.getElementById('transactionList');
const totalIncome = document.getElementById('totalIncome');
const totalExpenses = document.getElementById('totalExpenses');
const balance = document.getElementById('balance');

// Add Transaction
async function addTransaction(description, amount, category) {
    try {
        await addDoc(collection(db, 'transactions'), {
            description: description,
            amount: amount,
            category: category,
            date: new Date().toISOString()
        });
        console.log("Transaction added!");
    } catch (error) {
        console.error("Error adding transaction: ", error);
    }
}

// Fetch and Display Transactions
function renderTransactions() {
    onSnapshot(collection(db, 'transactions'), (snapshot) => {
        let income = 0;
        let expenses = 0;
        transactionList.innerHTML = '';

        snapshot.forEach((doc) => {
            const { description, amount, category } = doc.data();
            const li = document.createElement('li');
            li.innerHTML = `${description} - $${amount} (${category})
            <button onclick="deleteTransaction('${doc.id}')">Delete</button>`;

            if (category === 'Income') {
                income += amount;
            } else {
                expenses += amount;
            }

            transactionList.appendChild(li);
        });

        totalIncome.textContent = income;
        totalExpenses.textContent = expenses;
        balance.textContent = income - expenses;
    });
}

// Delete Transaction
window.deleteTransaction = async (id) => {
    try {
        await deleteDoc(doc(db, 'transactions', id));
    } catch (error) {
        console.error('Error deleting transaction:', error);
    }
};

// Initialize the app
renderTransactions();

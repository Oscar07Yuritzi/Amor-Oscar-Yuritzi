import { auth } from './firebase.js';
import { signOut } from 'firebase/auth';

// Check authentication state
const userEmail = localStorage.getItem('userEmail');
if (!userEmail) {
    window.location.href = 'index.html';
}

// Logout functionality
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        try {
            await signOut(auth);
            localStorage.removeItem('userEmail');
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Error signing out:', error);
        }
    });
}
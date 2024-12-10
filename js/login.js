import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase.js';

const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    if (user.email === 'oscar@amor.com' || user.email === 'yuritzi@amor.com') {
      localStorage.setItem('userEmail', user.email);
      window.location.href = '/home.html';
    } else {
      alert('Usuario no autorizado');
    }
  } catch (error) {
    alert('Error en el inicio de sesión: ' + error.message);
  }
});
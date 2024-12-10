import { auth } from './firebase.js';

// Check authentication
const userEmail = localStorage.getItem('userEmail');
if (!userEmail) {
    window.location.href = 'index.html';
}

// Welcome message with user name
document.addEventListener('DOMContentLoaded', () => {
    const welcomeMessage = document.querySelector('.welcome-message p');
    if (welcomeMessage) {
        const userName = userEmail.startsWith('oscar') ? 'Oscar' : 'Yuritzi';
        welcomeMessage.textContent = `Bienvenido${userName === 'Yuritzi' ? 'a' : ''} ${userName} a nuestro espacio especial`;
    }

    // Add parallax effect to hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        });
    }

    // Add hover effect to quick links
    const quickLinks = document.querySelectorAll('.quick-link');
    quickLinks.forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.style.transform = 'translateY(-10px) scale(1.05)';
        });
        
        link.addEventListener('mouseleave', () => {
            link.style.transform = 'translateY(0) scale(1)';
        });
    });
});
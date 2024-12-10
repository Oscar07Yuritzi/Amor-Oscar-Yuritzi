import { db } from './firebase.js';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';

const userEmail = localStorage.getItem('userEmail');
if (!userEmail) {
    window.location.href = 'index.html';
}

const poemsContainer = document.getElementById('poemsContainer');
const poemTitle = document.getElementById('poemTitle');
const poemContent = document.getElementById('poemContent');
const savePoem = document.getElementById('savePoem');

// Save new poem
savePoem.addEventListener('click', async () => {
    if (!poemTitle.value.trim() || !poemContent.value.trim()) {
        alert('Por favor completa todos los campos');
        return;
    }

    try {
        await addDoc(collection(db, 'poems'), {
            title: poemTitle.value,
            content: poemContent.value,
            author: userEmail,
            timestamp: new Date().toISOString()
        });
        
        // Add success animation
        const saveIcon = savePoem.querySelector('.save-icon');
        saveIcon.textContent = '✓';
        savePoem.style.background = '#4CAF50';
        
        setTimeout(() => {
            saveIcon.textContent = '❤️';
            savePoem.style.background = '';
        }, 2000);

        poemTitle.value = '';
        poemContent.value = '';
    } catch (error) {
        console.error('Error saving poem:', error);
        alert('Error al guardar el poema');
    }
});

// Load poems from Firestore with animation
const q = query(collection(db, 'poems'), orderBy('timestamp', 'desc'));
onSnapshot(q, (snapshot) => {
    poemsContainer.innerHTML = '';
    snapshot.forEach((doc) => {
        const poem = doc.data();
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-info">
                <p class="title">${poem.title}</p>
                <p class="content">${poem.content}</p>
                <p class="author">- ${poem.author === 'oscar@amor.com' ? 'Oscar' : 'Yuritzi'}</p>
            </div>
        `;
        
        // Add entrance animation
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        poemsContainer.appendChild(card);
        
        requestAnimationFrame(() => {
            card.style.transition = 'all 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        });
    });
});

// Add input animations
[poemTitle, poemContent].forEach(input => {
    input.addEventListener('focus', () => {
        input.style.transform = 'scale(1.01)';
    });
    
    input.addEventListener('blur', () => {
        input.style.transform = 'scale(1)';
    });
});
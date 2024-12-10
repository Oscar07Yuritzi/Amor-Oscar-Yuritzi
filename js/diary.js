import { db } from './firebase.js';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';

const userEmail = localStorage.getItem('userEmail');
if (!userEmail) {
    window.location.href = '/index.html';
}

const diaryEntry = document.getElementById('diaryEntry');
const saveDiaryEntry = document.getElementById('saveDiaryEntry');
const diaryEntries = document.getElementById('diaryEntries');

saveDiaryEntry.addEventListener('click', async () => {
    if (!diaryEntry.value.trim()) return;

    try {
        await addDoc(collection(db, 'diary'), {
            content: diaryEntry.value,
            author: userEmail,
            timestamp: new Date().toISOString()
        });
        diaryEntry.value = '';
    } catch (error) {
        console.error('Error saving diary entry:', error);
    }
});

// Load diary entries
const q = query(collection(db, 'diary'), orderBy('timestamp', 'desc'));
onSnapshot(q, (snapshot) => {
    diaryEntries.innerHTML = '';
    snapshot.forEach((doc) => {
        const entry = doc.data();
        const div = document.createElement('div');
        div.className = 'diary-entry';
        div.innerHTML = `
            <p class="entry-author">${entry.author === 'oscar@amor.com' ? 'Oscar' : 'Yuritzi'}</p>
            <p class="entry-content">${entry.content}</p>
            <p class="entry-date">${new Date(entry.timestamp).toLocaleDateString()}</p>
        `;
        diaryEntries.appendChild(div);
    });
});
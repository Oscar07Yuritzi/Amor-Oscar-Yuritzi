import { db, storage } from './firebase.js';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { MEDIA_CONFIG, isValidMediaType, getMediaType } from './config/media.js';
import { formatFileSize, getThumbnailPath, getMediaDimensions } from './utils/mediaHelpers.js';

const userEmail = localStorage.getItem('userEmail');
if (!userEmail) {
    window.location.href = 'index.html';
}

const memoriesGrid = document.getElementById('memoriesGrid');
const modal = document.getElementById('mediaModal');
const modalImage = document.getElementById('modalImage');
const modalVideo = document.getElementById('modalVideo');
const closeModal = document.querySelector('.close-modal');

// Upload media
async function uploadMedia(file, description) {
    if (!isValidMediaType(file.name)) {
        throw new Error('Tipo de archivo no soportado');
    }

    if (file.size > MEDIA_CONFIG.MAX_FILE_SIZE) {
        throw new Error(`El archivo excede el tamaño máximo de ${formatFileSize(MEDIA_CONFIG.MAX_FILE_SIZE)}`);
    }

    const mediaType = getMediaType(file.name);
    const timestamp = new Date().getTime();
    const filename = `${timestamp}_${file.name}`;
    const path = mediaType === 'image' ? MEDIA_CONFIG.IMAGES_PATH : MEDIA_CONFIG.VIDEOS_PATH;
    const storageRef = ref(storage, `${path}/${filename}`);

    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    const dimensions = await getMediaDimensions(file);

    await addDoc(collection(db, 'memories'), {
        type: mediaType,
        url,
        description,
        author: userEmail,
        timestamp: new Date().toISOString(),
        filename,
        size: file.size,
        dimensions
    });
}

// Display memories
function displayMemories() {
    const q = query(collection(db, 'memories'), orderBy('timestamp', 'desc'));
    onSnapshot(q, (snapshot) => {
        memoriesGrid.innerHTML = '';
        snapshot.forEach((doc) => {
            const memory = doc.data();
            const card = document.createElement('div');
            card.className = 'memory-card';
            
            if (memory.type === 'image') {
                card.innerHTML = `
                    <img src="${memory.url}" alt="${memory.description}" loading="lazy">
                    <div class="memory-info">
                        <p>${memory.description}</p>
                        <small>${new Date(memory.timestamp).toLocaleDateString()}</small>
                    </div>
                `;
            } else {
                card.innerHTML = `
                    <video>
                        <source src="${memory.url}" type="video/mp4">
                    </video>
                    <div class="memory-info">
                        <p>${memory.description}</p>
                        <small>${new Date(memory.timestamp).toLocaleDateString()}</small>
                    </div>
                `;
            }

            card.addEventListener('click', () => showModal(memory));
            memoriesGrid.appendChild(card);
        });
    });
}

// Modal functionality
function showModal(memory) {
    if (memory.type === 'image') {
        modalImage.style.display = 'block';
        modalVideo.style.display = 'none';
        modalImage.src = memory.url;
    } else {
        modalImage.style.display = 'none';
        modalVideo.style.display = 'block';
        modalVideo.src = memory.url;
    }
    modal.style.display = 'flex';
}

// Close modal events
if (closeModal) {
    closeModal.onclick = () => {
        modal.style.display = 'none';
        modalVideo.pause();
    };
}

window.onclick = (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        modalVideo.pause();
    }
};

// Initialize
displayMemories();

// Export functions for use in other modules
export { uploadMedia };
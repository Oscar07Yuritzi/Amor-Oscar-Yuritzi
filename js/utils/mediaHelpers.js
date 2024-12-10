import { MEDIA_CONFIG, getMediaType } from '../config/media.js';

// Format file size for display
export const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Generate thumbnail path for a media file
export const getThumbnailPath = (mediaPath) => {
    const pathParts = mediaPath.split('/');
    const filename = pathParts.pop();
    return `${pathParts.join('/')}/thumbnails/${filename}`;
};

// Get media dimensions
export const getMediaDimensions = async (file) => {
    return new Promise((resolve) => {
        const mediaType = getMediaType(file.name);
        const element = mediaType === 'image' ? new Image() : document.createElement('video');
        
        element.onload = element.onloadedmetadata = () => {
            resolve({
                width: element.width || element.videoWidth,
                height: element.height || element.videoHeight
            });
        };
        
        if (mediaType === 'image') {
            element.src = URL.createObjectURL(file);
        } else {
            element.src = URL.createObjectURL(file);
        }
    });
};
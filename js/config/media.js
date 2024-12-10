// Media folder configuration
export const MEDIA_CONFIG = {
    IMAGES_PATH: 'media/images',
    VIDEOS_PATH: 'media/videos',
    SUPPORTED_IMAGE_TYPES: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    SUPPORTED_VIDEO_TYPES: ['mp4', 'webm', 'ogg'],
    MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
    THUMBNAIL_SIZE: {
        width: 300,
        height: 300
    }
};

// Media type validation
export const isValidMediaType = (filename) => {
    const extension = filename.split('.').pop().toLowerCase();
    return [...MEDIA_CONFIG.SUPPORTED_IMAGE_TYPES, ...MEDIA_CONFIG.SUPPORTED_VIDEO_TYPES].includes(extension);
};

export const getMediaType = (filename) => {
    const extension = filename.split('.').pop().toLowerCase();
    if (MEDIA_CONFIG.SUPPORTED_IMAGE_TYPES.includes(extension)) return 'image';
    if (MEDIA_CONFIG.SUPPORTED_VIDEO_TYPES.includes(extension)) return 'video';
    return null;
};
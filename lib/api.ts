import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const apiClient = axios.create({
    baseURL: API_BASE_URL,  
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use((config) => {
    return config;
});

/**
 * Resolves a dynamic image URL path from either absolute cloud services (Cloudinary/Unsplash)
 * or local relative paths (falls back to prepended API URL). Automatically optimizes Cloudinary URLs.
 */
export const getImageUrl = (url?: string): string => {
    if (!url) return 'https://res.cloudinary.com/duweg8kpv/image/upload/f_auto,q_auto/v1774272414/N8_e2gfi5.jpg';
    
    if (url.startsWith('http://') || url.startsWith('https://')) {
        // Optimize Cloudinary URLs on-the-fly with secure performance tags
        if (url.includes('res.cloudinary.com') && !url.includes('/f_auto,q_auto/')) {
            return url.replace('/upload/', '/upload/f_auto,q_auto/');
        }
        return url;
    }
    
    // Support local disk storage fallbacks (relative uploads path)
    const cleanBaseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    const cleanRelativeUrl = url.startsWith('/') ? url : `/${url}`;
    return `${cleanBaseUrl}${cleanRelativeUrl}`;
};
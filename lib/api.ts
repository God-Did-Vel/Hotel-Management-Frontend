import axios from 'axios';

let API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

if (API_BASE_URL && !API_BASE_URL.startsWith('http://') && !API_BASE_URL.startsWith('https://')) {
    API_BASE_URL = `https://${API_BASE_URL}`;
}

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getImageUrl = (url: any) => {
    // Handle null, undefined, or non-string values
    if (!url || typeof url !== 'string') {
        return 'https://res.cloudinary.com/duweg8kpv/image/upload/v1774272414/N8_e2gfi5.jpg';
    }
    
    if (url.startsWith('http://') || url.startsWith('https://')) {
        // Optimize Cloudinary URLs on the server
        if (url.includes('res.cloudinary.com')) {
            return url.replace('/upload/', '/upload/w_800,q_auto,f_auto/');
        }
        return url;
    }
    
    // Local image paths
    const cleanUrl = url.startsWith('/') ? url : `/${url}`;
    const cleanBaseUrl = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    return `${cleanBaseUrl}${cleanUrl}`;
};
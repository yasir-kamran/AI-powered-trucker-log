// API Configuration - Force production URL for Vercel deployment
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://ai-powered-trucker-log.onrender.com';

export const API_URL = API_BASE_URL;

// Debug logging
console.log('=== API Configuration ===');
console.log('REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Final API_URL configured as:', API_URL);

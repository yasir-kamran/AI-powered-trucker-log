// API Configuration - NUKE OPTION: Hardcoded production URL
const API_BASE_URL = 'https://ai-powered-trucker-log.onrender.com';

export const API_URL = API_BASE_URL;

// Debug logging - will always show the hardcoded URL
console.log('=== NUCLEAR API CONFIGURATION ===');
console.log('Hardcoded API_URL (NO ENV VARS):', API_URL);
console.log('This URL cannot be changed by environment variables!');

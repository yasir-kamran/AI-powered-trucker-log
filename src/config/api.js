// API Configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://ai-powered-trucker-log.onrender.com'
  : 'http://127.0.0.1:5000';

export const API_URL = API_BASE_URL;

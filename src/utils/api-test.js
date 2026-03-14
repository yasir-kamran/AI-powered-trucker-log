// API Configuration Test
import { API_URL } from '../config/api.js';

console.log('=== API Configuration Test ===');
console.log('Imported API_URL:', API_URL);
console.log('Type of API_URL:', typeof API_URL);
console.log('API_URL length:', API_URL?.length);

// Test URL construction
const testPath = '/api/health';
const fullUrl = `${API_URL}${testPath}`;
console.log('Test path:', testPath);
console.log('Full URL:', fullUrl);

export const testApiConfig = () => {
  return {
    apiUrl: API_URL,
    testUrl: fullUrl,
    isAbsolute: fullUrl.startsWith('http'),
  };
};

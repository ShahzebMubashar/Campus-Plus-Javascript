const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? process.env.API_URL || 'https://your-koyeb-app-name.koyeb.app'
  : 'http://localhost:4000';

export default API_BASE_URL;

// Alternative export for axios configuration
export const apiConfig = {
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
}; 
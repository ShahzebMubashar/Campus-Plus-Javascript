const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';


export default API_BASE_URL;

// Alternative export for axios configuration
export const apiConfig = {
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
}; 
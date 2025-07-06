/**
 * JWT Token Management Utilities
 * Handles token storage, validation, and automatic refresh
 */

const TOKEN_KEY = 'campus_plus_access_token';
const REFRESH_TOKEN_KEY = 'campus_plus_refresh_token';
const USER_KEY = 'campus_plus_user';

/**
 * Store tokens in localStorage
 */
export const setTokens = (accessToken, refreshToken) => {
  localStorage.setItem(TOKEN_KEY, accessToken);
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
};

/**
 * Get access token from localStorage
 */
export const getAccessToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Get refresh token from localStorage
 */
export const getRefreshToken = () => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * Store user data in localStorage
 */
export const setUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

/**
 * Get user data from localStorage
 */
export const getUser = () => {
  const userData = localStorage.getItem(USER_KEY);
  try {
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

/**
 * Clear all authentication data
 */
export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

/**
 * Check if user is authenticated (has valid token)
 */
export const isAuthenticated = () => {
  const token = getAccessToken();
  if (!token) return false;

  try {
    // Decode JWT to check expiration (basic check)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    // Check if token is expired
    if (payload.exp < currentTime) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error checking token validity:', error);
    return false;
  }
};

/**
 * Get authorization header for API requests
 */
export const getAuthHeader = () => {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Refresh access token using refresh token
 */
export const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  try {
    const API_BASE_URL = process.env.NODE_ENV === 'production' 
      ? process.env.REACT_APP_API_URL || 'https://rude-mandrill-ehanayaz-8d5ca455.koyeb.app'
      : 'http://localhost:4000';

    const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const data = await response.json();
    setTokens(data.accessToken, data.refreshToken);
    
    return data.accessToken;
  } catch (error) {
    console.error('Token refresh error:', error);
    clearAuth();
    throw error;
  }
};

/**
 * Make authenticated API request with automatic token refresh
 */
export const authenticatedFetch = async (url, options = {}) => {
  const makeRequest = async (token) => {
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  };

  let token = getAccessToken();
  
  if (!token) {
    throw new Error('No access token available');
  }

  let response = await makeRequest(token);

  // If token is expired, try to refresh
  if (response.status === 401) {
    try {
      token = await refreshAccessToken();
      response = await makeRequest(token);
    } catch (refreshError) {
      // Refresh failed, user needs to login again
      clearAuth();
      window.dispatchEvent(new CustomEvent('authStateChanged', {
        detail: { isAuthenticated: false, user: null }
      }));
      throw new Error('Authentication failed. Please login again.');
    }
  }

  return response;
};

/**
 * Extract tokens from OAuth callback URL
 */
export const extractTokensFromURL = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const tokenData = urlParams.get('tokens');
  
  if (tokenData) {
    try {
      const tokens = JSON.parse(decodeURIComponent(tokenData));
      return tokens;
    } catch (error) {
      console.error('Error parsing tokens from URL:', error);
    }
  }
  
  return null;
};

/**
 * Login with tokens (for OAuth and regular login)
 */
export const loginWithTokens = (tokens, user) => {
  setTokens(tokens.accessToken, tokens.refreshToken);
  setUser(user);
  
  // Dispatch authentication state change event
  window.dispatchEvent(new CustomEvent('authStateChanged', {
    detail: { isAuthenticated: true, user }
  }));
};

/**
 * Logout user
 */
export const logout = async () => {
  try {
    // Call logout endpoint if token exists
    const token = getAccessToken();
    if (token) {
      const API_BASE_URL = process.env.NODE_ENV === 'production' 
        ? process.env.REACT_APP_API_URL || 'https://rude-mandrill-ehanayaz-8d5ca455.koyeb.app'
        : 'http://localhost:4000';

      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    }
  } catch (error) {
    console.error('Logout API call failed:', error);
  } finally {
    // Always clear local auth data
    clearAuth();
    
    // Dispatch authentication state change event
    window.dispatchEvent(new CustomEvent('authStateChanged', {
      detail: { isAuthenticated: false, user: null }
    }));
  }
}; 
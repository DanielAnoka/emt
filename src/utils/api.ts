// API utility functions for making authenticated requests

const API_BASE_URL = 'https://api.digital-receipt.westapp.com.ng/api';

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('estate_token');
};

// Create headers with authentication
const createAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// Generic API request function
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...createAuthHeaders(),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    // Handle authentication errors
    if (response.status === 401) {
      // Token expired or invalid, redirect to login
      localStorage.removeItem('estate_user');
      localStorage.removeItem('estate_token');
      window.location.href = '/login';
      throw new Error('Authentication failed');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Specific API functions
export const api = {
  // Get current user profile
  getMe: () => apiRequest<{ user: any }>('/me'),
  
  // Generic GET request
  get: <T>(endpoint: string) => apiRequest<T>(endpoint, { method: 'GET' }),
  
  // Generic POST request
  post: <T>(endpoint: string, data: any) => 
    apiRequest<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  // Generic PUT request
  put: <T>(endpoint: string, data: any) => 
    apiRequest<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  // Generic DELETE request
  delete: <T>(endpoint: string) => 
    apiRequest<T>(endpoint, { method: 'DELETE' }),
};

export default api;
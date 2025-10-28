// API configuration and utility functions
// Centralized backend communication with privacy-first approach

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Session management
export const sessionManager = {
  setToken: (token) => {
    localStorage.setItem('clandestine_session', token);
  },
  
  getToken: () => {
    return localStorage.getItem('clandestine_session');
  },
  
  clearToken: () => {
    localStorage.removeItem('clandestine_session');
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('clandestine_session');
  }
};

// Generic API request handler
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const sessionToken = sessionManager.getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (sessionToken && !options.noAuth) {
    headers['X-Session-Token'] = sessionToken;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Invitation API
export const inviteAPI = {
  validate: async (token) => {
    return apiRequest('/invite/validate', {
      method: 'POST',
      body: JSON.stringify({ token }),
      noAuth: true,
    });
  },

  generateQR: async (masterToken) => {
    return apiRequest('/invite/generate', {
      method: 'POST',
      body: JSON.stringify({ masterToken }),
      noAuth: true,
    });
  },
};

// Authentication API
export const authAPI = {
  signup: async (username, inviteToken) => {
    return apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ username, inviteToken }),
      noAuth: true,
    });
  },

  verify: async (sessionToken) => {
    return apiRequest('/auth/verify', {
      method: 'POST',
      body: JSON.stringify({ sessionToken }),
      noAuth: true,
    });
  },

  logout: async () => {
    const sessionToken = sessionManager.getToken();
    const result = await apiRequest('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ sessionToken }),
    });
    sessionManager.clearToken();
    return result;
  },
};

// Posts API
export const postsAPI = {
  getAll: async () => {
    return apiRequest('/posts');
  },

  create: async (content) => {
    return apiRequest('/posts', {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },

  delete: async (postId) => {
    return apiRequest(`/posts/${postId}`, {
      method: 'DELETE',
    });
  },

  getStats: async () => {
    return apiRequest('/posts/stats');
  },
};

export default {
  inviteAPI,
  authAPI,
  postsAPI,
  sessionManager,
};

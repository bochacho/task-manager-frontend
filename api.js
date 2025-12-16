const API_URL = 'https://task-management-api-production-2d60.up.railway.app';

// API helper class
class API {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }
  
  // Get token from localStorage
  getToken() {
    return localStorage.getItem('token');
  }

  // Build headers for requests
  getHeaders(needsAuth = false) {
    const headers = {
      'Content-Type': 'application/json'
    };
    
    // Add auth token if needed
    if (needsAuth) {
      const token = this.getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    
    return headers;
  }
  
  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: this.getHeaders(options.needsAuth)
      });
      
      const data = await response.json();
      
      // Check if request failed
      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }
      
      return data;
      
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

    async register(name, email, password) {
        return this.request('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({ name, email, password }),
            needsAuth: false  
        });
    }

    async login(email, password) {
        return this.request('api/auth/login', {
            method: 'POST',
            body : JSON.stringify({email, password}),
            needsAuth : false
        })
    }

    async getMe() {
        return this.request('/api/auth/me', {
        method: 'GET',
        needsAuth: true  // Need token!
        });
    }

    async getTasks(filters = {}){
        const queryParams = new URLSearchParams(filters).toString();
        const endpt = queryParams ? `/api/tasks?${queryParams}` : '/api/tasks';

        return this.request(endpt, {
            method : "GET",
            needsAuth : true
        })
    }

      // Create a new task
  async createTask(taskData) {
    return this.request('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
      needsAuth: true
    });
  }

  // Update a task
  async updateTask(id, taskData) {
    return this.request(`/api/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
      needsAuth: true
    });
  }

  // Delete a task
  async deleteTask(id) {
    return this.request(`/api/tasks/${id}`, {
      method: 'DELETE',
      needsAuth: true
    });
  }
}
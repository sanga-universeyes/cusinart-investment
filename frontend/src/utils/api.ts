import { ApiResponse, PaginatedResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Une erreur est survenue');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(credentials: { phone: string; password: string }) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: {
    firstName: string;
    lastName: string;
    phone: string;
    password: string;
    referralCode?: string;
  }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async adminLogin(credentials: { username: string; password: string }) {
    return this.request('/auth/admin/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async refreshToken(refreshToken: string) {
    return this.request('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  // User endpoints
  async getProfile() {
    return this.request('/users/profile');
  }

  async updateProfile(profileData: {
    firstName?: string;
    lastName?: string;
    email?: string;
    language?: string;
    currency?: string;
  }) {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async changePassword(passwords: {
    currentPassword: string;
    newPassword: string;
  }) {
    return this.request('/users/change-password', {
      method: 'POST',
      body: JSON.stringify(passwords),
    });
  }

  async getStats() {
    return this.request('/users/stats');
  }

  async getTransactions(params?: {
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return this.request(`/users/transactions?${queryParams}`);
  }

  async getInvestments(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return this.request(`/users/investments?${queryParams}`);
  }

  async getTeam() {
    return this.request('/users/team');
  }

  // Transaction endpoints
  async createDeposit(depositData: {
    amount: number;
    currency: string;
    method: string;
  }) {
    return this.request('/transactions/deposit', {
      method: 'POST',
      body: JSON.stringify(depositData),
    });
  }

  async createWithdrawal(withdrawalData: {
    amount: number;
    currency: string;
    method: string;
    accountDetails: string;
    withdrawalPassword: string;
  }) {
    return this.request('/transactions/withdrawal', {
      method: 'POST',
      body: JSON.stringify(withdrawalData),
    });
  }

  async getTransactionHistory(params?: {
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return this.request(`/transactions/history?${queryParams}`);
  }

  async getTransaction(id: string) {
    return this.request(`/transactions/${id}`);
  }

  // Investment endpoints
  async getInvestmentPlans() {
    return this.request('/investments/plans');
  }

  async createInvestment(investmentData: {
    planId: string;
    amount: number;
  }) {
    return this.request('/investments/create', {
      method: 'POST',
      body: JSON.stringify(investmentData),
    });
  }

  async getMyInvestments(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return this.request(`/investments/my?${queryParams}`);
  }

  async getInvestment(id: string) {
    return this.request(`/investments/${id}`);
  }

  // Task endpoints
  async getTasks(params?: {
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return this.request(`/tasks?${queryParams}`);
  }

  async createTask(taskData: {
    title: string;
    description: string;
    type: string;
    points: number;
    requirements: string[];
  }) {
    return this.request('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  async completeTask(id: string) {
    return this.request(`/tasks/${id}/complete`, {
      method: 'POST',
    });
  }

  async getTask(id: string) {
    return this.request(`/tasks/${id}`);
  }

  // Notification endpoints
  async getNotifications(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return this.request(`/notifications?${queryParams}`);
  }

  async markNotificationAsRead(id: string) {
    return this.request(`/notifications/${id}/read`, {
      method: 'PUT',
    });
  }

  async markAllNotificationsAsRead() {
    return this.request('/notifications/read-all', {
      method: 'PUT',
    });
  }

  // Admin endpoints
  async getDashboardStats() {
    return this.request('/admin/dashboard');
  }

  async getUsers(params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return this.request(`/admin/users?${queryParams}`);
  }

  async updateUser(id: string, userData: {
    status?: string;
    isInvestor?: boolean;
  }) {
    return this.request(`/admin/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: string) {
    return this.request(`/admin/users/${id}`, {
      method: 'DELETE',
    });
  }

  async getAdminTransactions(params?: {
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return this.request(`/admin/transactions?${queryParams}`);
  }

  async approveTransaction(id: string) {
    return this.request(`/admin/transactions/${id}/approve`, {
      method: 'PUT',
    });
  }

  async rejectTransaction(id: string, reason: string) {
    return this.request(`/admin/transactions/${id}/reject`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    });
  }

  async getAdminInvestments(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return this.request(`/admin/investments?${queryParams}`);
  }

  async getAdminInvestmentPlans() {
    return this.request('/admin/investment-plans');
  }

  async getAdminTasks(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    return this.request(`/admin/tasks?${queryParams}`);
  }

  async approveTaskExecution(id: string) {
    return this.request(`/admin/task-executions/${id}/approve`, {
      method: 'PUT',
    });
  }

  async rejectTaskExecution(id: string, reason: string) {
    return this.request(`/admin/task-executions/${id}/reject`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    });
  }
}

export const apiService = new ApiService();
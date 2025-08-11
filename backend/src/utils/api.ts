const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiService {
  private getHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const response = await fetch(url, {
        ...options,
        headers: this.getHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Une erreur est survenue');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur réseau',
      };
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
    phone: string;
    password: string;
    referralCode: string;
    firstName: string;
    lastName: string;
  }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async adminLogin(credentials: { username: string; password: string }) {
    return this.request('/admin/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // User endpoints
  async getUserProfile() {
    return this.request('/user/profile');
  }

  async updateUserProfile(profileData: any) {
    return this.request('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async changePassword(passwords: {
    currentPassword: string;
    newPassword: string;
  }) {
    return this.request('/user/change-password', {
      method: 'POST',
      body: JSON.stringify(passwords),
    });
  }

  // Transaction endpoints
  async createDeposit(depositData: {
    amount: number;
    currency: 'ar' | 'usdt';
    method: string;
    proofImage: File;
  }) {
    const formData = new FormData();
    formData.append('amount', depositData.amount.toString());
    formData.append('currency', depositData.currency);
    formData.append('method', depositData.method);
    formData.append('proofImage', depositData.proofImage);

    return this.request('/transactions/deposit', {
      method: 'POST',
      headers: {}, // Let browser set Content-Type for FormData
      body: formData,
    });
  }

  async createWithdrawal(withdrawalData: {
    amount: number;
    currency: 'ar' | 'usdt';
    method: string;
    accountDetails: string;
    withdrawalPassword: string;
  }) {
    return this.request('/transactions/withdrawal', {
      method: 'POST',
      body: JSON.stringify(withdrawalData),
    });
  }

  async getTransactionHistory(filters?: {
    type?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const params = new URLSearchParams(filters as any);
    return this.request(`/transactions/history?${params}`);
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

  async getActiveInvestments() {
    return this.request('/investments/active');
  }

  // Points endpoints
  async buyPoints(pointsData: {
    amount: number;
    currency: 'ar' | 'usdt';
  }) {
    return this.request('/points/buy', {
      method: 'POST',
      body: JSON.stringify(pointsData),
    });
  }

  async exchangePoints(exchangeData: {
    points: number;
    currency: 'ar' | 'usdt';
  }) {
    return this.request('/points/exchange', {
      method: 'POST',
      body: JSON.stringify(exchangeData),
    });
  }

  // Tasks endpoints
  async getTasks(filters?: {
    status?: string;
    type?: string;
  }) {
    const params = new URLSearchParams(filters as any);
    return this.request(`/tasks?${params}`);
  }

  async createTask(taskData: {
    title: string;
    description: string;
    points: number;
    type: string;
    requirements: string[];
  }) {
    return this.request('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  async completeTask(taskId: string, proof: File) {
    const formData = new FormData();
    formData.append('proof', proof);

    return this.request(`/tasks/${taskId}/complete`, {
      method: 'POST',
      headers: {},
      body: formData,
    });
  }

  // Team endpoints
  async getTeamMembers() {
    return this.request('/team/members');
  }

  async getReferralStats() {
    return this.request('/team/stats');
  }

  // Admin endpoints
  async getAdminStats() {
    return this.request('/admin/stats');
  }

  async getUsers(filters?: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const params = new URLSearchParams(filters as any);
    return this.request(`/admin/users?${params}`);
  }

  async updateUserStatus(userId: string, status: string) {
    return this.request(`/admin/users/${userId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async approveDeposit(depositId: string) {
    return this.request(`/admin/deposits/${depositId}/approve`, {
      method: 'POST',
    });
  }

  async rejectDeposit(depositId: string, reason: string) {
    return this.request(`/admin/deposits/${depositId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  async approveWithdrawal(withdrawalId: string) {
    return this.request(`/admin/withdrawals/${withdrawalId}/approve`, {
      method: 'POST',
    });
  }

  async rejectWithdrawal(withdrawalId: string, reason: string) {
    return this.request(`/admin/withdrawals/${withdrawalId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  async getSystemLogs(filters?: {
    level?: string;
    category?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const params = new URLSearchParams(filters as any);
    return this.request(`/admin/logs?${params}`);
  }

  async sendNotification(notificationData: {
    title: string;
    message: string;
    type: string;
    target: string;
  }) {
    return this.request('/admin/notifications/send', {
      method: 'POST',
      body: JSON.stringify(notificationData),
    });
  }

  async getReports(filters?: {
    period?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const params = new URLSearchParams(filters as any);
    return this.request(`/admin/reports?${params}`);
  }
}

export const apiService = new ApiService();
// User types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  referralCode: string;
  referredBy?: string;
  status: 'active' | 'inactive' | 'suspended' | 'banned';
  isInvestor: boolean;
  balanceAr: number;
  balanceUsdt: number;
  pointsBalance: number;
  totalInvested: number;
  totalEarned: number;
  totalWithdrawn: number;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  profileImage?: string;
  withdrawalPassword?: string;
  twoFactorEnabled: boolean;
  preferences: {
    language: 'fr' | 'en' | 'mg';
    currency: 'ar' | 'usdt';
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
  };
}

// Transaction types
export interface Transaction {
  id: string;
  userId: string;
  userName?: string;
  type: 'deposit' | 'withdrawal' | 'investment' | 'commission' | 'bonus' | 'points_exchange' | 'points_purchase';
  currency: 'ar' | 'usdt' | 'points';
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  method?: string;
  proofImage?: string;
  reference?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  approvedBy?: string;
  approvedAt?: Date;
  rejectionReason?: string;
  rejectedBy?: string;
  rejectedAt?: Date;
}

// Investment types
export interface InvestmentPlan {
  id: string;
  name: string;
  description: string;
  minAmount: number;
  maxAmount: number;
  dailyReturn: number;
  duration: number;
  totalReturn: number;
  features: string[];
  isPopular: boolean;
  isRecommended: boolean;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface Investment {
  id: string;
  userId: string;
  planId: string;
  plan: InvestmentPlan;
  amount: number;
  dailyReturn: number;
  totalReturn: number;
  duration: number;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'completed' | 'cancelled';
  totalEarned: number;
  lastPayoutDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Task types
export interface Task {
  id: string;
  creatorId: string;
  creator?: User;
  title: string;
  description: string;
  type: 'social_media' | 'survey' | 'referral' | 'content' | 'other';
  points: number;
  requirements: string[];
  status: 'active' | 'inactive' | 'completed';
  maxExecutions: number;
  currentExecutions: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskExecution {
  id: string;
  taskId: string;
  task: Task;
  executorId: string;
  executor: User;
  proofImage?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
  reviewedAt?: Date;
  approvedBy?: string;
  approvedAt?: Date;
  rejectionReason?: string;
  rejectedBy?: string;
  rejectedAt?: Date;
}

// Team types
export interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  status: 'active' | 'inactive';
  isInvestor: boolean;
  totalInvested: number;
  totalEarned: number;
  createdAt: Date;
  level: number;
}

export interface ReferralStats {
  totalReferrals: number;
  activeReferrals: number;
  totalCommissions: number;
  level1Referrals: TeamMember[];
  level2Referrals: TeamMember[];
  level3Referrals: TeamMember[];
}

// Admin types
export interface Admin {
  id: string;
  username: string;
  email: string;
  role: 'super_admin' | 'admin' | 'moderator';
  permissions: string[];
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminLog {
  id: string;
  adminId: string;
  admin: Admin;
  action: string;
  target: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
}

// System types
export interface SystemSettings {
  id: string;
  currenciesAr: boolean;
  currenciesUsdt: boolean;
  arToUsdtRate: number;
  usdtToArRate: number;
  pointsToArInvestor: number;
  pointsToArNonInvestor: number;
  minDepositAr: number;
  minDepositUsdt: number;
  minWithdrawalAr: number;
  minWithdrawalUsdt: number;
  withdrawalFee: number;
  depositsValidation: 'manual' | 'automatic';
  withdrawalsValidation: 'manual' | 'automatic';
  pointsExchangeValidation: 'manual' | 'automatic';
  tasksValidation: 'manual' | 'automatic';
  emailNotifications: boolean;
  whatsappNotifications: boolean;
  inAppNotifications: boolean;
  updatedAt: Date;
}

export interface PlatformStats {
  totalUsers: number;
  activeUsers: number;
  totalInvestments: number;
  totalBalanceAr: number;
  totalBalanceUsdt: number;
  pendingTransactions: number;
  completedTransactions: number;
  totalCommissions: number;
  totalTasks: number;
  completedTasks: number;
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'system' | 'user' | 'transaction' | 'security';
  status: 'unread' | 'read';
  readAt?: Date;
  createdAt: Date;
}

// Report types
export interface Report {
  id: string;
  title: string;
  description: string;
  type: 'financial' | 'user' | 'transaction' | 'investment' | 'task';
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  data: any;
  createdAt: Date;
}

// Payment method types
export interface PaymentMethod {
  id: string;
  name: string;
  type: 'mobile_money' | 'bank' | 'crypto';
  currency: 'ar' | 'usdt';
  minAmount: number;
  maxAmount: number;
  fee: number;
  processingTime: string;
  status: 'active' | 'inactive';
}

// Agent types
export interface Agent {
  id: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  status: 'active' | 'inactive';
  commission: number;
  totalTransactions: number;
  totalAmount: number;
  createdAt: Date;
}

// FAQ types
export interface FAQCategory {
  id: string;
  name: string;
  description: string;
  questions: FAQQuestion[];
}

export interface FAQQuestion {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  createdAt: Date;
}

// Form types
export interface LoginForm {
  phone: string;
  password: string;
}

export interface RegisterForm {
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  referralCode?: string;
}

export interface DepositForm {
  amount: number;
  currency: 'ar' | 'usdt';
  method: string;
  proofImage?: File;
}

export interface WithdrawalForm {
  amount: number;
  currency: 'ar' | 'usdt';
  method: string;
  accountDetails: string;
  withdrawalPassword: string;
}

export interface InvestmentForm {
  planId: string;
  amount: number;
}

export interface PointsForm {
  action: 'buy' | 'exchange';
  amount: number;
  currency: 'ar' | 'usdt';
}

export interface TaskForm {
  title: string;
  description: string;
  type: 'social_media' | 'survey' | 'referral' | 'content' | 'other';
  points: number;
  requirements: string[];
  maxExecutions: number;
}

// API types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  details?: any;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Filter types
export interface TransactionFilter {
  type?: string;
  status?: string;
  currency?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

export interface UserFilter {
  status?: string;
  isInvestor?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export interface TaskFilter {
  type?: string;
  status?: string;
  page?: number;
  limit?: number;
}

// Chart types
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }[];
}

// Export types
export interface ExportOptions {
  format: 'pdf' | 'excel' | 'csv';
  dateRange?: {
    start: Date;
    end: Date;
  };
  filters?: any;
}
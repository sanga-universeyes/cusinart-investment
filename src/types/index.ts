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
  balance: {
    ar: number;
    usdt: number;
    points: number;
  };
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
  isPopular?: boolean;
  isRecommended?: boolean;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface Investment {
  id: string;
  userId: string;
  planId: string;
  planName: string;
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
  creatorName: string;
  title: string;
  description: string;
  type: 'social_media' | 'survey' | 'referral' | 'content' | 'other';
  points: number;
  requirements: string[];
  status: 'active' | 'completed' | 'pending' | 'rejected';
  proofImage?: string;
  completedBy?: string;
  completedAt?: Date;
  approvedBy?: string;
  approvedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Team/Referral types
export interface TeamMember {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  level: 1 | 2 | 3;
  status: 'active' | 'inactive';
  totalInvested: number;
  totalEarned: number;
  commissionEarned: number;
  joinedAt: Date;
  lastActivityAt?: Date;
}

export interface ReferralStats {
  totalReferrals: number;
  activeReferrals: number;
  totalCommissionEarned: number;
  level1Referrals: number;
  level2Referrals: number;
  level3Referrals: number;
  level1Commission: number;
  level2Commission: number;
  level3Commission: number;
}

// Admin types
export interface Admin {
  id: string;
  username: string;
  email: string;
  role: 'super_admin' | 'admin' | 'moderator';
  permissions: string[];
  lastLoginAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminLog {
  id: string;
  adminId: string;
  adminUsername: string;
  action: string;
  target: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
}

export interface SystemSettings {
  currencies: {
    ar: boolean;
    usdt: boolean;
  };
  exchangeRates: {
    arToUsdt: number;
    usdtToAr: number;
    pointsToArInvestor: number;
    pointsToArNonInvestor: number;
  };
  limits: {
    minDeposit: { ar: number; usdt: number };
    minWithdrawal: { ar: number; usdt: number };
    withdrawalFee: number;
  };
  validation: {
    deposits: 'manual' | 'automatic';
    withdrawals: 'manual' | 'automatic';
    pointsExchange: 'manual' | 'automatic';
    tasks: 'manual' | 'automatic';
  };
  notifications: {
    email: boolean;
    whatsapp: boolean;
    inApp: boolean;
  };
}

export interface PlatformStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalInvestments: number;
  totalBalance: number;
  pendingWithdrawals: number;
  pendingDeposits: number;
  pendingPointsExchange: number;
}

// Notification types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'system' | 'user' | 'transaction' | 'security';
  target: 'all' | 'investors' | 'non_investors' | 'specific';
  targetUsers?: string[];
  status: 'draft' | 'sent' | 'failed';
  sentAt?: Date;
  readCount: number;
  totalRecipients: number;
  createdAt: Date;
  createdBy: string;
}

// Report types
export interface Report {
  id: string;
  type: 'users' | 'transactions' | 'investments' | 'commissions' | 'tasks';
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: Date;
  endDate: Date;
  data: any;
  generatedAt: Date;
  generatedBy: string;
}

// Payment method types
export interface PaymentMethod {
  id: string;
  name: string;
  code: string;
  type: 'mobile_money' | 'crypto' | 'bank';
  icon: string;
  color: string;
  minAmount: number;
  maxAmount: number;
  fees: number;
  status: 'active' | 'inactive';
  instructions?: string;
}

// Agent types
export interface Agent {
  id: string;
  name: string;
  phone: string;
  email?: string;
  region: string;
  methods: string[];
  status: 'active' | 'inactive';
  totalTransactions: number;
  rating: number;
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
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
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
  confirmPassword: string;
  referralCode: string;
}

export interface DepositForm {
  amount: number;
  currency: 'ar' | 'usdt';
  method: string;
  proofImage: File;
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
  amount: number;
  currency: 'ar' | 'usdt';
}

export interface TaskForm {
  title: string;
  description: string;
  points: number;
  type: string;
  requirements: string[];
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
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
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface UserFilter {
  status?: string;
  isInvestor?: boolean;
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface TaskFilter {
  type?: string;
  status?: string;
  creatorId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}

// Chart types
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}

// Export types
export interface ExportOptions {
  format: 'pdf' | 'excel' | 'csv' | 'json';
  filters?: any;
  includeHeaders?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
}
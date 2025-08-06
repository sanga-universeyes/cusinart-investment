export interface User {
  id: string;
  phone: string;
  email?: string;
  firstName: string;
  lastName: string;
  referralCode: string;
  referredBy?: string;
  profilePicture?: string;
  balanceAr: number;
  balanceUsdt: number;
  pointsBalance: number;
  withdrawPassword?: string;
  language: 'mg' | 'fr' | 'en';
  status: 'active' | 'suspended' | 'pending';
  isInvestor: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'deposit' | 'withdrawal' | 'investment' | 'commission' | 'bonus' | 'points_exchange' | 'points_purchase';
  currency: 'ar' | 'usdt' | 'points';
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  method?: string;
  proofImage?: string;
  agentId?: string;
  planId?: string;
  reference?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InvestmentPlan {
  id: string;
  name: string;
  minAmount: number;
  maxAmount: number;
  minAddition: number;
  dailyReturn: number;
  duration: number;
  currency: 'ar' | 'usdt';
  status: 'active' | 'inactive';
  referralCommission: {
    level1: number;
    level2: number;
    level3: number;
  };
  teamCommission: {
    level1: number;
    level2: number;
    level3: number;
  };
}

export interface Investment {
  id: string;
  userId: string;
  planId: string;
  amount: number;
  currency: 'ar' | 'usdt';
  dailyReturn: number;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'completed' | 'cancelled';
  totalEarned: number;
  lastPaidDate?: Date;
}

export interface Agent {
  id: string;
  name: string;
  phone: string;
  method: 'mvola' | 'airtel' | 'orange' | 'usdt';
  status: 'active' | 'inactive';
}

export interface MicroTask {
  id: string;
  creatorId: string;
  title: string;
  description: string;
  url: string;
  type: 'like' | 'subscribe' | 'watch' | 'follow' | 'register';
  pointsReward: number;
  maxExecutions: number;
  currentExecutions: number;
  validationType: 'automatic' | 'manual';
  status: 'active' | 'inactive' | 'completed';
  createdAt: Date;
}

export interface TaskExecution {
  id: string;
  taskId: string;
  executorId: string;
  proofImage?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
}

export interface Commission {
  id: string;
  userId: string;
  fromUserId: string;
  type: 'referral' | 'team' | 'daily';
  level: number;
  percentage: number;
  amount: number;
  currency: 'ar' | 'usdt';
  transactionId?: string;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'deposit' | 'withdrawal' | 'investment' | 'commission' | 'points';
  title: string;
  message: string;
  status: 'success' | 'pending' | 'failed';
  amount?: number;
  currency?: 'ar' | 'usdt' | 'points';
  reference?: string;
  createdAt: Date;
  read: boolean;
}
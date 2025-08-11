export interface Admin {
  id: string;
  fullName: string;
  email: string;
  whatsapp: string;
  username: string;
  role: 'super_admin' | 'admin' | 'moderator' | 'support' | 'finance' | 'auditor';
  status: 'active' | 'inactive' | 'pending';
  createdAt: Date;
  lastLogin?: Date;
  permissions: string[];
}

export interface AdminLog {
  id: string;
  adminId: string;
  action: string;
  target: string;
  details: string;
  ip: string;
  timestamp: Date;
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
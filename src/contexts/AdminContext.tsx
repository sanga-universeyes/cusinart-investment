import React, { createContext, useContext, useState, useEffect } from 'react';
import { Admin, AdminLog, SystemSettings, PlatformStats } from '../types/admin';
import { User, Transaction } from '../types';

interface AdminContextType {
  admin: Admin | null;
  loginAdmin: (username: string, password: string) => Promise<void>;
  logoutAdmin: () => void;
  loading: boolean;
  
  // Stats
  stats: PlatformStats;
  
  // Users Management
  users: User[];
  updateUser: (userId: string, updates: Partial<User>) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  suspendUser: (userId: string, reason: string) => Promise<void>;
  addFunds: (userId: string, amount: number, currency: 'ar' | 'usdt', reason: string) => Promise<void>;
  
  // Transactions
  transactions: Transaction[];
  approveTransaction: (transactionId: string) => Promise<void>;
  rejectTransaction: (transactionId: string, reason: string) => Promise<void>;
  
  // System Settings
  settings: SystemSettings;
  updateSettings: (updates: Partial<SystemSettings>) => Promise<void>;
  
  // Logs
  logs: AdminLog[];
  addLog: (action: string, target: string, details: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [logs, setLogs] = useState<AdminLog[]>([]);
  
  // Mock stats - in real app, fetch from API
  const [stats] = useState<PlatformStats>({
    totalUsers: 1250,
    activeUsers: 890,
    inactiveUsers: 360,
    totalInvestments: 45000000,
    totalBalance: 12500000,
    pendingWithdrawals: 850000,
    pendingDeposits: 1200000,
    pendingPointsExchange: 45000
  });

  // Mock settings
  const [settings, setSettings] = useState<SystemSettings>({
    currencies: { ar: true, usdt: true },
    exchangeRates: {
      arToUsdt: 0.0002,
      usdtToAr: 5000,
      pointsToArInvestor: 100,
      pointsToArNonInvestor: 10
    },
    limits: {
      minDeposit: { ar: 10000, usdt: 2 },
      minWithdrawal: { ar: 4800, usdt: 1 },
      withdrawalFee: 0.1
    },
    validation: {
      deposits: 'manual',
      withdrawals: 'manual',
      pointsExchange: 'manual',
      tasks: 'manual'
    },
    notifications: {
      email: true,
      whatsapp: true,
      inApp: true
    }
  });

  useEffect(() => {
    // Check if admin is logged in
    const storedAdmin = localStorage.getItem('admin');
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
    setLoading(false);
  }, []);

  const loginAdmin = async (username: string, password: string) => {
    try {
      setLoading(true);
      
      // Mock admin login - replace with real API
      const mockAdmin: Admin = {
        id: '1',
        fullName: 'Super Administrateur',
        email: 'admin@cuisinart-investa.com',
        whatsapp: '+261346953881',
        username,
        role: 'super_admin',
        status: 'active',
        createdAt: new Date(),
        lastLogin: new Date(),
        permissions: ['all']
      };
      
      setAdmin(mockAdmin);
      localStorage.setItem('admin', JSON.stringify(mockAdmin));
      
      addLog('login', 'system', 'Connexion administrateur réussie');
    } catch (error) {
      throw new Error('Erreur de connexion administrateur');
    } finally {
      setLoading(false);
    }
  };

  const logoutAdmin = () => {
    if (admin) {
      addLog('logout', 'system', 'Déconnexion administrateur');
    }
    setAdmin(null);
    localStorage.removeItem('admin');
  };

  const updateUser = async (userId: string, updates: Partial<User>) => {
    // Mock implementation
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, ...updates } : user
    ));
    addLog('update_user', userId, `Utilisateur modifié: ${Object.keys(updates).join(', ')}`);
  };

  const deleteUser = async (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
    addLog('delete_user', userId, 'Utilisateur supprimé');
  };

  const suspendUser = async (userId: string, reason: string) => {
    await updateUser(userId, { status: 'suspended' });
    addLog('suspend_user', userId, `Utilisateur suspendu: ${reason}`);
  };

  const addFunds = async (userId: string, amount: number, currency: 'ar' | 'usdt', reason: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      const updates = currency === 'ar' 
        ? { balanceAr: user.balanceAr + amount }
        : { balanceUsdt: user.balanceUsdt + amount };
      
      await updateUser(userId, updates);
      addLog('add_funds', userId, `Fonds ajoutés: ${amount} ${currency.toUpperCase()} - ${reason}`);
    }
  };

  const approveTransaction = async (transactionId: string) => {
    setTransactions(prev => prev.map(tx => 
      tx.id === transactionId ? { ...tx, status: 'completed' } : tx
    ));
    addLog('approve_transaction', transactionId, 'Transaction approuvée');
  };

  const rejectTransaction = async (transactionId: string, reason: string) => {
    setTransactions(prev => prev.map(tx => 
      tx.id === transactionId ? { ...tx, status: 'failed' } : tx
    ));
    addLog('reject_transaction', transactionId, `Transaction rejetée: ${reason}`);
  };

  const updateSettings = async (updates: Partial<SystemSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
    addLog('update_settings', 'system', `Paramètres modifiés: ${Object.keys(updates).join(', ')}`);
  };

  const addLog = (action: string, target: string, details: string) => {
    if (!admin) return;
    
    const log: AdminLog = {
      id: Date.now().toString(),
      adminId: admin.id,
      action,
      target,
      details,
      ip: '127.0.0.1', // Mock IP
      timestamp: new Date()
    };
    
    setLogs(prev => [log, ...prev].slice(0, 1000)); // Keep last 1000 logs
  };

  const value = {
    admin,
    loginAdmin,
    logoutAdmin,
    loading,
    stats,
    users,
    updateUser,
    deleteUser,
    suspendUser,
    addFunds,
    transactions,
    approveTransaction,
    rejectTransaction,
    settings,
    updateSettings,
    logs,
    addLog
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}
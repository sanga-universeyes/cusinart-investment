import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { generateReferralCode, ensureUniqueReferralCode } from '../utils/referral';
import { EXCHANGE_RATES } from '../config/constants';

interface AuthContextType {
  user: User | null;
  login: (phone: string, password: string) => Promise<void>;
  register: (userData: Partial<User> & { password: string }) => Promise<void>;
  logout: () => void;
  loading: boolean;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté au chargement
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (phone: string, password: string) => {
    try {
      setLoading(true);
      // TODO: Implémenter l'authentification réelle avec Supabase
      
      // Simulation pour le développement
      const referralCode = generateReferralCode(phone);
      const mockUser: User = {
        id: '1',
        phone,
        firstName: 'John',
        lastName: 'Doe',
        referralCode,
        balanceAr: 50000,
        balanceUsdt: 25.50,
        pointsBalance: 1500,
        language: 'fr',
        status: 'active',
        isInvestor: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      throw new Error('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: Partial<User> & { password: string }) => {
    try {
      setLoading(true);
      // TODO: Implémenter l'inscription réelle avec Supabase
      
      // Génération du code de parrainage
      const referralCode = generateReferralCode(userData.phone || '');
      // TODO: Vérifier l'unicité avec la base de données
      const uniqueReferralCode = ensureUniqueReferralCode(referralCode, []);
      
      const newUser: User = {
        id: Date.now().toString(),
        phone: userData.phone!,
        email: userData.email,
        firstName: userData.firstName!,
        lastName: userData.lastName!,
        referralCode: uniqueReferralCode,
        referredBy: userData.referredBy,
        balanceAr: EXCHANGE_RATES.SIGNUP_BONUS_AR, // Bonus d'inscription
        balanceUsdt: 0,
        pointsBalance: 1000, // Bonus de points
        language: 'fr',
        status: 'active',
        isInvestor: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    } catch (error) {
      throw new Error('Erreur d\'inscription');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates, updatedAt: new Date() };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Admin } from '../types';
import { apiService } from '../utils/api';

interface AuthContextType {
  user: User | null;
  admin: Admin | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (phone: string, password: string) => Promise<void>;
  adminLogin: (username: string, password: string) => Promise<void>;
  register: (userData: {
    firstName: string;
    lastName: string;
    phone: string;
    password: string;
    referralCode?: string;
  }) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user || !!admin;
  const isAdmin = !!admin;

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const userData = localStorage.getItem('userData');
        const adminData = localStorage.getItem('adminData');

        if (token) {
          if (userData) {
            setUser(JSON.parse(userData));
          } else if (adminData) {
            setAdmin(JSON.parse(adminData));
          } else {
            // Token exists but no user data, try to get profile
            try {
              const response = await apiService.getProfile();
              if (response.success && response.data?.user) {
                setUser(response.data.user);
                localStorage.setItem('userData', JSON.stringify(response.data.user));
              }
            } catch (error) {
              console.error('Failed to get user profile:', error);
              logout();
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (phone: string, password: string) => {
    try {
      const response = await apiService.login({ phone, password });
      
      if (response.success && response.data) {
        const { user: userData, accessToken, refreshToken } = response.data;
        
        setUser(userData);
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.removeItem('adminData');
      } else {
        throw new Error(response.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const adminLogin = async (username: string, password: string) => {
    try {
      const response = await apiService.adminLogin({ username, password });
      
      if (response.success && response.data) {
        const { admin: adminData, accessToken, refreshToken } = response.data;
        
        setAdmin(adminData);
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('adminData', JSON.stringify(adminData));
        localStorage.removeItem('userData');
      } else {
        throw new Error(response.error || 'Admin login failed');
      }
    } catch (error) {
      console.error('Admin login error:', error);
      throw error;
    }
  };

  const register = async (userData: {
    firstName: string;
    lastName: string;
    phone: string;
    password: string;
    referralCode?: string;
  }) => {
    try {
      const response = await apiService.register(userData);
      
      if (response.success && response.data) {
        const { user: newUser, accessToken, refreshToken } = response.data;
        
        setUser(newUser);
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('userData', JSON.stringify(newUser));
        localStorage.removeItem('adminData');
      } else {
        throw new Error(response.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setAdmin(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('adminData');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('userData', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    admin,
    isAuthenticated,
    isAdmin,
    isLoading,
    login,
    adminLogin,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
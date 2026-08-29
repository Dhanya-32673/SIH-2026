import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService, apiClient } from '../services/api';

interface AuthContextType {
  isAuthenticated: boolean;
  user: { email?: string; phoneNumber?: string } | null;
  loading: boolean;
  sendEmailOtp: (email: string) => Promise<{ success: boolean; message: string }>;
  verifyEmailOtp: (email: string, otp: string) => Promise<{ success: boolean; message: string }>;
  sendPhoneOtp: (phoneNumber: string) => Promise<{ success: boolean; message: string }>;
  verifyPhoneOtp: (phoneNumber: string, otp: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<{ email?: string; phoneNumber?: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('sih_health_user');
    const authState = localStorage.getItem('sih_health_auth');
    if (savedUser && authState === 'true') {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const sendEmailOtp = async (email: string) => {
    const res = await apiClient.post('/api/auth/send-email-otp', { email });
    return res.data;
  };

  const verifyEmailOtp = async (email: string, otp: string) => {
    const res = await apiClient.post('/api/auth/verify-email-otp', { email, otp });
    if (res.data.success) {
      const userData = { email };
      localStorage.setItem('sih_health_user', JSON.stringify(userData));
      localStorage.setItem('sih_health_auth', 'true');
      setUser(userData);
      setIsAuthenticated(true);
    }
    return res.data;
  };

  const sendPhoneOtp = async (phoneNumber: string) => {
    const res = await apiClient.post('/api/auth/send-phone-otp', { phoneNumber });
    return res.data;
  };

  const verifyPhoneOtp = async (phoneNumber: string, otp: string) => {
    const res = await apiClient.post('/api/auth/verify-phone-otp', { phoneNumber, otp });
    if (res.data.success) {
      const userData = { phoneNumber };
      localStorage.setItem('sih_health_user', JSON.stringify(userData));
      localStorage.setItem('sih_health_auth', 'true');
      setUser(userData);
      setIsAuthenticated(true);
    }
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('sih_health_user');
    localStorage.removeItem('sih_health_auth');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        sendEmailOtp,
        verifyEmailOtp,
        sendPhoneOtp,
        verifyPhoneOtp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../services/api';

interface UserProfile {
  id?: string;
  email?: string;
  phoneNumber?: string;
  type?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: UserProfile | null;
  loading: boolean;
  sendEmailOtp: (email: string) => Promise<{ success: boolean; message: string }>;
  verifyEmailOtp: (email: string, otp: string) => Promise<{ success: boolean; message: string; token?: string }>;
  sendPhoneOtp: (phoneNumber: string) => Promise<{ success: boolean; message: string }>;
  verifyPhoneOtp: (phoneNumber: string, otp: string) => Promise<{ success: boolean; message: string; token?: string }>;
  loginDirect: (identifier: string) => Promise<{ success: boolean; message: string; token?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Validate existing session on application start
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('sih_health_token');
      const savedUser = localStorage.getItem('sih_health_user');

      if (savedToken) {
        setToken(savedToken);
        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser));
          } catch {
            setUser(null);
          }
        }
        setIsAuthenticated(true);

        // Optionally verify token with backend in background
        try {
          const res = await apiClient.get('/api/auth/me', {
            headers: { Authorization: `Bearer ${savedToken}` },
          });
          if (res.data?.user) {
            setUser(res.data.user);
          }
        } catch (err: any) {
          if (err.response?.status === 401) {
            // Token is expired or invalid
            logout();
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const setAuthSession = (authToken: string, userData: UserProfile) => {
    localStorage.setItem('sih_health_token', authToken);
    localStorage.setItem('sih_health_user', JSON.stringify(userData));
    localStorage.setItem('sih_health_auth', 'true');
    setToken(authToken);
    setUser(userData);
    setIsAuthenticated(true);
  };

  const sendEmailOtp = async (email: string) => {
    const res = await apiClient.post('/api/auth/send-email-otp', { email });
    return res.data;
  };

  const verifyEmailOtp = async (email: string, otp: string) => {
    const res = await apiClient.post('/api/auth/verify-email-otp', { email, otp });
    if (res.data.success && (res.data.token || res.data.access_token)) {
      const authToken = res.data.token || res.data.access_token;
      const userData = res.data.user || { email, id: email, type: 'email' };
      setAuthSession(authToken, userData);
    }
    return res.data;
  };

  const sendPhoneOtp = async (phoneNumber: string) => {
    const res = await apiClient.post('/api/auth/send-phone-otp', { phoneNumber });
    return res.data;
  };

  const verifyPhoneOtp = async (phoneNumber: string, otp: string) => {
    const res = await apiClient.post('/api/auth/verify-phone-otp', { phoneNumber, otp });
    if (res.data.success && (res.data.token || res.data.access_token)) {
      const authToken = res.data.token || res.data.access_token;
      const userData = res.data.user || { phoneNumber, id: phoneNumber, type: 'phone' };
      setAuthSession(authToken, userData);
    }
    return res.data;
  };

  const loginDirect = async (identifier: string) => {
    const res = await apiClient.post('/api/auth/login', { usernameOrEmail: identifier });
    if (res.data.success && (res.data.token || res.data.access_token)) {
      const authToken = res.data.token || res.data.access_token;
      const userData = res.data.user || { id: identifier };
      setAuthSession(authToken, userData);
    }
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('sih_health_token');
    localStorage.removeItem('sih_health_user');
    localStorage.removeItem('sih_health_auth');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        token,
        user,
        loading,
        sendEmailOtp,
        verifyEmailOtp,
        sendPhoneOtp,
        verifyPhoneOtp,
        loginDirect,
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

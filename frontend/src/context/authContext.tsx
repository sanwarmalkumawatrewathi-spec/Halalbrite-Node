"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  _id: string;
  username: string;
  email: string;
  roles: string[];
  token: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  socialSettings: any;
  login: (email: string, password: string) => Promise<any>;
  register: (userData: any) => Promise<any>;
  logout: () => void;
  socialLogin: (provider: string, data: any) => Promise<any>;
  isOrganizer: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [socialSettings, setSocialSettings] = useState<any>(null);
  const router = useRouter();

  const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');

  useEffect(() => {
    const savedUser = localStorage.getItem('halalbrite_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    fetchSocialSettings();
    setLoading(false);
  }, []);

  const fetchSocialSettings = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/settings/public`, {
        headers: { 'Accept': 'application/json' }
      });
      if (response.ok) {
        const result = await response.json();
        if (result.data && result.data.socialLogin) {
          setSocialSettings(result.data.socialLogin);
        }
      }
    } catch (error) {
      console.error('Failed to fetch social settings:', error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data);
        localStorage.setItem('halalbrite_user', JSON.stringify(data));
        localStorage.setItem('token', data.token);
        return { success: true, data };
      } else {
        return { success: false, message: data.message || 'Login failed' };
      }
    } catch (error: any) {
      return { success: false, message: error.message || 'An error occurred' };
    }
  };

  const register = async (userData: any) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        // Backend returns data in data property for register
        const userObj = data.data;
        setUser(userObj);
        localStorage.setItem('halalbrite_user', JSON.stringify(userObj));
        localStorage.setItem('token', userObj.token);
        return { success: true, data: userObj };
      } else {
        return { success: false, message: data.message || 'Registration failed' };
      }
    } catch (error: any) {
      return { success: false, message: error.message || 'An error occurred' };
    }
  };

  const socialLogin = async (provider: string, payload: any) => {
    try {
      const endpoint = provider === 'google' ? '/api/auth/google' : 
                       provider === 'meta' ? '/api/auth/facebook' : 
                       provider === 'apple' ? '/api/auth/apple' : '/api/auth/social-login';
      
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data);
        localStorage.setItem('halalbrite_user', JSON.stringify(data));
        localStorage.setItem('token', data.token);
        return { success: true, data };
      } else {
        return { success: false, message: data.message || 'Social login failed' };
      }
    } catch (error: any) {
      return { success: false, message: error.message || 'An error occurred' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('halalbrite_user');
    localStorage.removeItem('token');
    router.push('/');
  };

  const isOrganizer = user?.roles.includes('organizer') || user?.roles.includes('organiser') || false;

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, socialLogin, isOrganizer, socialSettings }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

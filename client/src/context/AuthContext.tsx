import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/client';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  demoLogin: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  demoLogin: async () => {},
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('glownest_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('glownest_token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.data);
            localStorage.setItem('glownest_user', JSON.stringify(res.data.data));
          }
        } catch {
          setUser(null);
          localStorage.removeItem('glownest_token');
          localStorage.removeItem('glownest_user');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      const { user, accessToken } = res.data.data;
      setUser(user);
      localStorage.setItem('glownest_token', accessToken);
      localStorage.setItem('glownest_user', JSON.stringify(user));
    }
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await api.post('/auth/register', { name, email, password });
    if (res.data.success) {
      const { user, accessToken } = res.data.data;
      setUser(user);
      localStorage.setItem('glownest_token', accessToken);
      localStorage.setItem('glownest_user', JSON.stringify(user));
    }
  };

  const demoLogin = async () => {
    return login('demo@glownest.com', 'Password123!');
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore
    }
    setUser(null);
    localStorage.removeItem('glownest_token');
    localStorage.removeItem('glownest_user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, demoLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


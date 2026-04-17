import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
const TOKEN_KEY = 'campuscore_auth_token';
const USER_KEY = 'campuscore_auth_user';

const AuthContext = createContext(null);

const readStoredUser = () => {
  try {
    const value = localStorage.getItem(USER_KEY);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

const normalizeUser = (payload) => {
  if (!payload) {
    return null;
  }

  return {
    userId: payload.userId || '',
    fullName: payload.fullName || '',
    email: payload.email || '',
    role: payload.role || '',
    redirectPath: payload.redirectPath || '/',
  };
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '');
  const [user, setUser] = useState(() => readStoredUser());
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common.Authorization;
    }
  }, [token]);

  useEffect(() => {
    const bootstrap = async () => {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedUser = readStoredUser();

      if (storedToken) {
        axios.defaults.headers.common.Authorization = `Bearer ${storedToken}`;
        setToken(storedToken);
      }

      if (storedUser) {
        setUser(storedUser);
      }

      if (storedToken) {
        try {
          const response = await axios.get(`${API_BASE_URL}/auth/me`);
          const currentUser = normalizeUser(response.data);
          setUser(currentUser);
          localStorage.setItem(USER_KEY, JSON.stringify(currentUser));
        } catch {
          clearSession();
        }
      }

      setInitializing(false);
    };

    bootstrap();
  }, []);

  const saveSession = (authResponse) => {
    const nextToken = authResponse?.token || '';
    const nextUser = normalizeUser(authResponse);

    setToken(nextToken);
    setUser(nextUser);

    localStorage.setItem(TOKEN_KEY, nextToken);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    axios.defaults.headers.common.Authorization = `Bearer ${nextToken}`;
  };

  const clearSession = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    delete axios.defaults.headers.common.Authorization;
  };

  const login = async (payload) => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, payload);
    saveSession(response.data);
    return response.data;
  };

  const registerStudent = async (payload) => {
    const response = await axios.post(`${API_BASE_URL}/auth/register/student`, payload);
    saveSession(response.data);
    return response.data;
  };

  const registerAdmin = async (payload) => {
    const response = await axios.post(`${API_BASE_URL}/auth/register/admin`, payload);
    saveSession(response.data);
    return response.data;
  };

  const registerTechnician = async (payload) => {
    const response = await axios.post(`${API_BASE_URL}/auth/register/technician`, payload);
    saveSession(response.data);
    return response.data;
  };

  const logout = async () => {
    try {
      if (token) {
        await axios.post(`${API_BASE_URL}/auth/logout`);
      }
    } catch {
      // Session cleanup still happens locally even if logout confirmation fails.
    } finally {
      clearSession();
    }
  };

  const hasRole = (roles) => {
    if (!user?.role) {
      return false;
    }

    if (!roles || roles.length === 0) {
      return true;
    }

    return roles.includes(user.role);
  };

  const value = {
    token,
    user,
    initializing,
    isAuthenticated: Boolean(token && user),
    login,
    registerStudent,
    registerAdmin,
    registerTechnician,
    logout,
    clearSession,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};

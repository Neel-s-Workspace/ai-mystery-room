import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Wipe any legacy localStorage tokens to ensure session-only auth
  try {
    localStorage.removeItem('detective_token');
  } catch (e) {
    // Ignore
  }

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => {
    try {
      return sessionStorage.getItem('detective_token') || null;
    } catch (e) {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Re-verify session on mount or token change
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const res = await authAPI.getMe();
        setUser(res.data.user);
      } catch (err) {
        console.warn('Session expired or invalidated by server');
        logout();
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [token]);

  // Pagehide beacon for tab / browser close detection
  useEffect(() => {
    const handlePageHide = () => {
      const activeToken = sessionStorage.getItem('detective_token');
      if (activeToken && navigator.sendBeacon) {
        const apiBase = import.meta.env.VITE_API_URL 
          ? `${import.meta.env.VITE_API_URL.replace(/\/+$/, '')}/api` 
          : '/api';
        const beaconUrl = `${apiBase}/auth/session-beacon?token=${encodeURIComponent(activeToken)}`;
        navigator.sendBeacon(beaconUrl);
      }
    };

    window.addEventListener('pagehide', handlePageHide);
    return () => {
      window.removeEventListener('pagehide', handlePageHide);
    };
  }, []);

  const login = async (username, password) => {
    const res = await authAPI.login({ username, password });
    const { token: newToken, user: userData } = res.data;
    try {
      sessionStorage.setItem('detective_token', newToken);
    } catch (e) {
      console.error('sessionStorage error:', e);
    }
    setToken(newToken);
    setUser(userData);
    return res.data;
  };

  const register = async (formData) => {
    const res = await authAPI.register(formData);
    const { token: newToken, user: userData, username } = res.data;
    try {
      sessionStorage.setItem('detective_token', newToken);
    } catch (e) {
      console.error('sessionStorage error:', e);
    }
    setToken(newToken);
    setUser(userData);
    return res.data;
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (e) {
      // Ignore network errors on logout
    }
    try {
      sessionStorage.removeItem('detective_token');
      localStorage.removeItem('detective_token');
    } catch (e) {
      // Ignore
    }
    setToken(null);
    setUser(null);
  };

  const dismissWelcome = async () => {
    try {
      await authAPI.dismissWelcome();
    } catch (e) {
      // Ignore
    }
    setUser((prev) => (prev ? { ...prev, hasSeenWelcome: true } : null));
  };

  const updateStats = (newStats, newSession) => {
    if (user) {
      setUser((prev) => ({
        ...prev,
        stats: newStats || prev.stats,
        currentSession: newSession || prev.currentSession,
      }));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        dismissWelcome,
        updateStats,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

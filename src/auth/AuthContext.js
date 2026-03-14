import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { API_URL } from '../config/api.js';

const AuthContext = createContext(null);

const TOKEN_KEY = 'truckerlog_token';

async function apiRequest(path, { method = 'GET', token, body } = {}) {
  // NUCLEAR OPTION: Always use hardcoded URL, no fallbacks
  const fullUrl = `${API_URL}${path}`;
  console.log('=== NUCLEAR API REQUEST ===');
  console.log('Hardcoded API URL:', API_URL);
  console.log('Full request URL:', fullUrl);
  console.log('Method:', method);
  console.log('This request CANNOT fail due to environment variables!');
  
  const res = await fetch(fullUrl, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }

  if (!res.ok) {
    const err = new Error('request_failed');
    err.status = res.status;
    err.payload = json;
    throw err;
  }

  return json;
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '');
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(false);

  const setAuthToken = useCallback((nextToken) => {
    const t = nextToken || '';
    setToken(t);
    if (t) localStorage.setItem(TOKEN_KEY, t);
    else localStorage.removeItem(TOKEN_KEY);
  }, []);

  const refreshMe = useCallback(async () => {
    if (!token) {
      setMe(null);
      return;
    }
    setLoading(true);
    try {
      const data = await apiRequest('/api/me', { token });
      setMe(data);
    } catch {
      setMe(null);
      setAuthToken('');
    } finally {
      setLoading(false);
    }
  }, [token, setAuthToken]);

  useEffect(() => {
    refreshMe();
  }, [refreshMe]);

  const signup = useCallback(async ({ email, password }) => {
    const data = await apiRequest('/api/auth/signup', {
      method: 'POST',
      body: { email, password },
    });
    setAuthToken(data.token);
    await new Promise((r) => setTimeout(r, 0));
    await refreshMe();
    return data;
  }, [refreshMe, setAuthToken]);

  const login = useCallback(async ({ email, password }) => {
    const data = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    });
    setAuthToken(data.token);
    await new Promise((r) => setTimeout(r, 0));
    await refreshMe();
    return data;
  }, [refreshMe, setAuthToken]);

  const logout = useCallback(() => {
    setAuthToken('');
    setMe(null);
  }, [setAuthToken]);

  const requestPasswordReset = useCallback(async ({ email }) => {
    return apiRequest('/api/auth/request-reset', {
      method: 'POST',
      body: { email },
    });
  }, []);

  const resetPassword = useCallback(async ({ email, token: resetToken, newPassword }) => {
    return apiRequest('/api/auth/reset', {
      method: 'POST',
      body: { email, token: resetToken, newPassword },
    });
  }, []);

  const updateProfile = useCallback(async (patch) => {
    const data = await apiRequest('/api/profile', {
      method: 'PUT',
      token,
      body: patch,
    });
    await refreshMe();
    return data;
  }, [token, refreshMe]);

  const value = useMemo(() => ({
    token,
    me,
    loading,
    login,
    signup,
    logout,
    requestPasswordReset,
    resetPassword,
    updateProfile,
    refreshMe,
  }), [token, me, loading, login, signup, logout, requestPasswordReset, resetPassword, updateProfile, refreshMe]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('AuthProvider missing');
  return ctx;
}

export async function authedRequest(path, { token, method = 'GET', body } = {}) {
  return apiRequest(path, { token, method, body });
}

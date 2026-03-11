import { useState, useEffect } from 'react';
import { getUser, saveUser, clearUser, getAdmin, saveAdmin, clearAdmin } from '../utils/storage';
import { login as apiLogin, logout as apiLogout } from '../api/authApi';
import { adminLogin as apiAdminLogin } from '../api/adminApi';

/**
 * useAuth — centralizes user/admin authentication state.
 * Reads initial state from localStorage so sessions persist across refreshes.
 */
export const useAuth = () => {
  const [user, setUser]   = useState(() => getUser());
  const [admin, setAdmin] = useState(() => getAdmin());
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  // ── User login ──────────────────────────────────────────────────────────────
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiLogin(email, password);
      const userData = res.data;
      saveUser(userData);
      setUser(userData);
      return { success: true, data: userData };
    } catch (err) {
      const msg = err.userMessage || 'Login failed. Please try again.';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // ── User logout ─────────────────────────────────────────────────────────────
  const logout = async () => {
    try { await apiLogout(); } catch { /* ignore server errors on logout */ }
    clearUser();
    setUser(null);
  };

  // ── Admin login ─────────────────────────────────────────────────────────────
  const adminLogin = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiAdminLogin(email, password);
      if (res.data.success) {
        const adminData = { email, name: res.data.name };
        saveAdmin(adminData);
        setAdmin(adminData);
        return { success: true, data: adminData };
      } else {
        const msg = res.data.message || 'Admin login failed.';
        setError(msg);
        return { success: false, message: msg };
      }
    } catch (err) {
      const msg = err.userMessage || 'Admin login failed.';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // ── Admin logout ─────────────────────────────────────────────────────────────
  const adminLogout = () => {
    clearAdmin();
    setAdmin(null);
  };

  return {
    user,
    admin,
    loading,
    error,
    isLoggedIn: !!user,
    isAdminLoggedIn: !!admin,
    login,
    logout,
    adminLogin,
    adminLogout,
  };
};

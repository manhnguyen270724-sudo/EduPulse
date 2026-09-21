import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('edupulse_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  // Xác thực đối chiếu với HttpOnly Cookie tại Server
  const checkSession = useCallback(async () => {
    try {
      const res = await fetch('/api/public/verify-session', {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();

      if (data.statusCode === 200 && data.data?.authenticated && data.data.user) {
        const verifiedUser = {
          ...data.data.user,
          role: data.data.role
        };
        setUser(verifiedUser);
        localStorage.setItem('edupulse_user', JSON.stringify(verifiedUser));
      } else {
        // Nếu Server báo chưa xác thực hoặc hết hạn phiên
        setUser(null);
        localStorage.removeItem('edupulse_user');
      }
    } catch (err) {
      console.warn('Không thể kiểm tra phiên với server:', err);
      // Giữ tạm user từ localStorage nếu mất mạng tạm thời
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSession();

    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem('edupulse_user');
        setUser(saved ? JSON.parse(saved) : null);
      } catch {
        setUser(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('edupulse-auth-change', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('edupulse-auth-change', handleStorageChange);
    };
  }, [checkSession]);

  const loginUser = (userData) => {
    localStorage.setItem('edupulse_user', JSON.stringify(userData));
    setUser(userData);
    window.dispatchEvent(new Event('edupulse-auth-change'));
  };

  const logoutUser = async () => {
    try {
      const currentRole = user?.role;
      const logoutUrl = currentRole === 'teacher'
        ? '/api/teacher/logout'
        : currentRole === 'admin'
        ? '/api/admin/logout'
        : '/api/student/logout';

      await fetch(logoutUrl, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (e) {
      console.error('Logout error:', e);
    } finally {
      localStorage.removeItem('edupulse_user');
      setUser(null);
      window.dispatchEvent(new Event('edupulse-auth-change'));
    }
  };

  const updateUser = (updates) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      localStorage.setItem('edupulse_user', JSON.stringify(updated));
      window.dispatchEvent(new Event('edupulse-auth-change'));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role,
        isLoggedIn: !!user,
        loading,
        loginUser,
        logoutUser,
        updateUser,
        checkSession
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    try {
      const saved = localStorage.getItem('edupulse_user');
      const u = saved ? JSON.parse(saved) : null;
      return {
        user: u,
        role: u?.role,
        isLoggedIn: !!u,
        loading: false,
        loginUser: (data) => localStorage.setItem('edupulse_user', JSON.stringify(data)),
        logoutUser: () => localStorage.removeItem('edupulse_user'),
        updateUser: () => {},
        checkSession: () => {}
      };
    } catch {
      return {
        user: null,
        role: null,
        isLoggedIn: false,
        loading: false,
        loginUser: () => {},
        logoutUser: () => {},
        updateUser: () => {},
        checkSession: () => {}
      };
    }
  }
  return context;
}

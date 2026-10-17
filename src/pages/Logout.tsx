import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/useAuthStore';

/**
 * مسار-توجيه لتسجيل الخروج: يبطل التوكن خادمياً ثم يرّغ الجلسة محلياً
 * ويعيد إلى شاشة الدخول.
 */
const Logout: React.FC = () => {
  const logout = useAuthStore((s) => s.logout);

  React.useEffect(() => {
    (async () => {
      await authService.logout();
      logout();
    })();
  }, [logout]);

  return <Navigate to="/login" replace />;
};

export default Logout;

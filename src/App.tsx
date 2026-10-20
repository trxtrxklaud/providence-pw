import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';

// Screens
import GmailLogin from './screens/GmailLogin';
import ParentRegister from './screens/ParentRegister';
import Login from './screens/Login';
import Dashboard from './screens/Dashboard';
import Unauthorized from './screens/Unauthorized';

// Layouts
import ParentLayout from './layouts/ParentLayout';
import TeacherLayout from './layouts/TeacherLayout';
import AdminLayout from './layouts/AdminLayout';
import SuperAdminLayout from './layouts/SuperAdminLayout';

import ParentDashboardPage from './pages/parent/DashboardPage';
import ChildDetailPage from './pages/parent/ChildDetailPage';
import ParentAnnouncementsPage from './pages/parent/ParentAnnouncementsPage';
import TeacherDashboardPage from './pages/teacher/TeacherDashboardPage';

function ProtectedRoute({ children, allowedRoles }: {
  children: React.ReactNode,
  allowedRoles: string[]
}) {
  const { user, activeRole, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const role = activeRole || (typeof user.role === 'string' ? user.role : user.role?.name || '');
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<GmailLogin />} />
        <Route path="/register" element={<ParentRegister />} />
        <Route path="/login-phone" element={<Login />} />

        {/* Parent Routes */}
        <Route
          path="/parent"
          element={
            <ProtectedRoute allowedRoles={['parent']}>
              <ParentLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ParentDashboardPage />} />
          <Route path="dashboard" element={<ParentDashboardPage />} />
          <Route path="children/:childId" element={<ChildDetailPage />} />
          <Route path="announcements" element={<ParentAnnouncementsPage />} />
        </Route>

        {/* Teacher Routes */}
        <Route
          path="/teacher"
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <TeacherLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<TeacherDashboardPage />} />
          <Route path="dashboard" element={<TeacherDashboardPage />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/*" element={
          <ProtectedRoute allowedRoles={['admin', 'super-admin', 'cashier', 'accountant']}>
            <AdminLayout />
          </ProtectedRoute>
        } />

        {/* Super Admin Routes */}
        <Route path="/super-admin/*" element={
          <ProtectedRoute allowedRoles={['super-admin']}>
            <SuperAdminLayout />
          </ProtectedRoute>
        } />

        {/* General Dashboard & Unauthorized */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Default */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

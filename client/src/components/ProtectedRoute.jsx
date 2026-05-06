import React from 'react';
import { Navigate } from 'react-router-dom';

const getDashboardPath = (role) => {
  if (role === 'administrator') return '/admin/dashboard';
  if (role === 'branch_manager') return '/manager/dashboard';
  return '/customer/dashboard';
};

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Admin is allowed to access admin, manager and customer pages
  if (user.role === 'administrator') {
    return children;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    alert('Access denied. Insufficient permissions.');
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  return children;
};

export default ProtectedRoute;
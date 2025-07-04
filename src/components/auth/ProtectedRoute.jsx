import React from 'react';
import { useAuth } from '../../context/AuthContext';
import LoginForm from './LoginForm';
import AccessDenied from './AccessDenied';

const ProtectedRoute = ({ 
  children, 
  requireAuth = true, 
  requiredRole = null, 
  requiredPermission = null, 
  requiredResource = null 
}) => {
  const { user, loading, hasRole, hasPermission, canAccess } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Check if authentication is required
  if (requireAuth && !user) {
    return <LoginForm onSuccess={() => window.location.reload()} />;
  }

  // Check role requirements
  if (requiredRole && !hasRole(requiredRole)) {
    return <AccessDenied reason={`This page requires ${requiredRole} role`} />;
  }

  // Check permission requirements
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <AccessDenied reason={`Missing required permission: ${requiredPermission}`} />;
  }

  // Check resource access requirements
  if (requiredResource && !canAccess(requiredResource)) {
    return <AccessDenied reason={`Access denied to ${requiredResource}`} />;
  }

  return children;
};

export default ProtectedRoute;
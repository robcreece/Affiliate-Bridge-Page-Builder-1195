import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock user data - in production, this would come from your auth service
  const mockUsers = {
    'admin@example.com': {
      id: 'user-1',
      email: 'admin@example.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      plan: 'enterprise',
      permissions: ['all'],
      createdAt: '2024-01-01T00:00:00Z',
      lastLogin: new Date().toISOString()
    },
    'manager@example.com': {
      id: 'user-2',
      email: 'manager@example.com',
      firstName: 'Manager',
      lastName: 'User',
      role: 'manager',
      plan: 'professional',
      permissions: ['manage_pages', 'manage_users', 'view_analytics', 'manage_templates'],
      createdAt: '2024-01-15T00:00:00Z',
      lastLogin: new Date().toISOString()
    },
    'editor@example.com': {
      id: 'user-3',
      email: 'editor@example.com',
      firstName: 'Editor',
      lastName: 'User',
      role: 'editor',
      plan: 'basic',
      permissions: ['create_pages', 'edit_pages', 'view_analytics'],
      createdAt: '2024-02-01T00:00:00Z',
      lastLogin: new Date().toISOString()
    },
    'viewer@example.com': {
      id: 'user-4',
      email: 'viewer@example.com',
      firstName: 'Viewer',
      lastName: 'User',
      role: 'viewer',
      plan: 'basic',
      permissions: ['view_pages'],
      createdAt: '2024-02-15T00:00:00Z',
      lastLogin: new Date().toISOString()
    }
  };

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('currentUser');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Mock authentication - in production, this would be an API call
      const userData = mockUsers[email];
      
      if (userData && password === 'password123') {
        const updatedUser = {
          ...userData,
          lastLogin: new Date().toISOString()
        };
        
        setUser(updatedUser);
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        return { success: true, user: updatedUser };
      } else {
        return { success: false, error: 'Invalid credentials' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateUser = (updates) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  const hasPermission = (permission) => {
    if (!user) return false;
    if (user.permissions.includes('all')) return true;
    return user.permissions.includes(permission);
  };

  const hasRole = (role) => {
    if (!user) return false;
    return user.role === role;
  };

  const hasAnyRole = (roles) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const canAccess = (resource) => {
    if (!user) return false;
    
    const accessRules = {
      admin_panel: ['admin'],
      user_management: ['admin', 'manager'],
      analytics: ['admin', 'manager', 'editor'],
      page_creation: ['admin', 'manager', 'editor'],
      template_management: ['admin', 'manager'],
      billing: ['admin'],
      settings: ['admin', 'manager']
    };

    const allowedRoles = accessRules[resource];
    return allowedRoles ? allowedRoles.includes(user.role) : false;
  };

  const value = {
    user,
    loading,
    login,
    logout,
    updateUser,
    hasPermission,
    hasRole,
    hasAnyRole,
    canAccess,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isManager: user?.role === 'manager',
    isEditor: user?.role === 'editor',
    isViewer: user?.role === 'viewer'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
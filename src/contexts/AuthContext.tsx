import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '@/lib/api';

interface User {
  userId: number;
  userFname: string;
  userLname: string;
  email: string;
  role: {
    roleId: number;
    roleName: string;
  };
  createdDate: string;
  updatedDate: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  setUserData: (userData: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is admin based on role
  const isAdmin = user?.role?.roleName?.toLowerCase() === 'admin' || user?.role?.roleId === 1;
  const isAuthenticated = !!user;

  useEffect(() => {
    // Check for existing auth token and user data on app load
    const token = localStorage.getItem('token') || apiClient.getAuthToken();
    if (token) {
      // Try to restore user data from localStorage first
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error('Failed to parse saved user:', error);
        }
      }
      
      // If no saved user data, create a fallback user for authentication
      if (!savedUser) {
        // Create a fallback user since /auth/me doesn't exist
        const fallbackUser = {
          userId: parseInt(localStorage.getItem('userId') || '1'),
          userFname: 'Admin',
          userLname: 'User',
          email: 'admin@example.com',
          role: { roleId: 1, roleName: 'Admin' },
          createdDate: new Date().toISOString(),
          updatedDate: new Date().toISOString()
        };
        setUser(fallbackUser);
        localStorage.setItem('user', JSON.stringify(fallbackUser));
      }
    }
    setLoading(false);
  }, []);

const login = async (email: string, password: string): Promise<boolean> => {
  try {
    setLoading(true);

    // Call backend login endpoint
    const response = await apiClient.login({ email, passwordHash: password });

    // Strip extra quotes if they exist
    let token = response;
    if (typeof token === "string") {
      token = token.replace(/^"|"$/g, ''); // remove leading/trailing quotes
    }

    // Store token correctly
    localStorage.setItem('token', token);

    // Create user data since /auth/me doesn't exist
    const userData: User = {
      userId: parseInt(localStorage.getItem('userId') || '1'),
      userFname: 'Admin',
      userLname: 'User',
      email,
      role: { roleId: 1, roleName: 'Admin' },
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString()
    };

    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));

    return true;
  } catch (error) {
    console.error('Login failed:', error);
    return false;
  } finally {
    setLoading(false);
  }
};

  const logout = () => {
    apiClient.clearAuthToken();
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setUser(null);
  };

  const setUserData = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    loading,
    setUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

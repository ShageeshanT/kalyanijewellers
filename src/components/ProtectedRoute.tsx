import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  loginPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false, loginPath = "/auth/login" }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  // Check localStorage for tokens as fallback
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const hasToken = !!token && !!userId;

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated (either through AuthContext or localStorage), redirect to login
  if (!isAuthenticated && !hasToken) {
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  // If admin access is required, check admin status
  if (requireAdmin) {
    // If AuthContext has user data, use it
    if (isAuthenticated && isAdmin) {
      return <>{children}</>;
    }
    
    // If only localStorage token exists, assume admin for now (you can enhance this later)
    if (hasToken && !isAuthenticated) {
      return <>{children}</>;
    }
    
    // If user is authenticated but not admin
    if (isAuthenticated && !isAdmin) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
            <p className="text-muted-foreground mb-4">You don't have permission to access this page.</p>
            <Navigate to="/" replace />
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;

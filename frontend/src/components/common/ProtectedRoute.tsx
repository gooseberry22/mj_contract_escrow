import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { fetchProfile } from '../../store/slices/userSlice';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: () => void;
}

export function ProtectedRoute({ children, redirectTo }: ProtectedRouteProps) {
  const dispatch = useAppDispatch();
  const { isAuthenticated, loading, user, accessToken } = useAppSelector((state) => state.user);

  // Initialize auth state on mount
  useEffect(() => {
    // If we have a token but no user data, fetch profile
    if (accessToken && !user && !loading) {
      dispatch(fetchProfile());
    }
  }, [dispatch, accessToken, user, loading]);

  // Redirect to login if not authenticated (after loading check)
  useEffect(() => {
    if (!loading && !isAuthenticated && redirectTo) {
      redirectTo();
    }
  }, [loading, isAuthenticated, redirectTo]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show authentication required message if not authenticated
  // (redirect will happen via useEffect)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-900 text-lg mb-2">Authentication Required</p>
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // User is authenticated, render children
  return <>{children}</>;
}

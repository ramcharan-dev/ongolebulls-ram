import { Navigate, useLocation } from 'react-router-dom';
import { getUser, getAdmin } from '../utils/storage';

/**
 * ProtectedRoute — wraps a route that requires a logged-in user.
 * Redirects to /login if no user session exists.
 */
export const ProtectedRoute = ({ children }) => {
  const user = getUser();
  const location = useLocation();
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

/**
 * AdminRoute — wraps a route that requires an admin session.
 * Redirects to /website-controls/login if no admin session exists.
 */
export const AdminRoute = ({ children }) => {
  const admin = getAdmin();
  const location = useLocation();
  if (!admin) {
    return <Navigate to="/website-controls/login" state={{ from: location }} replace />;
  }
  return children;
};

import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute Component
 * 
 * Wraps routes that require authentication and specific role authorization.
 * 
 * How it works:
 * 1. Checks if a valid JWT token exists in localStorage
 * 2. Checks if the user's role matches the required role
 * 3. If either check fails, redirects to the landing page
 * 4. If both pass, renders the child component
 */
function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  // Not authenticated — redirect to landing
  if (!token || !user) {
    return <Navigate to="/" replace />;
  }

  // Role not authorized — redirect to landing
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

// Usage: <RoleRoute roles={['admin', 'pharmacist']}><PharmacistDashboard /></RoleRoute>
function RoleRoute({ roles, children }) {
  const { user, loading, isLoggedIn } = useAuth();

  if (loading) return <LoadingSpinner message="Checking permissions..." />;
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to="/" replace />;

  return children;
}

export default RoleRoute;
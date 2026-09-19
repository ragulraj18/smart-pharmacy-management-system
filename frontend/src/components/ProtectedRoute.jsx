import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';
 
function ProtectedRoute({ children }) {
  const { isLoggedIn, loading } = useAuth();
 
  if (loading) return <LoadingSpinner message="Checking your session..." />;
  if (!isLoggedIn) return <Navigate to="/login" replace />;
 
  return children;
}
 
export default ProtectedRoute;
 

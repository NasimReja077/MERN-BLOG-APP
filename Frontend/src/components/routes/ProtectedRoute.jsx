import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Loading } from "../feedback/Loading";

export const ProtectedRoute = ({ children }) =>{
  const { isAuthenticated, user, loading } = useAuth();
  
  if (loading) {
    return <Loading fullScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if(user && !user.isVerified){
    return<Navigate to='/verify-otp' replace/>
  }
  
  return children;
};

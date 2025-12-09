import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Loading } from "../feedback/Loading";

export const ProtecRoute = ({ children }) =>{
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <Loading fullScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

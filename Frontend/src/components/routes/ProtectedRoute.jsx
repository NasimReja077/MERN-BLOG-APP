// Frontend/src/components/routes/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Loading } from "../feedback/Loading";
import PropTypes from 'prop-types';

export const ProtectedRoute = ({ children }) =>{
  const { isAuthenticated, user, loading } = useAuth();
  
  if (loading) {
    return <Loading fullScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if(!user){
    return <Loading fullScreen />;
  }

  if(!user.isVerified){
    return <Navigate to='/verify-otp' replace />;
  }
  
  return children;
};


ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
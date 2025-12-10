import React from 'react'
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const RedirectAuthUser =({ children })=> {
     const { isAuthenticated, user, loading } = useAuth();

     if (loading) return null;

     if ( isAuthenticated && user?.isVerified) {
          return <Navigate to='/' replace />
     }
     
     return children;
};

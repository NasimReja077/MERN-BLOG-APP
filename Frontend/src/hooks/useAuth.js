import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
// import { getProfile } from '../store/features/authSlice'
export const useAuth = () => {
     const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

     // useEffect(() =>{
     //      if (token && !user){
     //           dispatch(getProfile());
     //      }
     // }, [ token, user, dispatch ]);
     // return { user, isAuthenticated, loading}

     return { user, isAuthenticated, loading };
};

export const useRequireAuth = () =>{
     const navigate = useNavigate();
     const { isAuthenticated, loading } = useAuth();

     useEffect(() =>{
          if (loading) return;
          if (!isAuthenticated){
               navigate('/login', { replace: true });
          }
     }, [isAuthenticated, loading, navigate]);

     return { isAuthenticated, loading };
};
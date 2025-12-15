import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from './components/layout/AppLayout';
import { ErrorBoundary } from './components/feedback/ErrorBoundary';
import Home from "./pages/Home";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { VerifyOTP } from "./pages/VerifyOTP";
import { ForgotPassword } from "./pages/ForgotPassword";
import { ResetPassword } from "./pages/ResetPassword";
import ToastProvider from './components/feedback/ToastProvider';
import { NotFound } from "./pages/NotFound";
import { AllBlogs } from "./pages/AllBlogs";
import { BlogDetails } from "./pages/BlogDetails";
import { CreateBlog } from "./pages/CreateBlog";
import { EditBlog } from "./pages/EditBlog";
import { Profile } from "./pages/Profile";
import { UpdateProfile } from "./pages/UpdateProfile";
import { OtherProfile } from "./pages/OtherProfile";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getProfile } from "./store/features/authSlice";
import { Loading } from "./components/feedback/Loading";
import { ProtectedRoute } from "./components/routes/ProtectedRoute";
import { RedirectAuthUser } from "./components/routes/RedirectAuthUser";
import { fetchBlogs } from "./store/features/blogSlice";
const App =()=> {

  const dispatch = useDispatch();
  const { loading: authLoading, user } = useSelector((state) => state.auth);
  // const { blogs } = useSelector((state) => state.blog);

  useEffect(() => {
    // Always load public blogs for home page
    dispatch(fetchBlogs({ page: 1, limit: 6 }));

    // Try to restore session silently — 401 is OK and expected for guests
    dispatch(getProfile()).unwrap().catch((err) => {
      if (err?.status !== 401) {
        console.error("Session restore error:", err);
      }
    });
  }, [dispatch]);

  if (authLoading && !user){
    return <Loading fullScreen />
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: <AppLayout />,
      errorElement: <ErrorBoundary/>,
      children: [

        // PUBLIC ROUTES
        {
          path: "/",
          element: <Home/>
        },
        {
          path: "/signup",
          element: (
            <RedirectAuthUser>
              <Signup/>
            </RedirectAuthUser>
          ),
        },
        {
          path: "/login",
          element: (
            <RedirectAuthUser>
              <Login/>
            </RedirectAuthUser>
          ),
        },
        {
          path: "/verify-otp",
          element:<VerifyOTP/>,
        },
        {
          path: "/forgot-password",
          element: <ForgotPassword/>
        },
        {
          path: "/reset-password/:token",
          element: (
            <RedirectAuthUser>
              <ResetPassword/>
            </RedirectAuthUser>
          ),
        },
        {
          path: "/blogs",
          element: <AllBlogs/>,
          // loader: 
        },
        {
          path: "/blogs/:id",
          element: (
            <ProtectedRoute>
              <BlogDetails />
            </ProtectedRoute>
          ),
          // loader: 
        },
        {
          path: "/blogs/create",
          element: (
            <ProtectedRoute>
              <CreateBlog/>
            </ProtectedRoute>
          ),
          // action: 
        },
        {
          path: "/blogs/edit/:id",
          element: (
            <ProtectedRoute>
              <EditBlog/>
            </ProtectedRoute>
          ),
          // loader: 
          // action:
        },
        {
          path: "/profile",
          element: (
            <ProtectedRoute>
              <Profile/>
            </ProtectedRoute>
          )
        },
        {
          path: "/profile/update",
          element: (
            <ProtectedRoute>
              <UpdateProfile/>
            </ProtectedRoute>
          )
        },
        {
          path: "/other-user-profile/:id",
          element: <OtherProfile />
          // loader: 
        },
        {
          path: "*",
          element: <NotFound/>
        },

      ]
    }
  ])
  return(
    <ErrorBoundary>
      <ToastProvider />
      <RouterProvider router={router}/>
    </ErrorBoundary>
  );
}

export default App
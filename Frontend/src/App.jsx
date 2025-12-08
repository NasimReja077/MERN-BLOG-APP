import { createBrowserRouter, RouterProvider } from "react-router-dom";
const App =()=> {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Applayout/>,
      errorElement: <ErrorPage/>,
      children: [

        // PUBLIC ROUTES
        {
          path: "/",
          element: <Home/>
        },
        {
          path: "/login",
          element: <Login/>
        },
        {
          path: "/signup",
          element: <Signup/>
        },
        {
          path: "/verify-email",
          element: <VerifyEmail/>
        },
        {
          path: "/forgot-password",
          element: <ForgotPassword/>
        },
        {
          path: "/reset-password/:token",
          element: <ResetPassword/>
        },
        // BLOG (PUBLIC)
        {
          path: "/blog",
          element: <BlogLists/>
          loader: ({ params }) => fetchBlogs(params.id),
        },
        {
          path: "/blog/:id",
          element: <BlogDetail/>
          loader: ({ params }) => fetchBlogsById(params.id), 
        },
        //*  PROTECTED ROUTES
        {
          path: "/profile",
          element: <Profile/>
          loader: 
        },
        {
          path: "/profile/update", 
          element: <UpdateProfile/>
          loader: 
        },
        {
          path: "/user/:id",
          element: <OtherProfile />
          loader: ({ params }) => fetchUserProfile(params.id),
        },,
        {
          path: "/blogs/create",
          element: <CreateBlog/>
          action:
        },
        {
              path: "/blogs/edit/:id",
              element: <EditBlog />,
              loader: ({ params }) => fetchBlogById(params.id),
              // action: editBlogAction,
            },

        { // 2nd mathod for error page
          path: "*",
          element: <NotFound />
        }
      ]
    }
  ])
  return <RouterProvider router={router}/>
}

export default App
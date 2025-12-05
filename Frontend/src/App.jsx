import { createBrowserRouter, RouterProvider } from "react-router-dom";
const App =()=> {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Applayout/>,
      errorElement: <ErrorPage/>,
      children: [
        {
          path: "/",
          element: <Home/>
        },
        {
          path: "/login",
          element: <Login/>
        },
        {
          path: "/register",
          element: <Register/>
        },
        {
          path: "/blog/:id",
          element: <BlogDetail/>
          loader: 
        },
        {
          path: "/profile",
          element: <Profile/>
          loader: 
        },
        {
          path: "/create-blog",
          element: <CreateBlog/>
          action:
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
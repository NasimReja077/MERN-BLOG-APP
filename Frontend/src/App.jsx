import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from './components/layout/AppLayout';
import {ErrorBoundary} from './components/feedback/ErrorBoundary';
import Home from "./pages/Home";
import Login from "./pages/Login";
const App =()=> {
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
          path: "/login",
          element: <Login/>
        }
      ]
    }
  ])
  return <RouterProvider router={router}/>
}

export default App
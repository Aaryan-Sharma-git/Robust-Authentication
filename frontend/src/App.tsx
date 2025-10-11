import { createBrowserRouter, RouterProvider } from "react-router"
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AuthWrapper from "./components/AuthWrapper";
import Settings from "./pages/Settings";

const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthWrapper/>,
    children: [
      {
        index: true,
        element: <Home/>
      },
      {
        path: "settings",
        element: <Settings/>
      }
    ]
  },
  {
    path: '/login',
    element: <Login/>
  },
  {
    path: '/signup',
    element: <Signup/>
  },
  {
    path: '/email/verify/:code',
    element: <VerifyEmail/>
  },
  {
    path: '/password/forgot',
    element: <ForgotPassword/>
  },
  {
    path: '/password/reset',
    element: <ResetPassword/>
  }
]);

const App = () => {
  return (
    <RouterProvider router={router} />
  )
}

export default App
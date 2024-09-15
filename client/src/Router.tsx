import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import App from "./App";
import AuthProvider, { useAuth } from "./helpers/AuthProvider";
import { useEffect } from "react";

const RouterWrapper = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, [isAuthenticated]);

  return <App />;
};

const Router = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <AuthProvider>
          <RouterWrapper />
        </AuthProvider>
      ),
    },
    {
      path: "/login",
      element: (
        <div>
          <h1>Sign In</h1>
        </div>
      ),
    },
    {
      path: "/sign_up",
      element: (
        <div>
          <h1>Sign Up</h1>
        </div>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Router;

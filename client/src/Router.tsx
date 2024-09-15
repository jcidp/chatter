import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import App from "./App";
import AuthProvider, { useAuth } from "./helpers/AuthProvider";
import { useEffect } from "react";
import Login from "./pages/Login";

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
      element: <RouterWrapper />,
    },
    {
      path: "/login",
      element: <Login />,
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

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default Router;

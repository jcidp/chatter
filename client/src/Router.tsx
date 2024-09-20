import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import App from "./App";
import { useAuth } from "./helpers/AuthProvider";
import { useEffect } from "react";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Chats from "./pages/Chats";
import Layout from "./Layout";
import Footer from "./components/Footer";

const ProtectedRoutes = () => {
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
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <ProtectedRoutes />,
          children: [
            { index: true, element: <Chats /> },
            { path: "/chats/:id", element: <p>TBD</p> },
          ],
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/sign_up",
          element: <SignUp />,
        },
      ],
      errorElement: (
        <>
          TBD
          <Footer />
        </>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Router;

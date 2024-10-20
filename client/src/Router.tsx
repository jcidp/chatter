import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import App from "./App";
import { useAuth } from "./helpers/AuthProvider";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Chats from "./pages/Chats";
import Layout from "./Layout";
import Footer from "./components/Footer";
import ErrorPage from "./pages/ErrorPage";
import { ReactNode, useEffect } from "react";
import Chat from "./pages/Chat";
import Users from "./pages/Users";
import Profile from "./pages/Profile";
import NewGroup from "./pages/NewGroup";

const ProtectedRoutes = ({ children }: { children?: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) navigate("/login");
  }, [isAuthenticated]);

  return children;
};

const Router = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: (
            <ProtectedRoutes>
              <App />
            </ProtectedRoutes>
          ),
          children: [
            { index: true, element: <Chats /> },
            { path: "/chats/:id", element: <Chat /> },
            { path: "/users", element: <Users /> },
            { path: "/profile/:id?", element: <Profile /> },
            { path: "/new-group", element: <NewGroup /> },
            { path: "/group/:id", element: <Profile /> },
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
          <ErrorPage />
          <Footer />
        </>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Router;

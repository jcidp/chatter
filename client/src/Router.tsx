import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import App from "./App";
import { useAuth } from "./helpers/AuthProvider";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Chats from "./pages/Chats";
import Layout from "./Layout";
import Footer from "./components/Footer";
import ErrorPage from "./pages/ErrorPage";
import { ReactNode } from "react";
import Chat from "./pages/Chat";

const ProtectedRoutes = ({ children }: { children?: ReactNode }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" />;

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

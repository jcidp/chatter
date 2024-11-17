import { Outlet } from "react-router-dom";
import AuthProvider from "./helpers/AuthProvider";
import { ThemeProvider } from "./helpers/ThemeProvider";

const Layout = () => {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Outlet />
      </ThemeProvider>
    </AuthProvider>
  );
};

export default Layout;

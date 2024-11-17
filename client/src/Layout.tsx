import { Outlet } from "react-router-dom";
import AuthProvider from "./helpers/AuthProvider";
import Footer from "./components/Footer";
import { ThemeProvider } from "./helpers/ThemeProvider";

const Layout = () => {
  return (
    <AuthProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Outlet />
        <Footer />
      </ThemeProvider>
    </AuthProvider>
  );
};

export default Layout;

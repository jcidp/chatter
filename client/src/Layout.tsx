import { Outlet } from "react-router-dom";
import AuthProvider from "./helpers/AuthProvider";
import Footer from "./components/Footer";

const Layout = () => {
  return (
    <AuthProvider>
      <Outlet />
      <Footer />
    </AuthProvider>
  );
};

export default Layout;

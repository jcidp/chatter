import { Outlet } from "react-router-dom";
import AuthProvider from "./helpers/AuthProvider";

const Layout = () => {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
};

export default Layout;

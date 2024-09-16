import { Link } from "react-router-dom";
import AccountForm from "../components/AccountForm";

const Login = () => {
  return (
    <main className="self-center">
      <h1 className="text-xl mb-4">Login</h1>
      <AccountForm />
      <span>Don't have an account, yet? </span>
      <Link to="/sign_up" className="text-blue-700 underline">
        Sign up
      </Link>
    </main>
  );
};

export default Login;

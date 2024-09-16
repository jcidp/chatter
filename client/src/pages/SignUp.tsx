import { Link } from "react-router-dom";
import AccountForm from "../components/AccountForm";

const SignUp = () => {
  return (
    <main className="self-center">
      <h1 className="text-xl mb-4">Sign up</h1>
      <AccountForm isSignUp />
      <span>Already have an account? </span>
      <Link to="/login" className="text-blue-700 underline">
        Login
      </Link>
    </main>
  );
};

export default SignUp;

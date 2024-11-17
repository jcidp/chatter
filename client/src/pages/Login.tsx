import { Link } from "react-router-dom";
import AccountForm from "../components/AccountForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Login = () => {
  return (
    <main className="flex-1 grid place-content-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your info to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AccountForm type="login" />
          <div className="mt-4 text-center text-sm">
            <span>Don't have an account? </span>
            <Link to="/sign_up" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default Login;

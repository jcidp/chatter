import { Link } from "react-router-dom";
import AccountForm from "../components/AccountForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const SignUp = () => {
  return (
    <main className="flex-1 w-full grid grid-cols-[1fr] place-content-center py-2">
      <h1 className="text-4xl font-bold text-primary text-center mb-8 w-full">
        Chatter
      </h1>
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Sign up</CardTitle>
          <CardDescription>
            Enter your info to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AccountForm type="signUp" />
          <div className="mt-4 text-center text-sm">
            <span>Already have an account? </span>
            <Link to="/login" className="underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default SignUp;

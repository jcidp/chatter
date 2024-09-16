import { useNavigate } from "react-router-dom";
import { useAuth } from "../helpers/AuthProvider";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AccountFormProps {
  isSignUp?: boolean;
}

const AccountForm = ({ isSignUp }: AccountFormProps) => {
  const { isAuthenticated, signUp, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignUp) {
      signUp(email, password, passwordConfirmation);
    } else {
      login(email, password);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          required
          autoFocus
          placeholder="m@example.com"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <div className="flex items-center">
          <Label htmlFor="password">Password</Label>
        </div>
        <Input
          id="password"
          type="password"
          required
          placeholder="********"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {isSignUp && (
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password-confirmation">Password</Label>
          </div>
          <Input
            id="password-confirmation"
            type="password"
            required
            placeholder="********"
            onChange={(e) => setPasswordConfirmation(e.target.value)}
          />
        </div>
      )}
      <Button type="submit" className="w-full">
        {isSignUp ? "Sign up" : "Login"}
      </Button>
    </form>
  );
};

export default AccountForm;

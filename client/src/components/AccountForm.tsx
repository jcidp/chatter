import { useNavigate } from "react-router-dom";
import { useAuth } from "../helpers/AuthProvider";
import { useEffect, useState } from "react";

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
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 my-4 border rounded px-2 py-4 gap-y-2 md:min-w-96"
    >
      <label>
        Email
        <input
          type="email"
          id="email"
          name="email"
          required
          autoFocus
          placeholder="example@email.com"
          onChange={(e) => setEmail(e.target.value)}
          className="block"
        ></input>
      </label>
      <label htmlFor="password">
        Password
        <input
          type="password"
          id="password"
          name="password"
          required
          placeholder="********"
          onChange={(e) => setPassword(e.target.value)}
          className="block"
        />
      </label>
      {isSignUp && (
        <label htmlFor="confirm-password">
          Confirm Password
          <input
            type="password"
            id="confirm-password"
            name="confirm-password"
            required
            placeholder="********"
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            className="block"
          />
        </label>
      )}
      <button>{isSignUp ? "Sign up" : "Login"}</button>
    </form>
  );
};

export default AccountForm;

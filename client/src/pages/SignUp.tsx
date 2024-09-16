import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../helpers/AuthProvider";
import { useEffect, useState } from "react";

const SignUp = () => {
  const { isAuthenticated, signUp } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signUp(email, password, passwordConfirmation);
  };

  return (
    <>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          required
          autoFocus
          placeholder="example@email.com"
          onChange={(e) => setEmail(e.target.value)}
        ></input>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          required
          placeholder="********"
          onChange={(e) => setPassword(e.target.value)}
        />
        <label htmlFor="confirm-password">Confirm Password:</label>
        <input
          type="password"
          id="confirm-password"
          name="confirm-password"
          required
          placeholder="********"
          onChange={(e) => setPasswordConfirmation(e.target.value)}
        />
        <button>Sign up</button>
      </form>
      <span>Already have an account? </span>
      <Link to="/login">Login</Link>
    </>
  );
};

export default SignUp;

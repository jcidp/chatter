import { useEffect, useState } from "react";
import { useAuth } from "../helpers/AuthProvider";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          required
          autoFocus
          placeholder="example@email.com"
          onChange={(e) => setEmail(e.target.value)}
        ></input>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          required
          placeholder="********"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button>Login</button>
      </form>
      <Link to="/sign_up">Sign up</Link>
    </>
  );
};

export default Login;

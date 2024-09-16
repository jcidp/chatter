import "./App.css";
import { useAuth } from "./helpers/AuthProvider";

function App() {
  const { logout } = useAuth();

  return (
    <>
      <h1 className="text-xl text-purple-700">Hello, world!</h1>
      <button onClick={() => logout()}>Logout</button>
    </>
  );
}

export default App;

import { Link, Outlet } from "react-router-dom";
import "./App.css";
import { useAuth } from "@/helpers/AuthProvider";
import { Button } from "./components/ui/button";

function App() {
  const { logout } = useAuth();

  return (
    <>
      <header>
        <div className="flex justify-between">
          <h1 className="text-xl text-blue-700 inline">Chatter</h1>
          <Link to="/profile">Profile</Link>
          <Button
            className="bg-secondary text-secondary-foreground"
            onClick={() => logout()}
          >
            Logout
          </Button>
        </div>
      </header>
      <main className="flex-1 grid auto-rows-fr">
        <Outlet />
      </main>
    </>
  );
}

export default App;

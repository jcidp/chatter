import { Outlet } from "react-router-dom";
import "./App.css";
import { useAuth } from "@/helpers/AuthProvider";
import { Button } from "./components/ui/button";

function App() {
  const { logout } = useAuth();

  return (
    <>
      <header>
        <div className="flex justify-between">
          <h1 className="text-xl text-purple-700 inline">Hello, world!</h1>
          <Button
            className="bg-secondary text-secondary-foreground"
            onClick={() => logout()}
          >
            Logout
          </Button>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default App;

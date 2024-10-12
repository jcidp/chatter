import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import "./App.css";
import { useAuth } from "@/helpers/AuthProvider";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";
import { ArrowBigLeft, UserRoundIcon } from "lucide-react";
import { Button } from "./components/ui/button";

function App() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleReturn = () => {
    navigate(-1);
  };

  return (
    <>
      <header className="m-2">
        <div className="flex justify-between">
          {location.pathname === "/" ? (
            <div></div>
          ) : (
            <button onClick={handleReturn}>
              <ArrowBigLeft />
            </button>
          )}
          <Link to="/">
            <h1 className="text-xl text-blue-700 inline">Chatter</h1>
          </Link>
          {location.pathname === "/profile" ? (
            <Button
              className="bg-secondary text-secondary-foreground"
              onClick={() => logout()}
            >
              Logout
            </Button>
          ) : (
            <Link to="/profile">
              <Avatar>
                <AvatarImage src={user?.avatar} alt={user?.username} />
                <AvatarFallback>
                  <UserRoundIcon />
                </AvatarFallback>
              </Avatar>
            </Link>
          )}
        </div>
      </header>
      <main className="flex-grow flex flex-col overflow-hidden">
        <Outlet />
      </main>
    </>
  );
}

export default App;

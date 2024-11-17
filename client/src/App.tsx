import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import "./App.css";
import { useAuth } from "@/helpers/AuthProvider";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";
import { ArrowBigLeft, UserRoundIcon } from "lucide-react";
import { Button } from "./components/ui/button";
import { ModeToggle } from "./helpers/ModeToggle";

function App() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleReturn = () => {
    navigate(-1);
  };

  return (
    <>
      <header className="p-2 w-full">
        <div className="flex justify-between items-center mx-auto max-w-[70ch]">
          <div className="w-28">
            {location.pathname !== "/" && (
              <button onClick={handleReturn}>
                <ArrowBigLeft />
              </button>
            )}
          </div>
          <Link to="/">
            <h1 className="text-xl font-bold text-blue-700 inline">Chatter</h1>
          </Link>
          <div className="w-28 flex justify-end gap-4">
            <ModeToggle />
            {location.pathname === "/profile" ? (
              <Button variant="secondary" onClick={() => logout()}>
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
        </div>
      </header>
      <main
        className={`flex-grow flex flex-col ${location.pathname.startsWith("/chats") ? "overflow-hidden" : "overflow-auto"} w-full`}
      >
        <Outlet />
      </main>
    </>
  );
}

export default App;

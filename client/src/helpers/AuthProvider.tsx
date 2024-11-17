import { createContext, useContext, useEffect, useState } from "react";
import { Login, SignUp, User } from "../types";
import ApiClient from "./ApiClient";
import { Loader2Icon } from "lucide-react";

interface AuthContextType {
  user: User | null;
  signUp: SignUp;
  login: Login;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  updateUser: (newUser: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      ApiClient.setInterceptors(() => {
        setUser(null);
      });
      const token = localStorage.getItem("auth_token");
      if (token) {
        try {
          const userData = await ApiClient.getCurrentUser();
          setUser(userData);
        } catch (error) {
          localStorage.removeItem("auth_token");
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const signUp: SignUp = async (signUpValues) => {
    const userData = await ApiClient.signUp(signUpValues);
    setUser(userData);
  };

  const login: Login = async (loginValues) => {
    const userData = await ApiClient.login(loginValues);
    setUser(userData);
  };

  const logout = async () => {
    await ApiClient.logout();
    setUser(null);
  };

  const updateUser = (newUser: User) => {
    setUser(newUser);
  };

  const value = {
    user,
    signUp,
    login,
    logout,
    isAuthenticated: !!user,
    updateUser,
  };

  if (loading)
    return (
      <div className="w-screen h-screen grid place-content-center">
        <Loader2Icon className="w-20 h-20 animate-spin" />
      </div>
    );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

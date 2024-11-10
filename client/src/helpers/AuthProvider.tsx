import { createContext, useContext, useEffect, useState } from "react";
import { Login, SignUp, User } from "../types";
import ApiClient from "./ApiClient";

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
  const [isLoading, setIsLoading] = useState(true);

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
      setIsLoading(false);
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

  if (isLoading) {
    return <div>Auth Loading...</div>;
  }

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

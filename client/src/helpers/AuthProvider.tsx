import { createContext, useContext, useEffect, useState } from "react";
import { User } from "../types";
import ApiClient from "./ApiClient";

interface AuthContextType {
  user: User | null;
  signUp: (
    email: string,
    password: string,
    passwordConfirmation: string,
  ) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("auth_token");
      if (token) {
        try {
          const userData = await ApiClient.getCurrentUser();
          console.log(userData);
          setUser(userData);
        } catch (error) {
          localStorage.removeItem("auth_token");
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const signUp = async (
    email: string,
    password: string,
    passwordConfirmation: string,
  ) => {
    const userData = await ApiClient.signUp(
      email,
      password,
      passwordConfirmation,
    );
    setUser(userData);
  };

  const login = async (email: string, password: string) => {
    const userData = await ApiClient.login(email, password);
    setUser(userData);
  };

  const logout = async () => {
    await ApiClient.logout();
    setUser(null);
  };

  const value = {
    user,
    signUp,
    login,
    logout,
    isAuthenticated: !!user,
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

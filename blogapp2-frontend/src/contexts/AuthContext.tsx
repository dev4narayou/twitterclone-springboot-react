import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { AuthService } from "../services/authservice";

interface AuthContextType {
  isAuthenticated: boolean;
  user: { id: number; username: string; email?: string } | null;
  login: (
    token: string,
    user: { id: number; username: string; email?: string }
  ) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{
    id: number;
    username: string;
    email?: string;
  } | null>(null);

  useEffect(() => {
    // clear any corrupted localStorage data first
    AuthService.clearCorruptedData();

    // check authentication status on app load
    const authenticated = AuthService.isAuthenticated();
    const currentUser = AuthService.getCurrentUser();

    setIsAuthenticated(authenticated);
    setUser(currentUser);
  }, []);
  const login = (
    token: string,
    userData: { id: number; username: string; email?: string }
  ) => {
    console.log("AuthContext login called with:", { token, userData });

    if (!token || token === "undefined" || token === "null") {
      console.error("Invalid token received:", token);
      throw new Error("Invalid authentication token received");
    }

    if (!userData || !userData.id || !userData.username) {
      console.error("Invalid user data received:", userData);
      throw new Error("Invalid user data received");
    }

    localStorage.setItem("authToken", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);

    console.log(
      "Authentication successful, token stored:",
      token.substring(0, 20) + "..."
    );
  };

  const logout = () => {
    AuthService.logout();
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

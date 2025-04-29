"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";

interface User {
  id: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
  isLoading: true,
  isAuthenticated: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    try {
      const storedToken =
        typeof window !== "undefined"
          ? localStorage.getItem("auth_token")
          : null;
      const storedUser =
        typeof window !== "undefined"
          ? localStorage.getItem("auth_user")
          : null;

      if (storedToken && storedUser) {
        const tokenPayload = storedToken.split(".")[1];
        if (tokenPayload) {
          try {
            const decodedPayload = JSON.parse(atob(tokenPayload));
            const isExpired =
              decodedPayload.exp && decodedPayload.exp * 1000 < Date.now();

            if (isExpired) {
              console.warn(
                "Auth token appears to be expired, clearing auth state"
              );
              localStorage.removeItem("auth_token");
              localStorage.removeItem("auth_user");
            } else {
              setToken(storedToken);
              setUser(JSON.parse(storedUser));
              setIsAuthenticated(true);
              // console.log("Auth state loaded from localStorage, token exists");
            }
          } catch (e) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
          }
        }
      } else {
        console.log("No auth state found in localStorage");
      }
    } catch (error) {
      console.error("Error loading auth state:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const isAuthPage = pathname === "/";
      const isProtectedRoute = pathname?.startsWith("/dashboard");

      if (isProtectedRoute && !isAuthenticated) {
        console.log(
          "Redirecting to login: protected route accessed without auth"
        );
        router.push("/");
      } else if (isAuthPage && isAuthenticated) {
        console.log("Redirecting to dashboard: user is authenticated");
        router.push("/dashboard");
      }
    }
  }, [isLoading, isAuthenticated, pathname, router]);

  const login = (newToken: string, newUser: User) => {
    console.log(
      "Login called with token:",
      newToken ? "Token exists" : "No token"
    );
    setToken(newToken);
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem("auth_token", newToken);
    localStorage.setItem("auth_user", JSON.stringify(newUser));
  };

  const logout = () => {
    console.log("Logout called, clearing auth state");
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    router.push("/");
  };

  useEffect(() => {
    console.log("Auth token changed:", token ? "Token exists" : "No token");
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isLoading,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

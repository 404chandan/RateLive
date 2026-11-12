import React, { createContext, useContext, useState, useEffect } from "react";
import type { UserSession } from "../types";

interface AuthContextType {
  user: UserSession | null;
  token: string | null;
  login: (token: string, user: UserSession) => void;
  logout: () => void;
  savedVenueIds: string[];
  toggleSaveVenue: (id: string) => void;
  theme: "dark" | "light";
  toggleTheme: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("ratelive_token"));
  const [user, setUser] = useState<UserSession | null>(() => {
    const raw = localStorage.getItem("ratelive_user");
    return raw ? JSON.parse(raw) : null;
  });

  const [savedVenueIds, setSavedVenueIds] = useState<string[]>(() => {
    const raw = localStorage.getItem("ratelive_saved");
    return raw ? JSON.parse(raw) : [];
  });

  const [theme, setTheme] = useState<"dark" | "light">(() => {
    return (localStorage.getItem("ratelive_theme") as "dark" | "light") || "dark";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("ratelive_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const login = (newToken: string, newUser: UserSession) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("ratelive_token", newToken);
    localStorage.setItem("ratelive_user", JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("ratelive_token");
    localStorage.removeItem("ratelive_user");
  };

  const toggleSaveVenue = (id: string) => {
    setSavedVenueIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      localStorage.setItem("ratelive_saved", JSON.stringify(next));
      return next;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        savedVenueIds,
        toggleSaveVenue,
        theme,
        toggleTheme,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};


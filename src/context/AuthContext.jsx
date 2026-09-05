import { createContext, useState, useCallback } from "react";
import { authService } from "../services/auth/authService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(authService.getCurrentUser());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = useCallback(async (identifier, password) => {
    setLoading(true);
    setError("");
    try {
      const { user } = await authService.login(identifier, password);
      setUser(user);
      return user;
    } catch (err) {
      setError(err.message || "Login failed");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  const value = {
    user,
    setUser,
    isAuthenticated: !!user,
    login,
    logout,
    loading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

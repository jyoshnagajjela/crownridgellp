import { useState, useCallback } from "react";
import { useAuthContext } from "../context/AuthContext";

const API_URL = "https://crownridgellp-ldd9.onrender.com/api/auth";

export function useAuth() {
  const { user, setUser, logout } = useAuthContext();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (result.success) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));

        setUser(result.user);

        return result.user;
      }

      setError(result.message || "Login failed");
      return null;
    } catch (err) {
      setError("Unable to connect to server.");
      return null;
    } finally {
      setLoading(false);
    }
  }, [setUser]);

  const register = useCallback(async (name, email, password, role) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
        }),
      });

      const result = await response.json();

      return result;
    } catch (err) {
      return {
        success: false,
        message: "Connection error",
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = () => setError("");

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
  };
}
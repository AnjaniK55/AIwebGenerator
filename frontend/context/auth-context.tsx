"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, ApiResponse } from "@/types";
import { apiClient } from "@/lib/api-client";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => Promise<void>;
  googleLogin: (idToken: string) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Validate session against backend on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await apiClient<ApiResponse<User>>("/auth/me");
        if (response.success && response.data) {
          setUser(response.data);
        }
      } catch (err) {
        // Fail silently: user is not logged in
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient<ApiResponse<User>>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      if (response.success && response.data) {
        setUser(response.data);
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Authentication credentials invalid.";
      setError(errMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, confirmPassword: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient<ApiResponse<User>>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password, confirmPassword }),
      });
      if (response.success && response.data) {
        setUser(response.data);
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Registration request failed.";
      setError(errMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await apiClient<ApiResponse<void>>("/auth/logout", { method: "POST" });
      setUser(null);
      router.push("/login");
    } catch (err: unknown) {
      setError("Logout failed.");
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async (idToken: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient<ApiResponse<User>>("/auth/google-login", {
        method: "POST",
        body: JSON.stringify({ idToken }),
      });
      if (response.success && response.data) {
        setUser(response.data);
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Google OAuth authentication failed.";
      setError(errMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        error,
        login,
        register,
        logout,
        googleLogin,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

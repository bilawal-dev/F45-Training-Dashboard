"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { AuthContextType } from "@/types/AuthContext";
import { User } from "@/types/User";

// Create context with default value
const AuthContext = createContext<AuthContextType | null>(null);

// Custom hook for easy consumption
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}

// Define AuthProvider props type
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("silicon-sign-chat-access-token");

    if (token) {
      const verifyToken = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/authenticate`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.ok) {
            const data: User = await response.json();
            setUser(data);
          } else {
            if (response.status === 403) {
              localStorage.removeItem("silicon-sign-chat-access-token")
            };
            setUser(null);
          }
        } catch (error) {
          console.error("Token verification error:", error);
          setUser(null);
        } finally {
          setLoading(false);
        }
      };

      verifyToken();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success && data.token) {
        localStorage.setItem("silicon-sign-chat-access-token", data.token);
        toast.success("Signin Successful");
        
        // No redirect, just update user state
        const userData: User = { 
          userId: data.user.userId, 
          name: data.user.name, 
          email: data.user.email 
        };
        setUser(userData);
        
      } else {
        throw new Error(data.message || "Signin Error");
      }
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Login Error");
    }
  };

  const signup = async (name: string, email: string, password: string, showLogin: () => void) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        showLogin();
      } else {
        throw new Error(data.message || "Signup Error");
      }
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Signup Error");
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem("silicon-sign-chat-access-token");
      toast.success("Signout Successful");
      setUser(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed To Signout");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
} 
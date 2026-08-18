"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
  isLoggedIn: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

  useEffect(() => {
    // Check saved login in localStorage
    try {
      const savedUser = localStorage.getItem("ku_avatar_user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.error("Failed to load user session", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginWithGoogle = async (): Promise<void> => {
    setIsLoading(true);
    // Simulate quick Google sign-in auth flow with a delightful experience
    await new Promise((resolve) => setTimeout(resolve, 800));

    const mockUser: UserProfile = {
      name: "고려대 호랑이",
      email: "tiger@korea.ac.kr",
      avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=ku_tiger",
      isLoggedIn: true,
    };

    setUser(mockUser);
    localStorage.setItem("ku_avatar_user", JSON.stringify(mockUser));
    setIsLoading(false);
    setShowLoginModal(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("ku_avatar_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user?.isLoggedIn,
        isLoading,
        loginWithGoogle,
        logout,
        showLoginModal,
        setShowLoginModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

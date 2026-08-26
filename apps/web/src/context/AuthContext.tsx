import React, { createContext, useContext, useEffect, useState } from "react";
import { useAccount, useDisconnect, useSignMessage } from "wagmi";
import { api } from "../lib/api.js";

export interface UserProfile {
  id: string;
  walletAddress: string;
  username?: string | null;
  displayName?: string | null;
  isAdmin?: boolean;
  issuerId?: string | null;
  isVerifiedIssuer?: boolean;
}

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserProfile | null;
  isIssuer: boolean;
  isAdmin: boolean;
  login: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("certifiedpass_user");
    const token = localStorage.getItem("certifiedpass_jwt");
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("certifiedpass_user");
        localStorage.removeItem("certifiedpass_jwt");
      }
    }
    setIsLoading(false);
  }, []);

  // Handle wallet disconnect
  useEffect(() => {
    if (!isConnected && user) {
      logout();
    }
  }, [isConnected]);

  const login = async () => {
    if (!address) {
      throw new Error("Wallet not connected");
    }

    setIsLoading(true);
    try {
      // 1. Get Nonce
      const nonceRes = await api.get(`/auth/nonce?wallet=${address}`);
      const { nonce, message } = nonceRes.data.data;

      // 2. Sign Message
      const signature = await signMessageAsync({ message });

      // 3. Verify Signature & Get JWT
      const verifyRes = await api.post("/auth/verify", {
        walletAddress: address,
        signature,
        nonce,
      });

      const { token, user: profile } = verifyRes.data.data;

      localStorage.setItem("certifiedpass_jwt", token);
      localStorage.setItem("certifiedpass_user", JSON.stringify(profile));
      setUser(profile);
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("certifiedpass_jwt");
    localStorage.removeItem("certifiedpass_user");
    setUser(null);
    disconnect();
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        isLoading,
        user,
        isIssuer: !!user?.issuerId,
        isAdmin: !!user?.isAdmin,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

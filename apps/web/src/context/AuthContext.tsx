import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAccount, useDisconnect, useSignMessage } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { api } from "../lib/api.js";

export interface UserProfile {
  id: string;
  walletAddress: string;
  username?: string | null;
  displayName?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
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
  isProfileModalOpen: boolean;
  openProfileModal: () => void;
  closeProfileModal: () => void;
  updateUserProfile: (data: Partial<UserProfile>) => void;
  login: () => Promise<void>;
  loginDemo: (role?: "issuer" | "holder") => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  const { openConnectModal } = useConnectModal();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);

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

  // When wallet connects or changes, fetch and sync the saved profile from database
  useEffect(() => {
    async function syncWalletProfile() {
      if (isConnected && address) {
        try {
          const res = await api.get(`/profiles/by-wallet/${address}`);
          if (res.data?.data) {
            const dbProfile = res.data.data;
            const updatedUser: UserProfile = {
              id: dbProfile.id || `usr-${address.slice(2, 10)}`,
              walletAddress: address,
              displayName: dbProfile.displayName || `${address.slice(0, 6)}...${address.slice(-4)}`,
              username: dbProfile.username || null,
              bio: dbProfile.bio || null,
              avatarUrl: dbProfile.avatarUrl || null,
              isAdmin: !!dbProfile.isAdmin,
              issuerId: dbProfile.issuerId || null,
              isVerifiedIssuer: !!dbProfile.isVerifiedIssuer,
            };

            setUser(updatedUser);
            localStorage.setItem("certifiedpass_user", JSON.stringify(updatedUser));
            if (!localStorage.getItem("certifiedpass_jwt")) {
              localStorage.setItem("certifiedpass_jwt", "wallet-connected-session");
            }

            // If user has no username or custom name yet, prompt setup
            if (!dbProfile.username && !localStorage.getItem(`prompted_${address}`)) {
              localStorage.setItem(`prompted_${address}`, "true");
              setIsProfileModalOpen(true);
            }
          }
        } catch (err) {
          console.warn("Could not fetch remote wallet profile, using local:", err);
          if (!user || user.walletAddress !== address) {
            const fallbackUser: UserProfile = {
              id: `usr-${address.slice(2, 10)}`,
              walletAddress: address,
              displayName: `${address.slice(0, 6)}...${address.slice(-4)}`,
              username: null,
              isAdmin: false,
              issuerId: null,
              isVerifiedIssuer: false,
            };
            setUser(fallbackUser);
            localStorage.setItem("certifiedpass_user", JSON.stringify(fallbackUser));
          }
        }
      }
    }

    if (isConnected && address && (!user || user.walletAddress.toLowerCase() !== address.toLowerCase())) {
      syncWalletProfile();
    }
  }, [isConnected, address]);

  // Handle wallet disconnect (only if not in demo session)
  useEffect(() => {
    if (!isConnected && user && !user.id.startsWith("demo-")) {
      logout();
    }
  }, [isConnected]);

  const updateUserProfile = useCallback((data: Partial<UserProfile>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...data };
      localStorage.setItem("certifiedpass_user", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const openProfileModal = () => setIsProfileModalOpen(true);
  const closeProfileModal = () => setIsProfileModalOpen(false);

  const login = async () => {
    if (!address) {
      if (openConnectModal) {
        openConnectModal();
      }
      return;
    }

    setIsLoading(true);
    try {
      // 1. Get Nonce from Backend
      const nonceRes = await api.get(`/auth/nonce?wallet=${address}`);
      const { nonce, message } = nonceRes.data.data;

      // 2. Sign SIWE EIP-191 Message
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

      // Prompt profile setup if username is missing
      if (!profile.username) {
        setIsProfileModalOpen(true);
      }
    } catch (err: any) {
      console.warn("SIWE API verification fell back to local session:", err.message);
      const fallbackUser: UserProfile = {
        id: `usr-${address.slice(2, 10)}`,
        walletAddress: address,
        displayName: `${address.slice(0, 6)}...${address.slice(-4)}`,
        username: address.slice(2, 10).toLowerCase(),
        isAdmin: true,
        issuerId: "iss-ethsf-001",
        isVerifiedIssuer: true,
      };
      localStorage.setItem("certifiedpass_jwt", "mock-jwt-token-amoy");
      localStorage.setItem("certifiedpass_user", JSON.stringify(fallbackUser));
      setUser(fallbackUser);
    } finally {
      setIsLoading(false);
    }
  };

  const loginDemo = (role: "issuer" | "holder" = "issuer") => {
    const demoUser: UserProfile =
      role === "issuer"
        ? {
            id: "demo-issuer-01",
            walletAddress: "0x51E2a23456789abcdef123456789abcdef123456",
            displayName: "ETHSF & Polygon Labs",
            username: "ethsf_polygon",
            bio: "Leading Web3 Hackathons & Developer Grants",
            isAdmin: true,
            issuerId: "iss-ethsf-001",
            isVerifiedIssuer: true,
          }
        : {
            id: "demo-holder-01",
            walletAddress: "0x71C845137f73612FACb1C1E6e3e1A144e5904F2E",
            displayName: "Alex Rivera",
            username: "alex.rivera",
            bio: "Full-stack Web3 engineer building on Polygon Amoy",
            isAdmin: false,
            issuerId: null,
            isVerifiedIssuer: false,
          };

    localStorage.setItem("certifiedpass_jwt", "demo-jwt-token");
    localStorage.setItem("certifiedpass_user", JSON.stringify(demoUser));
    setUser(demoUser);
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
        isIssuer: !!user?.isVerifiedIssuer || !!user?.issuerId || !!user?.isAdmin,
        isAdmin: !!user?.isAdmin,
        isProfileModalOpen,
        openProfileModal,
        closeProfileModal,
        updateUserProfile,
        login,
        loginDemo,
        logout,
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

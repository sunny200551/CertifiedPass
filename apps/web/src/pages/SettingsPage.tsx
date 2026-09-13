import React from "react";
import { Settings, Shield, Bell, Key, LogOut } from "lucide-react";
import { Layout } from "../components/layout/Layout.js";
import { Button } from "../components/ui/Button.js";
import { useAuth } from "../context/AuthContext.js";

export default function SettingsPage() {
  const { user, logout } = useAuth();

  return (
    <Layout>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 text-[var(--text-primary)]">
        <div className="border-b border-[var(--shadow-dark)]/15 pb-6 mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] font-display">Account Settings</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Manage wallet associations, privacy settings, and active session.</p>
        </div>

        <div className="space-y-6">
          {/* Wallet Info Card */}
          <div className="rounded-[24px] neo-raised bg-[var(--surface-bg)] p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="neo-raised-sm flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent-indigo-bg)] text-[var(--brand-indigo)]">
                <Key className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-[var(--text-primary)] font-display">Connected Wallet</h3>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mb-3">
              Your primary EVM wallet used to sign in and anchor credentials on Polygon Amoy.
            </p>
            <div className="rounded-2xl neo-inset bg-[var(--surface-bg)] p-4 font-mono text-xs text-[var(--brand-indigo)] break-all select-all font-bold">
              {user?.walletAddress || "0x71C845137F73612FACb1C1E6e3e1A144e5904F2E"}
            </div>
          </div>

          {/* Privacy (§11 Compliance) */}
          <div className="rounded-[24px] neo-raised bg-[var(--surface-bg)] p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="neo-raised-sm flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent-green-bg)] text-[var(--accent-green)]">
                <Shield className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-[var(--text-primary)] font-display">On-Chain Privacy Standard</h3>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              CertifiedPass never uploads your personal identity, email address, or contact info to the blockchain. All on-chain records consist strictly of cryptographic SHA-256 digests.
            </p>
          </div>

          {/* Session Disconnect */}
          <div className="rounded-[24px] neo-raised bg-[var(--surface-bg)] p-6 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-red-500 font-display">Sign Out Session</h4>
              <p className="text-xs text-[var(--text-secondary)]">Clear local JWT and disconnect active wallet session.</p>
            </div>
            <Button variant="danger" size="sm" onClick={logout} className="gap-1.5 rounded-full px-5">
              <LogOut className="h-4 w-4" /> Disconnect
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

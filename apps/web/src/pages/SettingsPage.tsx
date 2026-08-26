import React from "react";
import { Settings, Shield, Bell, Key, LogOut } from "lucide-react";
import { Layout } from "../components/layout/Layout.js";
import { Button } from "../components/ui/Button.js";
import { useAuth } from "../context/AuthContext.js";

export default function SettingsPage() {
  const { user, logout } = useAuth();

  return (
    <Layout>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="border-b border-slate-800 pb-6 mb-8">
          <h1 className="text-2xl font-bold text-white">Account Settings</h1>
          <p className="text-sm text-slate-400 mt-1">Manage wallet associations, privacy settings, and active session.</p>
        </div>

        <div className="space-y-6">
          {/* Wallet Info Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-4">
              <Key className="h-5 w-5 text-cyan-400" />
              <h3 className="text-base font-bold text-white">Connected Wallet</h3>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Your primary EVM wallet used to sign in and anchor credentials.
            </p>
            <div className="rounded-lg bg-slate-950 p-3 font-mono text-xs text-cyan-300 border border-slate-800 break-all select-all">
              {user?.walletAddress || "0x71C845137F73612FACb1C1E6e3e1A144e5904F2E"}
            </div>
          </div>

          {/* Privacy (§11 Compliance) */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-5 w-5 text-emerald-400" />
              <h3 className="text-base font-bold text-white">On-Chain Privacy</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              CertifiedPass never uploads your personal identity, email address, or contact info to the blockchain. All on-chain records consist strictly of cryptographic SHA-256 digests.
            </p>
          </div>

          {/* Session Disconnect */}
          <div className="rounded-2xl border border-red-500/20 bg-red-950/10 p-6 backdrop-blur-md flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-red-300">Sign Out Session</h4>
              <p className="text-xs text-slate-400">Clear local JWT and disconnect wallet signature.</p>
            </div>
            <Button variant="danger" size="sm" onClick={logout} className="gap-1.5">
              <LogOut className="h-4 w-4" /> Disconnect
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

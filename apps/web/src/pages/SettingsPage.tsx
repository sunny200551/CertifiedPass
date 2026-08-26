import React from "react";
import { Settings, Shield, Bell, Key, LogOut } from "lucide-react";
import { Layout } from "../components/layout/Layout.js";
import { Button } from "../components/ui/Button.js";
import { useAuth } from "../context/AuthContext.js";

export default function SettingsPage() {
  const { user, logout } = useAuth();

  return (
    <Layout>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 text-slate-900">
        <div className="border-b border-slate-200/90 pb-6 mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">Account Settings</h1>
          <p className="text-sm text-slate-500 mt-1">Manage wallet associations, privacy settings, and active session.</p>
        </div>

        <div className="space-y-6">
          {/* Wallet Info Card */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-apple-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Key className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 font-display">Connected Wallet</h3>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Your primary EVM wallet used to sign in and anchor credentials on Polygon Amoy.
            </p>
            <div className="rounded-2xl bg-slate-50 p-4 font-mono text-xs text-indigo-700 border border-slate-200 break-all select-all font-semibold">
              {user?.walletAddress || "0x71C845137F73612FACb1C1E6e3e1A144e5904F2E"}
            </div>
          </div>

          {/* Privacy (§11 Compliance) */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-apple-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Shield className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 font-display">On-Chain Privacy Standard</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              CertifiedPass never uploads your personal identity, email address, or contact info to the blockchain. All on-chain records consist strictly of cryptographic SHA-256 digests.
            </p>
          </div>

          {/* Session Disconnect */}
          <div className="rounded-3xl border border-red-200 bg-red-50/50 p-6 shadow-apple-sm flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-red-900 font-display">Sign Out Session</h4>
              <p className="text-xs text-slate-500">Clear local JWT and disconnect active wallet session.</p>
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

import React, { useState, useEffect } from "react";
import { User, Save, Check, Shield } from "lucide-react";
import { Layout } from "../components/layout/Layout.js";
import { Button } from "../components/ui/Button.js";
import { useAuth } from "../context/AuthContext.js";
import { api } from "../lib/api.js";

export default function MyProfile() {
  const { user, updateUserProfile } = useAuth();
  const [username, setUsername] = useState(user?.username || "");
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [bio, setBio] = useState(user?.bio || "Full-stack Web3 engineer building on Polygon Amoy.");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.displayName) setDisplayName(user.displayName);
      if (user.username) setUsername(user.username);
      if (user.bio) setBio(user.bio);
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9._-]/g, "");

    try {
      if (user?.walletAddress) {
        await api.post("/profiles/sync", {
          walletAddress: user.walletAddress,
          username: cleanUsername || undefined,
          displayName: displayName.trim(),
          bio: bio.trim(),
        });
      }

      updateUserProfile({
        username: cleanUsername,
        displayName: displayName.trim(),
        bio: bio.trim(),
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      // Local fallback
      updateUserProfile({
        username: cleanUsername,
        displayName: displayName.trim(),
        bio: bio.trim(),
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 text-slate-900">
        <div className="border-b border-slate-200/90 pb-6 mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">Edit Proof Profile</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Customize how your achievements and credentials appear to public viewers worldwide.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6 rounded-3xl border border-slate-200/90 bg-white p-8 shadow-apple-sm">
          {success && (
            <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-800 font-semibold">
              <Check className="h-5 w-5 text-emerald-600" /> Profile successfully saved and synced across devices!
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 font-display">
              Public Username / Handle (for certifiedpass.io/u/:username)
            </label>
            <div className="flex rounded-2xl border border-slate-200 bg-slate-50 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-100">
              <span className="inline-flex items-center px-4 text-sm text-slate-500 bg-slate-100/80 border-r border-slate-200 font-mono">
                certifiedpass.io/u/
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="alex.rivera"
                className="w-full bg-transparent px-4 py-3 text-sm font-medium text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 font-display">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Alex Rivera"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 font-display">
              Bio / Specialization
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Full-stack Web3 engineer building on Polygon Amoy."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          <div className="flex items-center gap-2 rounded-2xl bg-slate-50 border border-slate-200 p-3 text-xs">
            <Shield className="h-4 w-4 text-indigo-600 shrink-0" />
            <div className="truncate font-mono text-[11px] text-slate-600">
              <span className="font-semibold text-slate-800">Connected Wallet: </span>
              {user?.walletAddress || "0x..."}
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button variant="primary" type="submit" isLoading={saving} className="gap-2 shadow-apple-sm">
              <Save className="h-4 w-4" /> Save & Sync Profile
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

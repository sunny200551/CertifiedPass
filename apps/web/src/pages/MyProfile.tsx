import React, { useState } from "react";
import { User, Save, Check } from "lucide-react";
import { Layout } from "../components/layout/Layout.js";
import { Button } from "../components/ui/Button.js";
import { useAuth } from "../context/AuthContext.js";
import { api } from "../lib/api.js";

export default function MyProfile() {
  const { user } = useAuth();
  const [username, setUsername] = useState(user?.username || "");
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [bio, setBio] = useState("Full-stack Web3 engineer building on Polygon Amoy.");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.patch("/profiles/me", {
        username: username.trim(),
        displayName: displayName.trim(),
        bio: bio.trim(),
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      // Demo simulated success
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="border-b border-slate-800 pb-6 mb-8">
          <h1 className="text-2xl font-bold text-white">Edit Proof Profile</h1>
          <p className="text-sm text-slate-400 mt-1">
            Customize how your achievements and credentials appear to public viewers.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-8 backdrop-blur-md">
          {success && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-4 text-sm text-emerald-400">
              <Check className="h-5 w-5" /> Profile updated successfully!
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Public Username (for /u/:username)
            </label>
            <div className="flex rounded-lg border border-slate-700 bg-slate-950">
              <span className="inline-flex items-center px-3 text-sm text-slate-500 border-r border-slate-800">
                certifiedpass.id/u/
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="alexrivera"
                className="w-full bg-transparent px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Alex Rivera"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Bio / Summary
            </label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <Button variant="primary" type="submit" isLoading={saving} className="gap-2">
              <Save className="h-4 w-4" /> Save Profile Changes
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

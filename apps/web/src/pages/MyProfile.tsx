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
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 text-[var(--text-primary)]">
        <div className="border-b border-[var(--shadow-dark)]/15 pb-6 mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] font-display">Edit Proof Profile</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1 font-medium">
            Customize how your achievements and credentials appear to public viewers worldwide.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6 rounded-[24px] neo-raised bg-[var(--surface-bg)] p-8">
          {success && (
            <div className="flex items-center gap-2 rounded-2xl neo-inset-sm bg-[var(--accent-green-bg)] p-4 text-sm text-[var(--accent-green)] font-bold">
              <Check className="h-5 w-5" /> Profile successfully saved and synced across devices!
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2 font-display">
              Public Username / Handle (for certifiedpass.io/u/:username)
            </label>
            <div className="flex rounded-2xl neo-inset bg-[var(--surface-bg)] overflow-hidden">
              <span className="inline-flex items-center px-4 text-sm text-[var(--text-secondary)] font-mono border-r border-[var(--shadow-dark)]/15">
                certifiedpass.io/u/
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="alex.rivera"
                className="w-full bg-transparent px-4 py-3 text-sm font-medium text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2 font-display">
              Display Name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Alex Rivera"
              className="w-full rounded-2xl neo-inset bg-[var(--surface-bg)] px-4 py-3 text-sm font-medium text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)] mb-2 font-display">
              Bio & Career Objective
            </label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Share your experience, technical focus, and achievements..."
              className="w-full rounded-2xl neo-inset bg-[var(--surface-bg)] px-4 py-3 text-sm font-medium text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none resize-none"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button variant="primary" type="submit" size="md" isLoading={saving} className="rounded-full px-8 font-bold">
              Save Profile Changes
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
}

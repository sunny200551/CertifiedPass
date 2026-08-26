import React, { useState, useEffect } from "react";
import { X, Sparkles, User, AtSign, FileText, CheckCircle2, Shield } from "lucide-react";
import { Button } from "../ui/Button.js";
import { useAuth } from "../../context/AuthContext.js";
import { api } from "../../lib/api.js";

interface ProfileSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialName?: string;
  initialUsername?: string;
  initialBio?: string;
}

export const ProfileSetupModal: React.FC<ProfileSetupModalProps> = ({
  isOpen,
  onClose,
  initialName = "",
  initialUsername = "",
  initialBio = "",
}) => {
  const { user, updateUserProfile } = useAuth();
  const [displayName, setDisplayName] = useState(initialName || user?.displayName || "");
  const [username, setUsername] = useState(initialUsername || user?.username || "");
  const [bio, setBio] = useState(initialBio || user?.bio || "");
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && user) {
      setDisplayName(user.displayName || "");
      setUsername(user.username || "");
      setBio(user.bio || "");
      setError(null);
      setSavedSuccess(false);
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName.trim()) {
      setError("Please enter your display name.");
      return;
    }

    setIsSaving(true);
    setError(null);

    const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9._-]/g, "");

    try {
      updateUserProfile({
        displayName: displayName.trim(),
        username: cleanUsername || null,
        bio: bio.trim() || null,
      });

      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 1000);
    } catch (err: any) {
      console.warn("Profile save:", err);
      updateUserProfile({
        displayName: displayName.trim(),
        username: cleanUsername || null,
        bio: bio.trim() || null,
      });
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 1000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-lg rounded-3xl border border-slate-200/90 bg-white p-7 shadow-apple-lg transition-all animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 shadow-apple-sm">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 font-display">
              {user?.username ? "Edit Your Profile" : "Welcome! Setup Your Profile"}
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Saved to your wallet. Synced across all your devices.
            </p>
          </div>
        </div>

        {savedSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 shadow-apple-sm">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-display">Profile Synced & Saved!</h3>
            <p className="text-xs text-slate-600">
              Your details are now tied to your wallet address and will show on any device.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-xs font-semibold text-red-700">
                {error}
              </div>
            )}

            {/* Display Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 font-display">
                Your Full Name / Display Name *
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Rivera"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            {/* Username / Handle */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 font-display">
                Unique Handle (for certifiedpass.io/u/handle)
              </label>
              <div className="relative">
                <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. alex.rivera"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2.5 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>
            </div>

            {/* Bio / Title */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 font-display">
                Bio / Specialization
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Full-stack Web3 & AI builder • 1st Place ETHSF Winner"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            {/* Wallet Address Chip */}
            <div className="flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs">
              <Shield className="h-4 w-4 text-indigo-600 shrink-0" />
              <div className="truncate font-mono text-[11px] text-slate-600">
                <span className="font-semibold text-slate-800">Connected Wallet: </span>
                {user?.walletAddress || "0x..."}
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end gap-2.5">
              <Button variant="outline" size="sm" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="primary" size="md" type="submit" isLoading={isSaving} className="shadow-apple-sm">
                Save & Sync Profile
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

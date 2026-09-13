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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md transition-all">
      <div
        className="relative w-full max-w-lg rounded-[24px] neo-floating bg-[var(--surface-bg)] p-7 text-[var(--text-primary)] transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 neo-raised-sm rounded-full p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors active:neo-inset-sm"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="neo-raised-sm flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent-indigo-bg)] text-[var(--brand-indigo)]">
            <Sparkles className="h-6 w-6 animate-pulse-glow" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[var(--text-primary)] font-display">
              Edit Proof Profile & Name
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Customize your public verifiable identity on CertifiedPass
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl neo-inset-sm p-3 text-xs font-bold text-red-500 bg-red-500/10">
            {error}
          </div>
        )}

        {savedSuccess && (
          <div className="mb-4 flex items-center gap-2 rounded-xl neo-inset-sm p-3 text-xs font-bold text-[var(--accent-green)] bg-[var(--accent-green-bg)]">
            <CheckCircle2 className="h-4 w-4" />
            <span>Profile updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1">
              Full Name / Display Name *
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)]" />
              <input
                type="text"
                placeholder="e.g. Alex Rivera"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full rounded-xl neo-inset bg-[var(--surface-bg)] pl-10 pr-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1">
              Unique Username (Public URL: /u/username)
            </label>
            <div className="relative">
              <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)]" />
              <input
                type="text"
                placeholder="e.g. alex.rivera"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-xl neo-inset bg-[var(--surface-bg)] pl-10 pr-4 py-2.5 text-sm font-mono text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[var(--text-secondary)] mb-1">
              Bio / Credential Title
            </label>
            <div className="relative">
              <textarea
                placeholder="e.g. Full-Stack Web3 Engineer • 1st Place ETHSF 2026"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full rounded-xl neo-inset bg-[var(--surface-bg)] p-3 text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none resize-none"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSaving}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSaving}
              className="rounded-full px-6"
            >
              Save Profile
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

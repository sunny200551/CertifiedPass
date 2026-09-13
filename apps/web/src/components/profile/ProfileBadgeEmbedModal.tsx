import React, { useState } from "react";
import { Copy, Check, Code, X, Sparkles, ExternalLink } from "lucide-react";
import { Button } from "../ui/Button.js";
import { getAppBaseUrl } from "../../lib/urls.js";

interface ProfileBadgeEmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
  displayName: string;
}

export const ProfileBadgeEmbedModal: React.FC<ProfileBadgeEmbedModalProps> = ({
  isOpen,
  onClose,
  username,
  displayName,
}) => {
  const [activeTab, setActiveTab] = useState<"markdown" | "html">("markdown");
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const profileUrl = `${getAppBaseUrl()}/u/${encodeURIComponent(username)}`;
  const badgeImageUrl = `https://img.shields.io/badge/CertifiedPass-Verified%20Holder-4f46e5?style=for-the-badge&logo=polygon&logoColor=white`;

  const markdownSnippet = `[![CertifiedPass Verified Profile](${badgeImageUrl})](${profileUrl})`;
  const htmlSnippet = `<a href="${profileUrl}" target="_blank" rel="noopener noreferrer">
  <img src="${badgeImageUrl}" alt="CertifiedPass Verified Profile" />
</a>`;

  const currentSnippet = activeTab === "markdown" ? markdownSnippet : htmlSnippet;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md transition-all">
      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-[24px] neo-floating bg-[var(--surface-bg)] p-7 text-[var(--text-primary)]">
        <div className="flex items-center justify-between border-b border-[var(--shadow-dark)]/15 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="neo-raised-sm flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent-indigo-bg)] text-[var(--brand-indigo)]">
              <Code className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--text-primary)] font-display">Embed Profile Badge</h3>
              <p className="text-xs text-[var(--text-secondary)]">Showcase your verified achievements anywhere</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="neo-raised-sm rounded-full p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors active:neo-inset-sm"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="my-5 space-y-4">
          {/* Live Preview */}
          <div className="rounded-2xl neo-inset bg-[var(--surface-bg)] p-4 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] font-display">
              Live Badge Preview
            </span>
            <div className="pt-1 flex items-center justify-center bg-white p-4 rounded-xl neo-raised-sm">
              <a href={profileUrl} target="_blank" rel="noopener noreferrer">
                <img
                  src={badgeImageUrl}
                  alt="CertifiedPass Verified Profile"
                  className="rounded hover:opacity-90 transition-opacity"
                />
              </a>
            </div>
          </div>

          {/* Format Tabs (Neomorphic Inset Pill) */}
          <div className="flex rounded-full neo-inset bg-[var(--surface-bg)] p-1">
            <button
              onClick={() => setActiveTab("markdown")}
              className={`flex-1 rounded-full py-1.5 text-xs font-bold transition-all ${
                activeTab === "markdown"
                  ? "neo-pill-active text-[var(--brand-indigo)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              GitHub README (Markdown)
            </button>
            <button
              onClick={() => setActiveTab("html")}
              className={`flex-1 rounded-full py-1.5 text-xs font-bold transition-all ${
                activeTab === "html"
                  ? "neo-pill-active text-[var(--brand-indigo)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              HTML Website Embed
            </button>
          </div>

          {/* Code Box */}
          <div className="relative">
            <pre className="rounded-2xl neo-inset bg-[var(--surface-bg)] p-4 font-mono text-xs text-[var(--text-primary)] overflow-x-auto select-all leading-relaxed">
              {currentSnippet}
            </pre>
          </div>
        </div>

        <div className="border-t border-[var(--shadow-dark)]/15 pt-4 flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={onClose} className="rounded-full">
            Close
          </Button>
          <Button variant="primary" size="sm" onClick={handleCopy} className="gap-1.5 rounded-full px-6">
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied!" : "Copy Code Snippet"}
          </Button>
        </div>
      </div>
    </div>
  );
};

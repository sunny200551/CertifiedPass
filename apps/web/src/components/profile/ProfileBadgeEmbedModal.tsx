import React, { useState } from "react";
import { Copy, Check, Code, X, Sparkles, ExternalLink } from "lucide-react";
import { Button } from "../ui/Button.js";

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

  const profileUrl = `${window.location.origin}/u/${encodeURIComponent(username)}`;
  const badgeImageUrl = `https://img.shields.io/badge/CertifiedPass-Verified%20Holder-06b6d4?style=for-the-badge&logo=polygon&logoColor=white`;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Code className="h-5 w-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Embed Verified Profile Badge</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <p className="text-xs text-slate-400 leading-relaxed">
            Embed your real-time verified Proof Profile badge in your GitHub README, portfolio website, or developer resume.
          </p>

          {/* Badge Preview */}
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 text-center">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              Badge Preview
            </p>
            <div className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2 text-xs font-bold text-slate-950 shadow-lg shadow-cyan-500/20">
              <Sparkles className="h-4 w-4" />
              <span>CertifiedPass Verified • @{username}</span>
            </div>
          </div>

          {/* Format Tabs */}
          <div className="flex gap-2 border-b border-slate-800 pb-2">
            <button
              onClick={() => setActiveTab("markdown")}
              className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
                activeTab === "markdown"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              GitHub Markdown
            </button>
            <button
              onClick={() => setActiveTab("html")}
              className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
                activeTab === "html"
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              HTML Code
            </button>
          </div>

          {/* Code Snippet Box */}
          <div className="relative rounded-xl border border-slate-800 bg-slate-950 p-3">
            <pre className="text-[11px] font-mono text-cyan-300 overflow-x-auto whitespace-pre-wrap break-all">
              {currentSnippet}
            </pre>
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="primary" size="sm" onClick={handleCopy} className="gap-1.5">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied to Clipboard!" : "Copy Code Snippet"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

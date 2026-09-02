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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-7 shadow-2xl text-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Code className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">Embed Profile Badge</h3>
              <p className="text-xs text-slate-500">Showcase your verified achievements anywhere</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="my-5 space-y-4">
          {/* Live Preview */}
          <div className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-4 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-display">
              Live Badge Preview
            </span>
            <div className="pt-1 flex items-center justify-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <a href={profileUrl} target="_blank" rel="noopener noreferrer">
                <img
                  src={badgeImageUrl}
                  alt="CertifiedPass Verified Profile"
                  className="rounded hover:opacity-90 transition-opacity"
                />
              </a>
            </div>
          </div>

          {/* Format Tabs */}
          <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200/60">
            <button
              onClick={() => setActiveTab("markdown")}
              className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all ${
                activeTab === "markdown"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              GitHub README (Markdown)
            </button>
            <button
              onClick={() => setActiveTab("html")}
              className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all ${
                activeTab === "html"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Portfolio Website (HTML)
            </button>
          </div>

          {/* Code Block */}
          <div className="relative">
            <pre className="rounded-2xl border border-slate-200 bg-slate-900 p-4 text-xs font-mono text-slate-200 overflow-x-auto select-all shadow-inner">
              {currentSnippet}
            </pre>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4 flex items-center justify-between">
          <span className="text-xs text-slate-400">Clicking badge opens your proof profile</span>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleCopy} className="gap-1.5">
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied Snippet" : "Copy Code"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

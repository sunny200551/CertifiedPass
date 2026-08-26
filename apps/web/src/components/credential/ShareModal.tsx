import React, { useState } from "react";
import { Copy, Check, ExternalLink, Share2, X, Linkedin, Twitter } from "lucide-react";
import { Button } from "../ui/Button.js";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  credentialId: string;
  title: string;
  issuerName: string;
  issuedAt: string;
  credentialHash: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  credentialId,
  title,
  issuerName,
  issuedAt,
  credentialHash,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const credentialUrl = `${window.location.origin}/c/${encodeURIComponent(credentialId)}`;

  const copyUrl = () => {
    navigator.clipboard.writeText(credentialUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // LinkedIn Certification URL generator
  const issueDateObj = new Date(issuedAt);
  const issueYear = issueDateObj.getFullYear();
  const issueMonth = issueDateObj.getMonth() + 1;

  const linkedinAddUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(
    title
  )}&organizationName=${encodeURIComponent(
    issuerName
  )}&issueYear=${issueYear}&issueMonth=${issueMonth}&certUrl=${encodeURIComponent(
    credentialUrl
  )}&certId=${encodeURIComponent(credentialHash.slice(0, 16))}`;

  // Twitter / X share text
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `Proud to share my verified credential for "${title}" from ${issuerName}! 🏆\n\nCryptographically verified on Polygon Amoy EVM via @CertifiedPass:`
  )}&url=${encodeURIComponent(credentialUrl)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Share Verifiable Credential</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {/* Shareable Link Input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Public Verification Link
            </label>
            <div className="flex rounded-lg border border-slate-700 bg-slate-950 p-1.5">
              <input
                type="text"
                readOnly
                value={credentialUrl}
                className="w-full bg-transparent px-2 text-xs font-mono text-cyan-300 focus:outline-none"
              />
              <Button variant="secondary" size="sm" onClick={copyUrl} className="shrink-0 text-xs py-1">
                {copied ? <Check className="h-3.5 w-3.5 mr-1" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
          </div>

          {/* 1-Click Social Shares */}
          <div className="pt-2 space-y-2.5">
            {/* LinkedIn Add to Profile */}
            <a
              href={linkedinAddUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full rounded-xl border border-blue-500/30 bg-blue-500/10 p-3.5 hover:bg-blue-500/20 hover:border-blue-500/50 transition-all text-blue-300 text-xs font-semibold group"
            >
              <div className="flex items-center gap-2.5">
                <Linkedin className="h-4 w-4 text-blue-400" />
                <span>Add to LinkedIn Profile (Licenses & Certifications)</span>
              </div>
              <ExternalLink className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </a>

            {/* X / Twitter */}
            <a
              href={twitterShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full rounded-xl border border-slate-700 bg-slate-800/60 p-3.5 hover:bg-slate-800 transition-all text-slate-200 text-xs font-semibold group"
            >
              <div className="flex items-center gap-2.5">
                <Twitter className="h-4 w-4 text-cyan-400" />
                <span>Post Announcement on X (Twitter)</span>
              </div>
              <ExternalLink className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>

        <div className="mt-6 border-t border-slate-800 pt-4 text-center">
          <p className="text-[11px] text-slate-500">
            Anyone with this link can verify the Polygon on-chain hash without a crypto wallet.
          </p>
        </div>
      </div>
    </div>
  );
};

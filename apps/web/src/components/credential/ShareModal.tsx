import React, { useState } from "react";
import { Copy, Check, ExternalLink, Share2, X, Linkedin, Twitter } from "lucide-react";
import { Button } from "../ui/Button.js";
import { getCertificateUrl } from "../../lib/urls.js";

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

  const credentialUrl = getCertificateUrl(credentialId);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md transition-all">
      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-[24px] neo-floating bg-[var(--surface-bg)] p-7 text-[var(--text-primary)]">
        <div className="flex items-center justify-between border-b border-[var(--shadow-dark)]/15 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="neo-raised-sm flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent-indigo-bg)] text-[var(--brand-indigo)]">
              <Share2 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--text-primary)] font-display">Share Credential</h3>
              <p className="text-xs text-[var(--text-secondary)]">Publish your achievement across platforms</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="neo-raised-sm rounded-full p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors active:neo-inset-sm"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="my-6 space-y-4">
          {/* 1-Click LinkedIn Integration */}
          <div className="rounded-2xl neo-raised bg-[var(--surface-bg)] p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-[var(--accent-blue)] font-display">
                <Linkedin className="h-4 w-4" />
                <span>Add to LinkedIn Certifications</span>
              </div>
              <span className="rounded-full neo-inset-sm bg-[var(--accent-blue-bg)] px-2.5 py-0.5 text-[10px] font-bold text-[var(--accent-blue)]">
                1-Click
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Instantly fills in certificate name, issuing organization, issue date, and on-chain verification URL into your LinkedIn profile.
            </p>
            <a
              href={linkedinAddUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full neo-btn-primary px-4 py-2 text-xs font-bold text-white transition-all mt-1"
            >
              Add to LinkedIn Profile <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Twitter / X Share */}
          <div className="rounded-2xl neo-raised bg-[var(--surface-bg)] p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-[var(--text-primary)] font-display">
                <Twitter className="h-4 w-4 text-[var(--text-primary)]" />
                <span>Post on X / Twitter</span>
              </div>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Broadcast your verified achievement with pre-filled announcement copy and live link.
            </p>
            <a
              href={twitterShareUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full neo-btn px-4 py-2 text-xs font-bold text-[var(--text-primary)] transition-all mt-1 bg-[var(--surface-bg)]"
            >
              Post to X <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Copy Direct Public Link */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--text-secondary)]">
              Direct Public Verification Link
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={credentialUrl}
                className="w-full rounded-xl neo-inset bg-[var(--surface-bg)] px-3.5 py-2 text-xs font-mono text-[var(--text-primary)] focus:outline-none select-all"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={copyUrl}
                className="shrink-0 gap-1 text-xs rounded-full"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-[var(--accent-green)]" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-[var(--shadow-dark)]/15 pt-4 flex justify-end">
          <Button variant="secondary" size="sm" onClick={onClose} className="rounded-full px-6">
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};

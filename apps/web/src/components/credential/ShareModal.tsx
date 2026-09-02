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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-7 shadow-2xl z-10 text-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Share2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">Share Credential</h3>
              <p className="text-xs text-slate-500">Publish your achievement across platforms</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="my-6 space-y-4">
          {/* 1-Click LinkedIn Integration */}
          <div className="rounded-2xl border border-blue-200/80 bg-blue-50/50 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-blue-900 font-display">
                <Linkedin className="h-4 w-4 text-blue-600" />
                <span>Add to LinkedIn Certifications</span>
              </div>
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-800">
                1-Click
              </span>
            </div>
            <p className="text-xs text-blue-800/80 leading-relaxed">
              Instantly fills in certificate name, issuing organization, issue date, and on-chain verification URL into your LinkedIn profile.
            </p>
            <a
              href={linkedinAddUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-apple-sm hover:bg-blue-700 transition-all mt-1"
            >
              Add to LinkedIn Profile <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Twitter / X Share */}
          <div className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900 font-display">
                <Twitter className="h-4 w-4 text-slate-900" />
                <span>Post on X / Twitter</span>
              </div>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Broadcast your verified achievement with pre-filled announcement copy and live link.
            </p>
            <a
              href={twitterShareUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-apple-sm hover:bg-slate-800 transition-all mt-1"
            >
              Post to X <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Copy Direct Public Link */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Direct Public Verification Link
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={credentialUrl}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-mono text-slate-800 focus:outline-none select-all"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={copyUrl}
                className="shrink-0 gap-1 text-xs"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-4 flex justify-end">
          <Button variant="secondary" size="sm" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};

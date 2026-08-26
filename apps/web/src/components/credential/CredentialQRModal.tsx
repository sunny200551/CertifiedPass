import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { X, Copy, ExternalLink, Check } from "lucide-react";
import { Button } from "../ui/Button.js";

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  credentialId: string;
  title: string;
}

export const CredentialQRModal: React.FC<QRModalProps> = ({
  isOpen,
  onClose,
  credentialId,
  title,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const verifyUrl = `${window.location.origin}/c/${credentialId}`;

  const copyLink = () => {
    navigator.clipboard.writeText(verifyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center">
          <h3 className="text-lg font-bold text-white">Scan to Verify</h3>
          <p className="mt-1 text-xs text-slate-400 line-clamp-1">{title}</p>
        </div>

        <div className="my-6 flex justify-center">
          <div className="rounded-xl bg-white p-4 shadow-inner">
            <QRCodeSVG value={verifyUrl} size={180} level="H" includeMargin={false} />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg bg-slate-950 px-3 py-2 text-xs border border-slate-800">
            <span className="truncate text-slate-400 font-mono text-[11px]">{verifyUrl}</span>
            <button
              onClick={copyLink}
              className="ml-2 flex items-center gap-1 font-semibold text-cyan-400 hover:text-cyan-300"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          <Button variant="secondary" className="w-full" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};

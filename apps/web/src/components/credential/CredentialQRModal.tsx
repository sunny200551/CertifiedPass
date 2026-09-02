import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { X, Copy, ExternalLink, Check, Smartphone, ShieldCheck, Download } from "lucide-react";
import { Button } from "../ui/Button.js";
import { getCertificateUrl } from "../../lib/urls.js";

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

  const verifyUrl = getCertificateUrl(credentialId);

  const copyLink = () => {
    navigator.clipboard.writeText(verifyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-md transition-all">
      <div className="relative w-full max-w-sm rounded-3xl border border-slate-200/90 bg-white p-7 shadow-2xl text-slate-900">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center space-y-1">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-2">
            <Smartphone className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 font-display">Scan to Verify</h3>
          <p className="text-xs text-slate-500 line-clamp-1 px-2">{title}</p>
        </div>

        {/* High Resolution Crisp QR Code */}
        <div className="my-6 flex justify-center">
          <div className="rounded-2xl bg-white p-4 border border-slate-200/90 shadow-apple-md">
            <QRCodeSVG value={verifyUrl} size={190} level="H" includeMargin={false} />
          </div>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-700 font-semibold mb-4 bg-emerald-50 py-1.5 px-3 rounded-full border border-emerald-200/80">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>Universal Public Access — No Wallet Required</span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3.5 py-2.5 text-xs border border-slate-200/90">
            <span className="truncate text-slate-600 font-mono text-[11px] select-all">{verifyUrl}</span>
            <button
              onClick={copyLink}
              className="ml-2 flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-700 flex-shrink-0"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={copyLink}
              className="w-full text-xs gap-1.5"
            >
              <Copy className="h-3.5 w-3.5" />
              Copy URL
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => window.open(verifyUrl, "_blank")}
              className="w-full text-xs gap-1.5"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Open Page
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-md transition-all">
      <div className="relative w-full max-w-sm rounded-[24px] neo-floating bg-[var(--surface-bg)] p-7 text-[var(--text-primary)]">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 neo-raised-sm rounded-full p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors active:neo-inset-sm"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="text-center space-y-1">
          <div className="mx-auto neo-raised-sm flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent-indigo-bg)] text-[var(--brand-indigo)] mb-2">
            <Smartphone className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-bold text-[var(--text-primary)] font-display">Scan to Verify</h3>
          <p className="text-xs text-[var(--text-secondary)] line-clamp-1 px-2">{title}</p>
        </div>

        {/* High Resolution Crisp QR Code (Neomorphic Card) */}
        <div className="my-6 flex justify-center">
          <div className="rounded-2xl bg-white p-4 neo-raised-sm">
            <QRCodeSVG value={verifyUrl} size={190} level="H" includeMargin={false} />
          </div>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-xs text-[var(--accent-green)] font-bold mb-4 bg-[var(--accent-green-bg)] py-2 px-3.5 rounded-full neo-inset-sm">
          <ShieldCheck className="h-4 w-4 text-[var(--accent-green)] shrink-0" />
          <span>Universal Public Access — No Wallet Required</span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-xl neo-inset bg-[var(--surface-bg)] px-3.5 py-2.5 text-xs">
            <span className="truncate text-[var(--text-secondary)] font-mono text-[11px] select-all">{verifyUrl}</span>
            <button
              onClick={copyLink}
              className="ml-2 flex items-center gap-1 font-bold text-[var(--brand-indigo)] hover:text-[var(--brand-violet)] flex-shrink-0"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-[var(--accent-green)]" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={copyLink}
              className="w-full text-xs gap-1.5 rounded-full"
            >
              <Copy className="h-3.5 w-3.5" />
              Copy URL
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => window.open(verifyUrl, "_blank")}
              className="w-full text-xs gap-1.5 rounded-full"
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

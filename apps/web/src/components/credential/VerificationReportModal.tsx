import React, { useRef } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Printer,
  X,
  ExternalLink,
  Copy,
  Check,
  Building2,
  User,
  DollarSign,
  Lock,
  Layers,
  Calendar,
  FileCheck2,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "../ui/Button.js";
import { getCertificateUrl, formatUsdc } from "../../lib/urls.js";

export interface VerificationReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  credentialId: string;
  title: string;
  status: "VERIFIED" | "VALID" | "REVOKED" | "UNVERIFIED" | string;
  freelancerName?: string | undefined;
  freelancerAddress?: string | undefined;
  clientName?: string | undefined;
  clientAddress?: string | undefined;
  settledAmount?: string | number | undefined;
  category?: string | undefined;
  jobId?: string | undefined;
  contractAddress?: string | undefined;
  oracleSignature?: string | undefined;
  ipfsCid?: string | undefined;
  timestamp?: string | undefined;
  network?: string | undefined;
  reason?: string | undefined;
}

export const VerificationReportModal: React.FC<VerificationReportModalProps> = ({
  isOpen,
  onClose,
  credentialId,
  title,
  status,
  freelancerName = "Verified Freelancer",
  freelancerAddress = "",
  clientName = "Escrow Client",
  clientAddress = "",
  settledAmount,
  category = "Web3 Milestone Attestation",
  jobId,
  contractAddress = "0xecA867d535f013805256e6925795479225A0587b",
  oracleSignature = "0x42f8366420a092c55660830e8115e9a443900990",
  ipfsCid = "QmPLAttestationProofCID77",
  timestamp,
  network = "Polygon PoS (Chain ID 137)",
  reason,
}) => {
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const isVerified = status === "VERIFIED" || status === "VALID";
  const isRevoked = status === "REVOKED";
  const formattedAmount = formatUsdc(settledAmount);
  const verifyUrl = getCertificateUrl(credentialId);
  const reportDate = timestamp ? new Date(timestamp).toLocaleString() : new Date().toLocaleString();

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-md transition-all">
      <div className="relative w-full max-w-3xl rounded-[24px] neo-floating bg-[var(--surface-bg)] text-[var(--text-primary)] transition-all overflow-hidden my-6">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-[var(--shadow-dark)]/15 px-6 py-4 bg-[var(--surface-bg)] print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="neo-raised-sm flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent-indigo-bg)] text-[var(--brand-indigo)] font-bold">
              <FileCheck2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--text-primary)] font-display">
                Certified Verification & Audit Report
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Official Sovereign Attestation & MultiSig Settlement Audit
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="neo-raised-sm rounded-full p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors active:neo-inset-sm"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Printable Report Content */}
        <div ref={reportRef} className="p-6 sm:p-8 space-y-6">
          {/* Top Status & Pass Title Banner */}
          <div
            className={`rounded-2xl neo-inset p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              isVerified
                ? "bg-[var(--surface-bg)]"
                : isRevoked
                ? "bg-rose-500/10"
                : "bg-[var(--accent-amber-bg)]"
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span
                  className={`text-base font-black tracking-wide ${
                    isVerified
                      ? "text-[var(--accent-green)]"
                      : isRevoked
                      ? "text-rose-500"
                      : "text-[var(--accent-amber)]"
                  }`}
                >
                  {isVerified
                    ? "🟢 CRYPTOGRAPHICALLY VERIFIED & AUTHENTIC"
                    : isRevoked
                    ? "🔴 REVOKED / INVALIDATED"
                    : "🟡 UNVERIFIED RECORD"}
                </span>
              </div>
              <h2 className="text-lg font-bold text-[var(--text-primary)] font-display pt-0.5">
                {title}
              </h2>
              <div className="text-xs text-[var(--text-secondary)] font-mono">
                Attestation ID: {credentialId}
              </div>
            </div>

            {formattedAmount && (
              <div className="text-left sm:text-right neo-raised-sm rounded-xl px-3 py-2 bg-[var(--surface-bg)]">
                <div className="text-[10px] uppercase font-bold text-[var(--text-secondary)]">Settled Escrow</div>
                <div className="text-base font-extrabold text-[var(--accent-green)] font-mono">{formattedAmount}</div>
              </div>
            )}
          </div>

          {/* Participant Verification Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Recipient / Freelancer */}
            <div className="rounded-2xl neo-raised p-4 bg-[var(--surface-bg)] space-y-2">
              <div className="flex items-center justify-between font-bold text-[var(--text-secondary)]">
                <div className="flex items-center gap-1.5">
                  <User className="h-4 w-4 text-[var(--accent-purple)]" />
                  <span>Recipient / Freelancer</span>
                </div>
                <span className="neo-inset-sm rounded-full bg-[var(--accent-purple-bg)] text-[var(--accent-purple)] px-2 py-0.5 text-[10px]">
                  Signer A
                </span>
              </div>
              <div className="text-sm font-bold text-[var(--text-primary)] font-display">
                {freelancerName}
              </div>
              {freelancerAddress && (
                <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-secondary)] neo-inset-sm rounded-xl p-2 bg-[var(--surface-bg)]">
                  <span className="truncate max-w-[200px]">{freelancerAddress}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(freelancerAddress, "f_addr")}
                    className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-0.5"
                  >
                    {copiedKey === "f_addr" ? (
                      <Check className="h-3.5 w-3.5 text-[var(--accent-green)]" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Sponsor / Client */}
            <div className="rounded-2xl neo-raised p-4 bg-[var(--surface-bg)] space-y-2">
              <div className="flex items-center justify-between font-bold text-[var(--text-secondary)]">
                <div className="flex items-center gap-1.5">
                  <Building2 className="h-4 w-4 text-[var(--brand-indigo)]" />
                  <span>Authorized Issuer / Escrow Client</span>
                </div>
                <span className="neo-inset-sm rounded-full bg-[var(--accent-indigo-bg)] text-[var(--brand-indigo)] px-2 py-0.5 text-[10px]">
                  Signer B
                </span>
              </div>
              <div className="text-sm font-bold text-[var(--text-primary)] font-display">
                {clientName}
              </div>
              {clientAddress && (
                <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-secondary)] neo-inset-sm rounded-xl p-2 bg-[var(--surface-bg)]">
                  <span className="truncate max-w-[200px]">{clientAddress}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(clientAddress, "c_addr")}
                    className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-0.5"
                  >
                    {copiedKey === "c_addr" ? (
                      <Check className="h-3.5 w-3.5 text-[var(--accent-green)]" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Cryptographic Proof Details */}
          <div className="rounded-2xl neo-inset bg-[var(--surface-bg)] p-4 space-y-2.5 text-xs">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1.5 mb-1">
              <Lock className="h-3.5 w-3.5 text-[var(--brand-indigo)]" />
              Cryptographic MultiSig & Storage Attestations
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-1 border-b border-[var(--shadow-dark)]/10 gap-1">
              <span className="text-[var(--text-secondary)] font-medium">Settlement Blockchain Network:</span>
              <span className="font-mono text-[var(--text-primary)] font-bold text-[11px]">{network}</span>
            </div>

            {contractAddress && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-1 border-b border-[var(--shadow-dark)]/10 gap-1">
                <span className="text-[var(--text-secondary)] font-medium">Smart Contract (MultiSig Escrow Safe):</span>
                <span className="font-mono text-[var(--text-primary)] text-[11px] select-all">{contractAddress}</span>
              </div>
            )}

            {oracleSignature && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-1 border-b border-[var(--shadow-dark)]/10 gap-1">
                <span className="text-[var(--text-secondary)] font-medium">Oracle Cryptographic Signature:</span>
                <span className="font-mono text-[var(--text-primary)] text-[11px] truncate max-w-[280px] select-all">
                  {oracleSignature}
                </span>
              </div>
            )}

            {ipfsCid && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-1 border-b border-[var(--shadow-dark)]/10 gap-1">
                <span className="text-[var(--text-secondary)] font-medium">IPFS Decentralized Proof CID:</span>
                <a
                  href={`https://ipfs.io/ipfs/${ipfsCid}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-[var(--brand-indigo)] hover:underline text-[11px] flex items-center gap-1"
                >
                  {ipfsCid} <ExternalLink className="h-3 w-3 print:hidden" />
                </a>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-1 gap-1">
              <span className="text-[var(--text-secondary)] font-medium">Settlement Timestamp:</span>
              <span className="font-mono text-[var(--text-primary)] text-[11px]">{reportDate}</span>
            </div>
          </div>

          {/* Live QR Verification Footer */}
          <div className="rounded-2xl neo-raised bg-[var(--surface-bg)] p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="text-xs font-bold text-[var(--brand-indigo)] flex items-center justify-center sm:justify-start gap-1.5">
                <ShieldCheck className="h-4 w-4 text-[var(--brand-indigo)]" />
                <span>Live Public Verification</span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)] max-w-sm">
                Scan this QR code with any smartphone camera or navigate to the URL to independently audit this credential on CertifiedPass.
              </p>
              <div className="text-[11px] font-mono text-[var(--brand-indigo)] break-all select-all font-semibold pt-1">
                {verifyUrl}
              </div>
            </div>

            <div className="p-2.5 bg-white rounded-xl neo-raised-sm shrink-0">
              <QRCodeSVG value={verifyUrl} size={90} level="M" />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-[var(--shadow-dark)]/15 bg-[var(--surface-bg)] px-6 py-4 flex items-center justify-between text-xs print:hidden">
          <span className="text-[var(--text-secondary)] font-mono text-[11px]">
            Security Audit Anchor • CertifiedPass Sovereign Registry
          </span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1.5 font-bold rounded-full">
              <Printer className="h-3.5 w-3.5" />
              <span>Print Report</span>
            </Button>
            <Button variant="primary" size="sm" onClick={onClose} className="font-bold rounded-full px-6">
              Done
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

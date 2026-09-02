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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-3xl border border-slate-200/90 bg-white shadow-2xl transition-all overflow-hidden my-6 text-slate-900">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/70 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200/60 font-bold">
              <FileCheck2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-display">
                Certified Verification & Audit Report
              </h3>
              <p className="text-xs text-slate-500">
                Official Sovereign Attestation & MultiSig Settlement Audit
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="gap-1.5 text-xs font-bold"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / Save PDF</span>
            </Button>
            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Content */}
        <div ref={reportRef} className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto print:max-h-none print:p-0">
          {/* Top Banner / Verification Badge */}
          <div
            className={`rounded-2xl border-2 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              isVerified
                ? "border-emerald-200 bg-emerald-50/60 text-emerald-950"
                : isRevoked
                ? "border-rose-200 bg-rose-50/60 text-rose-950"
                : "border-amber-200 bg-amber-50/60 text-amber-950"
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl shrink-0 shadow-sm ${
                  isVerified
                    ? "bg-emerald-600 text-white"
                    : isRevoked
                    ? "bg-rose-600 text-white"
                    : "bg-amber-600 text-white"
                }`}
              >
                {isVerified ? (
                  <ShieldCheck className="h-7 w-7" />
                ) : isRevoked ? (
                  <ShieldAlert className="h-7 w-7" />
                ) : (
                  <AlertTriangle className="h-7 w-7" />
                )}
              </div>
              <div>
                <div className="text-sm font-black uppercase tracking-wider">
                  {isVerified
                    ? "🟢 CRYPTOGRAPHICALLY VERIFIED & AUTHENTIC"
                    : isRevoked
                    ? "🔴 REVOKED / INVALIDATED RECORD"
                    : "🟡 UNVERIFIED / PENDING"}
                </div>
                <div className="text-xs font-mono text-slate-600 mt-0.5">
                  Registry Identifier: {credentialId}
                </div>
              </div>
            </div>

            <div className="text-left sm:text-right text-xs font-mono text-slate-500 shrink-0">
              <div>Audit Date: {reportDate}</div>
              <div className="font-semibold text-indigo-700">CertifiedPass Protocol</div>
            </div>
          </div>

          {/* Attestation Title & Settled Amount Summary */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="rounded-full bg-violet-100 text-violet-800 border border-violet-200 px-3 py-0.5 text-xs font-bold">
                {category}
              </span>
              <div className="flex items-center gap-1.5 bg-emerald-100/80 text-emerald-900 border border-emerald-300 px-3.5 py-1 rounded-xl">
                <DollarSign className="h-4 w-4 text-emerald-700" />
                <span className="text-sm font-black font-mono">{formattedAmount}</span>
              </div>
            </div>

            <h2 className="text-xl font-extrabold text-slate-950 font-display">
              {title}
            </h2>

            {reason && (
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {reason}
              </p>
            )}
          </div>

          {/* Participant Information: Freelancer & Client Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Freelancer Box */}
            <div className="rounded-2xl border-2 border-slate-200 p-4 bg-white space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <User className="h-4 w-4 text-violet-600" />
                  <span>Freelancer / Talent</span>
                </div>
                <span className="rounded-full bg-violet-50 text-violet-700 px-2 py-0.5 text-[10px] font-bold border border-violet-200">
                  Recipient
                </span>
              </div>
              <div className="text-sm font-bold text-slate-950">
                {freelancerName}
              </div>
              {freelancerAddress && (
                <div className="flex items-center justify-between text-xs font-mono text-slate-600 bg-slate-50 rounded-xl p-2 border border-slate-100">
                  <span className="truncate max-w-[210px]">{freelancerAddress}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(freelancerAddress, "f_addr")}
                    className="text-slate-400 hover:text-slate-600 p-0.5 print:hidden"
                  >
                    {copiedKey === "f_addr" ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Escrow Client Box */}
            <div className="rounded-2xl border-2 border-slate-200 p-4 bg-white space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <Building2 className="h-4 w-4 text-indigo-600" />
                  <span>Escrow Client / Sponsor</span>
                </div>
                <span className="rounded-full bg-indigo-50 text-indigo-700 px-2 py-0.5 text-[10px] font-bold border border-indigo-200">
                  Issuer & Patron
                </span>
              </div>
              <div className="text-sm font-bold text-slate-950">
                {clientName}
              </div>
              {clientAddress && (
                <div className="flex items-center justify-between text-xs font-mono text-slate-600 bg-slate-50 rounded-xl p-2 border border-slate-100">
                  <span className="truncate max-w-[210px]">{clientAddress}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(clientAddress, "c_addr")}
                    className="text-slate-400 hover:text-slate-600 p-0.5 print:hidden"
                  >
                    {copiedKey === "c_addr" ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Cryptographic Proof Details */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-2.5 text-xs">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5 mb-1">
              <Lock className="h-3.5 w-3.5 text-slate-500" />
              Cryptographic MultiSig & Storage Attestations
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-1 border-b border-slate-200/60 gap-1">
              <span className="text-slate-500 font-medium">Settlement Blockchain Network:</span>
              <span className="font-mono text-slate-800 font-bold text-[11px]">{network}</span>
            </div>

            {contractAddress && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-1 border-b border-slate-200/60 gap-1">
                <span className="text-slate-500 font-medium">Smart Contract (MultiSig Escrow Safe):</span>
                <span className="font-mono text-slate-800 text-[11px] select-all">{contractAddress}</span>
              </div>
            )}

            {oracleSignature && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-1 border-b border-slate-200/60 gap-1">
                <span className="text-slate-500 font-medium">Oracle Cryptographic Signature:</span>
                <span className="font-mono text-slate-800 text-[11px] truncate max-w-[280px] select-all">
                  {oracleSignature}
                </span>
              </div>
            )}

            {ipfsCid && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between py-1 border-b border-slate-200/60 gap-1">
                <span className="text-slate-500 font-medium">IPFS Decentralized Proof CID:</span>
                <a
                  href={`https://ipfs.io/ipfs/${ipfsCid}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-indigo-600 hover:underline text-[11px] flex items-center gap-1"
                >
                  {ipfsCid} <ExternalLink className="h-3 w-3 print:hidden" />
                </a>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between py-1 gap-1">
              <span className="text-slate-500 font-medium">Settlement Timestamp:</span>
              <span className="font-mono text-slate-800 text-[11px]">{reportDate}</span>
            </div>
          </div>

          {/* Live QR Verification Footer */}
          <div className="rounded-2xl border-2 border-indigo-100 bg-indigo-50/40 p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <div className="text-xs font-bold text-indigo-950 flex items-center justify-center sm:justify-start gap-1.5">
                <ShieldCheck className="h-4 w-4 text-indigo-600" />
                <span>Live Public Verification</span>
              </div>
              <p className="text-[11px] text-slate-600 max-w-sm">
                Scan this QR code with any smartphone camera or navigate to the URL to independently audit this credential on CertifiedPass.
              </p>
              <div className="text-[11px] font-mono text-indigo-700 break-all select-all font-semibold pt-1">
                {verifyUrl}
              </div>
            </div>

            <div className="p-2.5 bg-white rounded-xl border border-indigo-200 shadow-sm shrink-0">
              <QRCodeSVG value={verifyUrl} size={90} level="M" />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-100 bg-slate-50/70 px-6 py-4 flex items-center justify-between text-xs print:hidden">
          <span className="text-slate-500 font-mono text-[11px]">
            Security Audit Anchor • CertifiedPass Sovereign Registry
          </span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint} className="gap-1.5 font-bold">
              <Printer className="h-3.5 w-3.5" />
              <span>Print Report</span>
            </Button>
            <Button variant="primary" size="sm" onClick={onClose} className="font-bold">
              Done
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

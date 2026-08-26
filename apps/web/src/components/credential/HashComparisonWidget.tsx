import React, { useState } from "react";
import { Check, Copy, ExternalLink, ShieldCheck, AlertTriangle, ChevronDown, ChevronUp, Lock } from "lucide-react";
import { Badge } from "../ui/Badge.js";

export interface HashComparisonProps {
  calculatedHash: string;
  onChainHash: string;
  txHash?: string | undefined;
  chainId?: number | undefined;
  contractAddress?: string | undefined;
  isMatch: boolean;
  status: "VALID" | "INVALID" | "REVOKED" | "ISSUER_UNVERIFIED";
  metadata?: Record<string, any> | undefined;
}

export const HashComparisonWidget: React.FC<HashComparisonProps> = ({
  calculatedHash,
  onChainHash,
  txHash,
  chainId = 80002,
  contractAddress = "0xCertifiedPassRegistryAmoy",
  isMatch,
  status,
  metadata,
}) => {
  const [copiedCalc, setCopiedCalc] = useState(false);
  const [copiedChain, setCopiedChain] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const copyToClipboard = (text: string, isCalc: boolean) => {
    navigator.clipboard.writeText(text);
    if (isCalc) {
      setCopiedCalc(true);
      setTimeout(() => setCopiedCalc(false), 2000);
    } else {
      setCopiedChain(true);
      setTimeout(() => setCopiedChain(false), 2000);
    }
  };

  const explorerUrl = txHash ? `https://amoy.polygonscan.com/tx/${txHash}` : undefined;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-6 shadow-apple-sm text-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${
              isMatch ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
            }`}
          >
            {isMatch ? <ShieldCheck className="h-6 w-6" /> : <AlertTriangle className="h-6 w-6" />}
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 font-display">Cryptographic Verification</h4>
            <p className="text-xs text-slate-500">SHA-256 integrity match vs on-chain anchor</p>
          </div>
        </div>

        <Badge variant={isMatch ? "verified" : "invalid"} size="sm">
          {status}
        </Badge>
      </div>

      {/* Hash Comparison Rows */}
      <div className="mt-5 space-y-3.5">
        {/* Reconstructed Hash */}
        <div className="rounded-xl border border-slate-200/90 bg-slate-50/70 p-3.5 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
            <span>Canonical SHA-256 (Recalculated from Metadata)</span>
            <button
              onClick={() => copyToClipboard(calculatedHash, true)}
              className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700"
            >
              {copiedCalc ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
              {copiedCalc ? "Copied" : "Copy"}
            </button>
          </div>
          <div className="font-mono text-xs text-slate-800 break-all select-all font-medium">
            {calculatedHash}
          </div>
        </div>

        {/* On-Chain Anchored Hash */}
        <div className="rounded-xl border border-slate-200/90 bg-slate-50/70 p-3.5 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
            <span>On-Chain Digest (Polygon Amoy Registry)</span>
            <button
              onClick={() => copyToClipboard(onChainHash, false)}
              className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700"
            >
              {copiedChain ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
              {copiedChain ? "Copied" : "Copy"}
            </button>
          </div>
          <div className="font-mono text-xs text-indigo-700 break-all select-all font-medium">
            {onChainHash}
          </div>
        </div>
      </div>

      {/* Match Result Banner */}
      <div
        className={`mt-4 flex items-center justify-between rounded-xl px-4 py-3 text-xs font-semibold ${
          isMatch
            ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
            : "border border-red-200 bg-red-50 text-red-800"
        }`}
      >
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4" />
          <span>
            {isMatch
              ? "Cryptographic Match: 100% Tamper-Proof Integrity"
              : "Hash Mismatch: Metadata has been altered or not registered"}
          </span>
        </div>
        {explorerUrl && (
          <a
            href={explorerUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 text-indigo-700 hover:underline font-bold"
          >
            PolygonScan <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>

      {/* Expandable Technical Proof */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex w-full items-center justify-between text-xs text-slate-500 hover:text-slate-900 transition-colors"
        >
          <span className="flex items-center gap-1 font-medium">
            <Lock className="h-3.5 w-3.5 text-slate-400" />
            View Zero-PII Canonical Payload
          </span>
          {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {showDetails && (
          <div className="mt-3 rounded-xl border border-slate-200 bg-slate-900 p-3.5 text-[11px] font-mono text-slate-200 overflow-x-auto shadow-inner">
            <pre>{JSON.stringify(metadata ?? { status: "Verified on Polygon Amoy" }, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

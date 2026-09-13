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
    <div className="overflow-hidden rounded-[24px] neo-raised bg-[var(--surface-bg)] p-6 text-[var(--text-primary)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--shadow-dark)]/15 pb-4">
        <div className="flex items-center gap-3">
          <div
            className={`neo-raised-sm flex h-10 w-10 items-center justify-center rounded-xl ${
              isMatch
                ? "bg-[var(--accent-green-bg)] text-[var(--accent-green)]"
                : "bg-red-500/10 text-red-500"
            }`}
          >
            {isMatch ? <ShieldCheck className="h-6 w-6" /> : <AlertTriangle className="h-6 w-6" />}
          </div>
          <div>
            <h4 className="text-sm font-bold text-[var(--text-primary)] font-display">Cryptographic Verification</h4>
            <p className="text-xs text-[var(--text-secondary)]">SHA-256 integrity match vs on-chain anchor</p>
          </div>
        </div>

        <Badge variant={isMatch ? "verified" : "invalid"} size="sm">
          {status}
        </Badge>
      </div>

      {/* Hash Comparison Rows */}
      <div className="mt-5 space-y-3.5">
        {/* Reconstructed Hash */}
        <div className="rounded-2xl neo-inset bg-[var(--surface-bg)] p-4 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-semibold text-[var(--text-secondary)]">
            <span>Canonical SHA-256 (Recalculated from Metadata)</span>
            <button
              onClick={() => copyToClipboard(calculatedHash, true)}
              className="flex items-center gap-1 text-[var(--brand-indigo)] hover:text-[var(--brand-violet)]"
            >
              {copiedCalc ? <Check className="h-3 w-3 text-[var(--accent-green)]" /> : <Copy className="h-3 w-3" />}
              {copiedCalc ? "Copied" : "Copy"}
            </button>
          </div>
          <div className="font-mono text-xs text-[var(--text-primary)] break-all select-all font-medium">
            {calculatedHash}
          </div>
        </div>

        {/* On-Chain Anchored Hash */}
        <div className="rounded-2xl neo-inset bg-[var(--surface-bg)] p-4 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-semibold text-[var(--text-secondary)]">
            <span>On-Chain Digest (Polygon Amoy Registry)</span>
            <button
              onClick={() => copyToClipboard(onChainHash, false)}
              className="flex items-center gap-1 text-[var(--brand-indigo)] hover:text-[var(--brand-violet)]"
            >
              {copiedChain ? <Check className="h-3 w-3 text-[var(--accent-green)]" /> : <Copy className="h-3 w-3" />}
              {copiedChain ? "Copied" : "Copy"}
            </button>
          </div>
          <div className="font-mono text-xs text-[var(--brand-indigo)] break-all select-all font-bold">
            {onChainHash}
          </div>
        </div>

        {/* Match Confirmation */}
        <div
          className={`flex items-center gap-2 rounded-2xl neo-inset-sm p-3 text-xs font-bold ${
            isMatch
              ? "bg-[var(--accent-green-bg)] text-[var(--accent-green)]"
              : "bg-red-500/10 text-red-500"
          }`}
        >
          {isMatch ? (
            <>
              <ShieldCheck className="h-4 w-4 shrink-0" />
              <span>Cryptographic Match Confirmed (SHA-256 Identical)</span>
            </>
          ) : (
            <>
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>Hash Mismatch: Metadata has been modified or forged</span>
            </>
          )}
        </div>

        {/* Technical Details Toggle */}
        <div className="pt-1">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-1 text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <span>{showDetails ? "Hide" : "View"} Technical Payload Specs</span>
            {showDetails ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>

          {showDetails && metadata && (
            <div className="mt-3 rounded-2xl neo-inset bg-[var(--surface-bg)] p-3">
              <pre className="text-[11px] text-[var(--text-secondary)] overflow-x-auto font-mono max-h-48 leading-relaxed">
                {JSON.stringify(metadata, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

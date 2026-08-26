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
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-lg ${
              isMatch ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
            }`}
          >
            {isMatch ? <ShieldCheck className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Cryptographic Verification</h4>
            <p className="text-xs text-slate-400">SHA-256 integrity match vs on-chain anchor</p>
          </div>
        </div>

        <Badge variant={isMatch ? "verified" : "invalid"} dot>
          {isMatch ? "HASHES MATCH" : "TAMPER DETECTED"}
        </Badge>
      </div>

      {/* Hash Rows */}
      <div className="mt-4 space-y-3">
        {/* Calculated Hash */}
        <div className="rounded-lg bg-slate-950/70 p-3 border border-slate-800/60">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold text-slate-300">Recalculated SHA-256 (Canonical JSON)</span>
            <button
              onClick={() => copyToClipboard(calculatedHash, true)}
              className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300"
            >
              {copiedCalc ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copiedCalc ? "Copied" : "Copy"}
            </button>
          </div>
          <div className="font-mono text-xs text-cyan-300 break-all select-all leading-relaxed">
            {calculatedHash}
          </div>
        </div>

        {/* On-Chain Hash */}
        <div className="rounded-lg bg-slate-950/70 p-3 border border-slate-800/60">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold text-slate-300">On-Chain Anchor Hash (Polygon Amoy)</span>
            <button
              onClick={() => copyToClipboard(onChainHash, false)}
              className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300"
            >
              {copiedChain ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copiedChain ? "Copied" : "Copy"}
            </button>
          </div>
          <div className="font-mono text-xs text-purple-300 break-all select-all leading-relaxed">
            {onChainHash}
          </div>
        </div>
      </div>

      {/* Explorer Link & Details toggle */}
      <div className="mt-4 flex items-center justify-between pt-2 text-xs">
        {explorerUrl ? (
          <a
            href={explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-medium text-cyan-400 hover:text-cyan-300"
          >
            View on PolygonScan
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        ) : (
          <span className="text-slate-500 text-xs">Simulated Testnet Anchoring</span>
        )}

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center gap-1 text-slate-400 hover:text-slate-200"
        >
          {showDetails ? "Hide" : "Audit"} canonical data
          {showDetails ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>
      </div>

      {/* Collapsible Canonical JSON Audit */}
      {showDetails && metadata && (
        <div className="mt-3 rounded-lg bg-slate-950 p-3 border border-slate-800 text-xs font-mono">
          <div className="flex items-center gap-1 text-slate-400 mb-2 font-sans font-medium text-[11px]">
            <Lock className="h-3 w-3 text-cyan-400" /> Canonical Payload Input
          </div>
          <pre className="overflow-x-auto text-[11px] text-slate-300">
            {JSON.stringify(metadata, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

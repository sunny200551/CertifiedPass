import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Search,
  ExternalLink,
  Copy,
  Check,
  X,
  Sparkles,
  Link as LinkIcon,
  FileCheck2,
  User,
  Building2,
  Lock,
  Globe,
  Camera,
} from "lucide-react";
import { parseCertificateId } from "@certifiedpass/utils";
import type { PolyLanceVerificationResult } from "@certifiedpass/types";
import { api } from "../../lib/api.js";
import { MobileQRScannerModal } from "./MobileQRScannerModal.js";

interface PolyLanceVerifierModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCertId?: string;
}

export const PolyLanceVerifierModal: React.FC<PolyLanceVerifierModalProps> = ({
  isOpen,
  onClose,
  initialCertId = "",
}) => {
  const [inputVal, setInputVal] = useState(initialCertId);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PolyLanceVerificationResult | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialCertId) {
        setInputVal(initialCertId);
        handleVerify(initialCertId);
      }
    } else {
      setResult(null);
    }
  }, [isOpen, initialCertId]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleVerify = async (queryInput?: string) => {
    const raw = (queryInput ?? inputVal).trim();
    if (!raw) return;

    setLoading(true);
    const parsedId = parseCertificateId(raw);

    try {
      const res = await api.get(`/polylance/verify/${encodeURIComponent(parsedId)}`);
      if (res.data?.data) {
        setResult(res.data.data);
      } else {
        setResult({
          verified: false,
          status: "UNVERIFIED",
          displayStatus: "UNVERIFIED / RECORD NOT FOUND",
          certId: parsedId,
          message: "This certificate identifier could not be verified against the PolyLance Sovereign Ledger.",
          verifiedAt: new Date().toISOString(),
        });
      }
    } catch {
      setResult({
        verified: false,
        status: "UNVERIFIED",
        displayStatus: "UNVERIFIED / RECORD NOT FOUND",
        certId: parsedId,
        message: "This certificate identifier could not be verified against the PolyLance Sovereign Ledger.",
        verifiedAt: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleScanSuccess = (parsedId: string, rawText: string) => {
    setInputVal(rawText);
    handleVerify(parsedId);
  };

  React.useEffect(() => {
    if (isOpen) {
      document.body.classList.add('has-active-modal');
      return () => {
        document.body.classList.remove('has-active-modal');
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-md transition-all">
      <div className="relative w-full max-w-2xl rounded-[24px] neo-floating bg-[var(--surface-bg)] text-[var(--text-primary)] transition-all overflow-hidden my-6">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-[var(--shadow-dark)]/15 px-6 py-4 bg-[var(--surface-bg)]">
          <div className="flex items-center gap-2.5">
            <div className="neo-raised-sm flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent-purple-bg)] text-[var(--accent-purple)] font-bold">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[var(--text-primary)] font-display flex items-center gap-1.5">
                <span>PolyLance Sovereign Verifier</span>
                <span className="rounded-full neo-inset-sm bg-[var(--accent-purple-bg)] text-[var(--accent-purple)] px-2 py-0.5 text-[9px] font-bold">
                  Collab
                </span>
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Audit Soulbound Tokens & multi-sig escrow milestone settlements on Polygon PoS (137)
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

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-6">
          {/* Search Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleVerify();
            }}
            className="space-y-3"
          >
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 h-4 w-4 text-[var(--text-secondary)]" />
              <input
                type="text"
                placeholder="Paste PolyLance Certificate ID, full URL, or SBT hash..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="w-full rounded-2xl neo-inset bg-[var(--surface-bg)] pl-10 pr-28 py-3 text-xs sm:text-sm font-mono text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none"
              />
              <div className="absolute right-1.5 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsScannerOpen(true)}
                  className="neo-raised-sm rounded-xl p-1.5 text-[var(--brand-indigo)] hover:text-[var(--brand-violet)] transition-all active:neo-inset-sm"
                  title="Open Camera QR / Barcode Scanner"
                >
                  <Camera className="h-4 w-4" />
                </button>
                <button
                  type="submit"
                  disabled={loading || !inputVal.trim()}
                  className="rounded-xl neo-btn-primary px-3.5 py-1.5 text-xs font-bold text-white transition-all disabled:opacity-50"
                >
                  {loading ? "..." : "Audit"}
                </button>
              </div>
            </div>
          </form>

          {/* Verification Result State */}
          {loading && (
            <div className="rounded-2xl neo-inset bg-[var(--surface-bg)] p-8 text-center space-y-2">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--accent-purple)] border-t-transparent mx-auto" />
              <p className="text-xs font-bold text-[var(--text-primary)]">
                Querying PolyLance Sovereign Ledger & Live State...
              </p>
            </div>
          )}

          {!loading && result && (
            <div className="rounded-2xl neo-raised bg-[var(--surface-bg)] p-5 space-y-4">
              {/* Header Status */}
              <div className="flex items-start justify-between gap-3 border-b border-[var(--shadow-dark)]/15 pb-4">
                <div className="flex items-center gap-3">
                  {result.status === "VERIFIED" ? (
                    <div className="neo-raised-sm flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-green-bg)] text-[var(--accent-green)]">
                      <ShieldCheck className="h-6 w-6" />
                    </div>
                  ) : result.status === "REVOKED" ? (
                    <div className="neo-raised-sm flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-500">
                      <ShieldAlert className="h-6 w-6" />
                    </div>
                  ) : (
                    <div className="neo-raised-sm flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-amber-bg)] text-[var(--accent-amber)]">
                      <AlertTriangle className="h-6 w-6" />
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-black tracking-wide ${
                          result.status === "VERIFIED"
                            ? "text-[var(--accent-green)]"
                            : result.status === "REVOKED"
                            ? "text-rose-500"
                            : "text-[var(--accent-amber)]"
                        }`}
                      >
                        {result.displayStatus}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] font-mono">
                      ID: {result.certId}
                    </p>
                  </div>
                </div>

                <span className="text-[11px] text-[var(--text-secondary)] font-mono">
                  {new Date(result.verifiedAt).toLocaleTimeString()}
                </span>
              </div>

              {/* Status Details */}
              {result.status === "VERIFIED" && result.details && (
                <div className="space-y-4">
                  {/* Title & Type */}
                  <div className="rounded-xl neo-inset bg-[var(--surface-bg)] p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="rounded-full neo-raised-sm bg-[var(--accent-purple-bg)] text-[var(--accent-purple)] px-2.5 py-0.5 text-[10px] font-bold">
                        {result.details.typeTitle}
                      </span>
                      <span className="text-xs font-bold text-[var(--accent-purple)] font-mono bg-[var(--accent-purple-bg)] neo-raised-sm px-2.5 py-0.5 rounded-lg flex items-center gap-1">
                        <Lock className="h-3 w-3" />
                        Sovereign Attestation
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-[var(--text-primary)] font-display">
                      {result.details.title}
                    </h4>
                  </div>

                  {/* Two-column Participant Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Recipient / Talent */}
                    <div className="rounded-xl neo-raised p-3.5 bg-[var(--surface-bg)] space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-secondary)]">
                        <User className="h-3.5 w-3.5 text-[var(--accent-purple)]" />
                        <span>Talent / Recipient</span>
                      </div>
                      <div className="text-xs font-bold text-[var(--text-primary)]">
                        {result.details.recipient?.name ||
                          result.details.freelancerName ||
                          result.details.freelancer ||
                          "Freelancer"}
                      </div>
                      {(result.details.recipient?.address || result.details.freelancerAddress) && (
                        <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-secondary)] neo-inset-sm rounded-lg p-1.5 bg-[var(--surface-bg)]">
                          <span className="truncate max-w-[170px]">
                            {result.details.recipient?.address || result.details.freelancerAddress}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleCopy(
                                result.details?.recipient?.address || result.details?.freelancerAddress || "",
                                "recipient"
                              )
                            }
                            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-0.5"
                          >
                            {copiedKey === "recipient" ? (
                              <Check className="h-3 w-3 text-[var(--accent-green)]" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Sponsor / Client */}
                    {(result.details.sponsor || result.details.client || result.details.clientAddress) && (
                      <div className="rounded-xl neo-raised p-3.5 bg-[var(--surface-bg)] space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-secondary)]">
                          <Building2 className="h-3.5 w-3.5 text-[var(--brand-indigo)]" />
                          <span>Sponsor / Escrow Client</span>
                        </div>
                        <div className="text-xs font-bold text-[var(--text-primary)]">
                          {result.details.sponsor?.name ||
                            result.details.clientName ||
                            result.details.client ||
                            "Escrow Client"}
                        </div>
                        {(result.details.sponsor?.address || result.details.clientAddress) && (
                          <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-secondary)] neo-inset-sm rounded-lg p-1.5 bg-[var(--surface-bg)]">
                            <span className="truncate max-w-[170px]">
                              {result.details.sponsor?.address || result.details.clientAddress}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                handleCopy(
                                  result.details?.sponsor?.address || result.details?.clientAddress || "",
                                  "sponsor"
                                )
                              }
                              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] p-0.5"
                            >
                              {copiedKey === "sponsor" ? (
                                <Check className="h-3 w-3 text-[var(--accent-green)]" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Technical Proofs */}
                  <div className="rounded-xl neo-inset p-3 bg-[var(--surface-bg)] space-y-2 text-xs">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)] flex items-center gap-1">
                      <Lock className="h-3 w-3 text-[var(--brand-indigo)]" />
                      Cryptographic On-Chain Proof
                    </div>

                    {result.details.contractAddress && (
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[var(--text-secondary)]">Contract:</span>
                        <span className="font-mono text-[var(--text-primary)] truncate max-w-[220px]">
                          {result.details.contractAddress}
                        </span>
                      </div>
                    )}

                    {result.details.oracleSignature && (
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[var(--text-secondary)]">Oracle Sig:</span>
                        <span className="font-mono text-[var(--text-primary)] truncate max-w-[220px]">
                          {result.details.oracleSignature}
                        </span>
                      </div>
                    )}

                    {result.details.ipfsCid && (
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-[var(--text-secondary)]">IPFS CID:</span>
                        <a
                          href={`https://ipfs.io/ipfs/${result.details.ipfsCid}`}
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono text-[var(--accent-purple)] hover:underline flex items-center gap-1"
                        >
                          <span className="truncate max-w-[180px]">{result.details.ipfsCid}</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Unverified Reason Notice */}
              {result.status === "UNVERIFIED" && (
                <div className="rounded-xl neo-inset bg-[var(--surface-bg)] p-4 text-xs text-[var(--accent-amber)] flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  <p>{result.message || "This certificate record could not be found or verified on-chain."}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Embedded Mobile Scanner */}
      <MobileQRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleScanSuccess}
      />
    </div>
  );
};

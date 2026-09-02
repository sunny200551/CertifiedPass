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
  const [sampleCerts, setSampleCerts] = useState<string[]>([]);
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialCertId) {
        setInputVal(initialCertId);
        handleVerify(initialCertId);
      }
      loadSamples();
    } else {
      setResult(null);
    }
  }, [isOpen, initialCertId]);

  const loadSamples = async () => {
    try {
      const res = await api.get("/polylance/records/sample");
      if (res.data?.data?.sbtRecords) {
        const ids = res.data.data.sbtRecords.map((r: any) => r.id).filter(Boolean);
        setSampleCerts(ids);
      }
    } catch {
      setSampleCerts([
        "PL-SBT-JOB-0xeeacc05a99a2-0xeeac",
        "PL-SBT-JOB-0xce1376c2272E-0xce13",
      ]);
    }
  };

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
    } catch (err) {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200/90 bg-white shadow-2xl transition-all overflow-hidden my-8">
        {/* Header with partner branding */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600/10 text-violet-600 border border-violet-200/60 font-mono font-bold text-sm">
              PL
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 font-display">
                  PolyLance Sovereign Ledger
                </h3>
                <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-semibold text-violet-700 border border-violet-200">
                  Collab Verifier
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Independent Audit & Soulbound Milestone Verification
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Input & Scanner box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleVerify();
            }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-700">
                Certificate ID, QR Code Text, or PolyLance Attestation URL
              </label>
              <button
                type="button"
                onClick={() => setIsScannerOpen(true)}
                className="md:hidden flex items-center gap-1 text-xs font-bold text-violet-600 hover:text-violet-700 transition-colors"
              >
                <Camera className="h-3.5 w-3.5" />
                Scan with Camera
              </button>
            </div>
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="e.g. PL-SBT-JOB-101-0x42F8 or https://polylance.app/#/jobs/..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-10 pr-24 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-violet-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-100 transition-all font-mono"
              />
              <button
                type="submit"
                disabled={loading || !inputVal.trim()}
                className="absolute right-2 rounded-xl bg-violet-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-violet-700 disabled:opacity-50 transition-colors shadow-sm"
              >
                {loading ? "Checking..." : "Verify"}
              </button>
            </div>

            {sampleCerts.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap pt-1 text-xs">
                <span className="text-slate-400 font-medium">Quick Test:</span>
                {sampleCerts.slice(0, 2).map((sId) => (
                  <button
                    key={sId}
                    type="button"
                    onClick={() => {
                      setInputVal(sId);
                      handleVerify(sId);
                    }}
                    className="rounded-lg bg-slate-100 hover:bg-slate-200 px-2 py-0.5 font-mono text-[11px] text-slate-600 transition-colors"
                  >
                    {sId.slice(0, 18)}...
                  </button>
                ))}
              </div>
            )}
          </form>

          {/* Results display */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-600 border-t-transparent" />
              <p className="text-xs font-medium text-slate-500 font-mono">
                Querying PolyLance Sovereign PostgreSQL Audit Ledger...
              </p>
            </div>
          )}

          {!loading && result && (
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-5">
              {/* Status Header Badge */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  {result.status === "VERIFIED" ? (
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                      <ShieldCheck className="h-6 w-6" />
                    </div>
                  ) : result.status === "REVOKED" ? (
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600 border border-rose-200">
                      <ShieldAlert className="h-6 w-6" />
                    </div>
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
                      <AlertTriangle className="h-6 w-6" />
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-extrabold uppercase tracking-wide ${
                          result.status === "VERIFIED"
                            ? "text-emerald-700"
                            : result.status === "REVOKED"
                            ? "text-rose-700"
                            : "text-amber-700"
                        }`}
                      >
                        {result.displayStatus}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-mono">
                      ID: {result.certId}
                    </p>
                  </div>
                </div>

                <span className="text-[11px] text-slate-400 font-mono">
                  {new Date(result.verifiedAt).toLocaleTimeString()}
                </span>
              </div>

              {/* Status Details */}
              {result.status === "VERIFIED" && result.details && (
                <div className="space-y-4">
                  {/* Title & Type */}
                  <div className="rounded-xl bg-slate-50/80 p-4 border border-slate-200/60">
                    <div className="flex items-center justify-between mb-1">
                      <span className="rounded-full bg-violet-100 text-violet-800 border border-violet-200 px-2.5 py-0.5 text-[10px] font-bold">
                        {result.details.typeTitle}
                      </span>
                      {result.details.settledAmountUsdc && (
                        <span className="text-xs font-extrabold text-emerald-600 font-mono">
                          {result.details.settledAmountUsdc}
                        </span>
                      )}
                      {result.details.lifetimeVolumeUsdc && (
                        <span className="text-xs font-extrabold text-emerald-600 font-mono">
                          Vol: {result.details.lifetimeVolumeUsdc}
                        </span>
                      )}
                    </div>
                    <h4 className="text-base font-bold text-slate-900 font-display">
                      {result.details.title}
                    </h4>
                  </div>

                  {/* Two-column Participant Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Recipient / Talent */}
                    <div className="rounded-xl border border-slate-200/60 p-3.5 bg-white space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                        <User className="h-3.5 w-3.5 text-violet-600" />
                        <span>Talent / Recipient</span>
                      </div>
                      <div className="text-xs font-semibold text-slate-900">
                        {result.details.recipient?.name ||
                          result.details.freelancerName ||
                          result.details.freelancer ||
                          "Verified Freelancer"}
                      </div>
                      {(result.details.recipient?.address || result.details.freelancerAddress) && (
                        <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 bg-slate-50 rounded-lg p-1.5">
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
                            className="text-slate-400 hover:text-slate-600 p-0.5"
                          >
                            {copiedKey === "recipient" ? (
                              <Check className="h-3 w-3 text-emerald-600" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Sponsor / Client */}
                    {(result.details.sponsor || result.details.client || result.details.clientAddress) && (
                      <div className="rounded-xl border border-slate-200/60 p-3.5 bg-white space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                          <Building2 className="h-3.5 w-3.5 text-indigo-600" />
                          <span>Sponsor / Escrow Client</span>
                        </div>
                        <div className="text-xs font-semibold text-slate-900">
                          {result.details.sponsor?.name ||
                            result.details.clientName ||
                            result.details.client ||
                            "Escrow Client"}
                        </div>
                        {(result.details.sponsor?.address || result.details.clientAddress) && (
                          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 bg-slate-50 rounded-lg p-1.5">
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
                              className="text-slate-400 hover:text-slate-600 p-0.5"
                            >
                              {copiedKey === "sponsor" ? (
                                <Check className="h-3 w-3 text-emerald-600" />
                              ) : (
                                <Copy className="h-3 w-3" />
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Cryptographic & Ledger Proofs */}
                  <div className="rounded-xl border border-slate-200/60 bg-slate-50/50 p-3.5 space-y-2 text-xs">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                      <Lock className="h-3 w-3 text-slate-400" />
                      Cryptographic On-Chain & Storage Proofs
                    </div>

                    {result.details.contractAddress && (
                      <div className="flex items-center justify-between py-1 border-b border-slate-200/40">
                        <span className="text-slate-500">Smart Contract:</span>
                        <span className="font-mono text-slate-800 text-[11px]">
                          {result.details.contractAddress.slice(0, 10)}...{result.details.contractAddress.slice(-8)} (Polygon 137)
                        </span>
                      </div>
                    )}

                    {result.details.oracleSignature && (
                      <div className="flex items-center justify-between py-1 border-b border-slate-200/40">
                        <span className="text-slate-500">Oracle Cryptographic Signature:</span>
                        <div className="flex items-center gap-1">
                          <span className="font-mono text-slate-800 text-[11px] truncate max-w-[140px]">
                            {result.details.oracleSignature}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy(result.details!.oracleSignature!, "sig")}
                            className="text-slate-400 hover:text-slate-600 p-0.5"
                          >
                            {copiedKey === "sig" ? (
                              <Check className="h-3 w-3 text-emerald-600" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    {result.details.ipfsCid && (
                      <div className="flex items-center justify-between py-1 border-b border-slate-200/40">
                        <span className="text-slate-500">IPFS Proof CID:</span>
                        <a
                          href={`https://ipfs.io/ipfs/${result.details.ipfsCid}`}
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono text-indigo-600 hover:underline text-[11px] flex items-center gap-1"
                        >
                          {result.details.ipfsCid}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}

                    {result.details.timestamp && (
                      <div className="flex items-center justify-between py-1">
                        <span className="text-slate-500">Settlement Timestamp:</span>
                        <span className="font-mono text-slate-700 text-[11px]">
                          {new Date(result.details.timestamp).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Revoked state message */}
              {result.status === "REVOKED" && (
                <div className="rounded-xl bg-rose-50 p-4 border border-rose-200 text-xs text-rose-800 space-y-1">
                  <div className="font-bold">Revocation Notice:</div>
                  <p>{result.reason || "This record was revoked or invalidated on the PolyLance Sovereign Ledger."}</p>
                </div>
              )}

              {/* Unverified state message */}
              {result.status === "UNVERIFIED" && (
                <div className="rounded-xl bg-amber-50 p-4 border border-amber-200 text-xs text-amber-800 space-y-1">
                  <div className="font-bold">Verification Notice:</div>
                  <p>{result.message || "This certificate identifier could not be verified against the PolyLance Sovereign Ledger."}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-3.5 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <Globe className="h-3.5 w-3.5 text-slate-400" />
            Decentralized PolyLance Collab Protocol
          </span>
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-1.5 font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
          >
            Close
          </button>
        </div>
      </div>

      {/* Mobile Camera QR Scanner */}
      <MobileQRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={(parsedId, rawText) => {
          setInputVal(rawText);
          handleVerify(parsedId);
        }}
        title="Scan PolyLance Certificate"
        subtitle="Point your camera at a PolyLance SBT Attestation or MultiSig Audit QR code"
      />
    </div>
  );
};

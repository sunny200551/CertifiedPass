import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import {
  Search,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  Lock,
  Sparkles,
  Award,
  Layers,
  FileCheck2,
  Calendar,
  Building2,
  QrCode,
  Zap,
  Globe,
  Copy,
  Check,
  AlertTriangle,
  User,
  CheckCircle,
  Database,
  Camera,
} from "lucide-react";
import { parseCertificateId } from "@certifiedpass/utils";
import type { PolyLanceVerificationResult } from "@certifiedpass/types";
import { Layout } from "../components/layout/Layout.js";
import { PolyLanceVerifierModal } from "../components/credential/PolyLanceVerifierModal.js";
import { MobileQRScannerModal } from "../components/credential/MobileQRScannerModal.js";
import { VerificationReportModal } from "../components/credential/VerificationReportModal.js";
import { lookupFallbackPolyLance } from "../lib/polylanceFallback.js";
import { api } from "../lib/api.js";

export function VerifyPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [inputVal, setInputVal] = useState("");
  const [activeTab, setActiveTab] = useState<"certifiedpass" | "polylance">("certifiedpass");
  const [loading, setLoading] = useState(false);
  const [hasErrorShake, setHasErrorShake] = useState(false);
  const [polyResult, setPolyResult] = useState<PolyLanceVerificationResult | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [livePolyRecords, setLivePolyRecords] = useState<any[]>([]);

  // Fetch live PolyLance database records on mount
  useEffect(() => {
    async function fetchLiveRecords() {
      try {
        const res = await api.get("/polylance/records/sample");
        if (res.data?.data?.sbtRecords && res.data.data.sbtRecords.length > 0) {
          const mapped = res.data.data.sbtRecords.map((r: any) => ({
            id: r.id,
            title: r.jobTitle || "Soulbound Milestone Attestation",
            freelancer: r.freelancerName || "Freelancer",
            client: r.clientName || "Escrow Client",
            status: r.status || "VERIFIED",
          }));
          setLivePolyRecords(mapped);
        }
      } catch (err) {
        console.warn("Live PolyLance records fetch notice:", err);
      }
    }
    fetchLiveRecords();
  }, []);

  // Check URL params on mount (e.g. /verify?certId=... or /verify?partner=polylance)
  useEffect(() => {
    const certParam = searchParams.get("certId") || searchParams.get("id");
    const partnerParam = searchParams.get("partner");

    if (partnerParam === "polylance") {
      setActiveTab("polylance");
    }

    if (certParam) {
      const parsed = parseCertificateId(certParam);
      setInputVal(parsed);

      const isPoly =
        parsed.toLowerCase().includes("polylance") ||
        parsed.toUpperCase().startsWith("PL-SBT-") ||
        parsed.toUpperCase().startsWith("PL-AUD-") ||
        partnerParam === "polylance";

      if (isPoly) {
        setActiveTab("polylance");
        verifyPolyLance(parsed);
      } else {
        navigate(`/c/${encodeURIComponent(parsed)}`);
      }
    }
  }, [searchParams]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const verifyPolyLance = async (certIdOrUrl: string) => {
    setLoading(true);
    setPolyResult(null);

    const cleanId = parseCertificateId(certIdOrUrl);

    try {
      const res = await api.get(`/polylance/verify/${encodeURIComponent(cleanId)}`);
      if (res.data?.success && res.data?.data) {
        setPolyResult(res.data.data);
      } else {
        const fallback = lookupFallbackPolyLance(cleanId);
        if (fallback) {
          setPolyResult(fallback);
        } else {
          setPolyResult({
            verified: false,
            status: "UNVERIFIED",
            displayStatus: "UNVERIFIED / RECORD NOT FOUND",
            certId: cleanId,
            verifiedAt: new Date().toISOString(),
            message: "This certificate identifier could not be verified against the PolyLance Sovereign Ledger.",
          });
        }
      }
    } catch {
      const fallback = lookupFallbackPolyLance(cleanId);
      if (fallback) {
        setPolyResult(fallback);
      } else {
        setPolyResult({
          verified: false,
          status: "UNVERIFIED",
          displayStatus: "UNVERIFIED / RECORD NOT FOUND",
          certId: cleanId,
          verifiedAt: new Date().toISOString(),
          message: "This certificate identifier could not be verified against the PolyLance Sovereign Ledger.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = inputVal.trim();
    if (!raw) return;

    const parsedId = parseCertificateId(raw);
    const rawLower = raw.toLowerCase();

    const isPolyLance =
      rawLower.includes("polylance") ||
      rawLower.startsWith("pl-sbt-") ||
      rawLower.startsWith("pl-aud-") ||
      parsedId.toUpperCase().startsWith("PL-SBT-") ||
      parsedId.toUpperCase().startsWith("PL-AUD-") ||
      activeTab === "polylance";

    if (isPolyLance) {
      setActiveTab("polylance");
      verifyPolyLance(parsedId);
      return;
    }

    if (parsedId) {
      navigate(`/c/${encodeURIComponent(parsedId)}`);
    } else {
      setHasErrorShake(true);
      setTimeout(() => setHasErrorShake(false), 600);
    }
  };

  const handleScanSuccess = (parsedId: string, rawText: string) => {
    setInputVal(rawText);
    const rawLower = rawText.toLowerCase();

    const isPolyLance =
      rawLower.includes("polylance") ||
      rawLower.startsWith("pl-sbt-") ||
      rawLower.startsWith("pl-aud-") ||
      parsedId.toUpperCase().startsWith("PL-SBT-") ||
      parsedId.toUpperCase().startsWith("PL-AUD-") ||
      activeTab === "polylance";

    if (isPolyLance) {
      setActiveTab("polylance");
      verifyPolyLance(parsedId);
    } else {
      navigate(`/c/${encodeURIComponent(parsedId)}`);
    }
  };

  return (
    <Layout>
      {/* Background ambient lighting */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-gradient-to-b from-indigo-500/5 via-sky-500/5 to-transparent blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header Hero */}
        <div className="text-center space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-xs font-bold text-indigo-700 shadow-sm">
            <ShieldCheck className="h-4 w-4 text-indigo-600" />
            <span>Universal Cryptographic Verifier</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-950 font-display">
            Verify Any Credential & Attestation
          </h1>

          <p className="mx-auto max-w-2xl text-sm sm:text-base text-black font-medium leading-relaxed">
            Enter the unique Credential ID, paste a verification link, or scan the QR code/barcode to audit its cryptographic authenticity against the Polygon blockchain and PolyLance Sovereign Ledger.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1.5 rounded-2xl bg-white border border-slate-200 shadow-sm gap-2">
            <button
              type="button"
              onClick={() => {
                setActiveTab("certifiedpass");
                setPolyResult(null);
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "certifiedpass"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-black hover:text-indigo-600"
              }`}
            >
              <ShieldCheck className="h-4 w-4" />
              <span>CertifiedPass Registry</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("polylance");
                if (inputVal.trim()) {
                  verifyPolyLance(inputVal.trim());
                }
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "polylance"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-black hover:text-purple-600"
              }`}
            >
              <Sparkles className="h-4 w-4" />
              <span>PolyLance Sovereign Ledger</span>
              <span className="rounded-full bg-purple-200 text-purple-900 px-2 py-0.5 text-[9px] font-black">
                Live
              </span>
            </button>
          </div>
        </div>

        {/* Search & Audit Form */}
        <div className="mx-auto max-w-3xl mb-12">
          <form
            onSubmit={handleSearch}
            className={`relative rounded-3xl bg-white border border-slate-200 shadow-lg p-2.5 sm:p-3 transition-all ${
              hasErrorShake ? "animate-shake border-rose-400 ring-2 ring-rose-200" : "hover:border-indigo-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <Search className="h-5 w-5 text-indigo-600 ml-3 shrink-0" />
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder={
                  activeTab === "polylance"
                    ? "Paste PolyLance ID, URL (e.g. PL-SBT-JOB-..., 0x...), or scan QR"
                    : "e.g. cp-hackathon-2026-ethsf, PL-SBT-..., or full QR URL"
                }
                className="w-full bg-transparent px-2 py-3 text-sm sm:text-base font-mono font-medium text-black placeholder:text-slate-400 focus:outline-none"
              />

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsScannerOpen(true)}
                  className="flex items-center gap-1.5 rounded-2xl bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 px-3.5 py-2.5 text-xs font-bold text-indigo-700 transition-all shadow-sm"
                  title="Open Camera QR & Barcode Scanner"
                >
                  <Camera className="h-4 w-4" />
                  <span className="hidden sm:inline">Scan QR / Barcode</span>
                </button>

                <button
                  type="submit"
                  disabled={loading || !inputVal.trim()}
                  className="rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 text-xs sm:text-sm font-bold transition-all shadow-sm disabled:opacity-50"
                >
                  {loading ? "Verifying..." : "Verify Pass"}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* PolyLance Live Verification Result Card */}
        {loading && (
          <div className="rounded-3xl bg-white border border-slate-200 shadow-lg p-12 text-center space-y-3 mb-10">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent mx-auto" />
            <p className="text-sm font-bold text-black font-display">
              Auditing against PolyLance Sovereign Ledger (Polygon PoS 137)...
            </p>
          </div>
        )}

        {!loading && polyResult && (
          <div className="rounded-3xl bg-white border border-slate-200 shadow-xl p-6 sm:p-8 mb-10 space-y-6">
            {/* Status Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="flex items-center gap-3.5">
                {polyResult.status === "VERIFIED" ? (
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm">
                    <ShieldCheck className="h-7 w-7" />
                  </div>
                ) : polyResult.status === "REVOKED" ? (
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 shadow-sm">
                    <ShieldAlert className="h-7 w-7" />
                  </div>
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 shadow-sm">
                    <AlertTriangle className="h-7 w-7" />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-base font-black tracking-wide ${
                        polyResult.status === "VERIFIED"
                          ? "text-emerald-700"
                          : polyResult.status === "REVOKED"
                          ? "text-rose-600"
                          : "text-amber-700"
                      }`}
                    >
                      {polyResult.status === "VERIFIED"
                        ? "🟢 VERIFIED & AUTHENTIC"
                        : polyResult.status === "REVOKED"
                        ? "🔴 REVOKED / INVALIDATED"
                        : "🟡 UNVERIFIED / RECORD NOT FOUND"}
                    </span>
                  </div>
                  <p className="text-xs text-black font-mono mt-0.5 font-bold">
                    ID: {polyResult.certId}
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right text-xs text-black font-mono font-medium">
                <div>Verified: {new Date(polyResult.verifiedAt).toLocaleTimeString()}</div>
                <div className="text-purple-700 font-bold">PolyLance Sovereign Protocol</div>
              </div>
            </div>

            {/* Verified Details */}
            {polyResult.status === "VERIFIED" && polyResult.details && (
              <div className="space-y-5">
                {/* Title & Type Box */}
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="rounded-full bg-purple-100 text-purple-900 border border-purple-200 px-3 py-0.5 text-xs font-bold">
                      {polyResult.details.typeTitle}
                    </span>
                    <span className="text-xs font-bold text-emerald-800 font-mono bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-lg flex items-center gap-1">
                      <Lock className="h-3 w-3 text-emerald-600" />
                      Sovereign Attestation
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-black font-display">
                    {polyResult.details.title}
                  </h3>
                </div>

                {/* Participant Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Talent */}
                  <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-black">
                      <div className="flex items-center gap-1.5">
                        <User className="h-4 w-4 text-purple-600" />
                        <span>Talent / Recipient</span>
                      </div>
                      <span className="rounded-full bg-purple-50 text-purple-800 border border-purple-200 px-2.5 py-0.5 text-[10px] font-bold">
                        Freelancer
                      </span>
                    </div>
                    <div className="text-sm font-bold text-black">
                      {polyResult.details.recipient?.name ||
                        polyResult.details.freelancerName ||
                        polyResult.details.freelancer ||
                        "Freelancer"}
                    </div>
                    {(polyResult.details.recipient?.address || polyResult.details.freelancerAddress) && (
                      <div className="flex items-center justify-between text-xs font-mono text-black rounded-xl p-2 bg-slate-50 border border-slate-200">
                        <span className="truncate max-w-[210px] font-medium">
                          {polyResult.details.recipient?.address || polyResult.details.freelancerAddress}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const addr = polyResult.details?.recipient?.address || polyResult.details?.freelancerAddress;
                            if (addr) handleCopy(addr, "rec");
                          }}
                          className="text-black hover:text-purple-600 p-0.5"
                        >
                          {copiedKey === "rec" ? (
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Sponsor */}
                  {(polyResult.details.sponsor || polyResult.details.client || polyResult.details.clientAddress) && (
                    <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-black">
                        <div className="flex items-center gap-1.5">
                          <Building2 className="h-4 w-4 text-indigo-600" />
                          <span>Sponsor / Escrow Client</span>
                        </div>
                        <span className="rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200 px-2.5 py-0.5 text-[10px] font-bold">
                          Client
                        </span>
                      </div>
                      <div className="text-sm font-bold text-black">
                        {polyResult.details.sponsor?.name ||
                          polyResult.details.clientName ||
                          polyResult.details.client ||
                          "Escrow Client"}
                      </div>
                      {(polyResult.details.sponsor?.address || polyResult.details.clientAddress) && (
                        <div className="flex items-center justify-between text-xs font-mono text-black rounded-xl p-2 bg-slate-50 border border-slate-200">
                          <span className="truncate max-w-[210px] font-medium">
                            {polyResult.details.sponsor?.address || polyResult.details.clientAddress}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const addr = polyResult.details?.sponsor?.address || polyResult.details?.clientAddress;
                              if (addr) handleCopy(addr, "spo");
                            }}
                            className="text-black hover:text-indigo-600 p-0.5"
                          >
                            {copiedKey === "spo" ? (
                              <Check className="h-3.5 w-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Proofs breakdown */}
                <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-2.5 text-xs">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-black flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-indigo-600" />
                    Cryptographic MultiSig & Storage Attestations
                  </div>

                  {polyResult.details.contractAddress && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-1 border-b border-slate-200 gap-1">
                      <span className="text-black font-medium">Smart Contract (MultiSig Safe):</span>
                      <span className="font-mono text-black font-bold text-[11px]">
                        {polyResult.details.contractAddress} (Polygon PoS 137)
                      </span>
                    </div>
                  )}

                  {polyResult.details.oracleSignature && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-1 border-b border-slate-200 gap-1">
                      <span className="text-black font-medium">Oracle Cryptographic Signature:</span>
                      <div className="flex items-center gap-1">
                        <span className="font-mono text-black text-[11px] truncate max-w-[240px]">
                          {polyResult.details.oracleSignature}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(polyResult.details?.oracleSignature || "", "sig2")}
                          className="text-black hover:text-indigo-600 p-0.5"
                        >
                          {copiedKey === "sig2" ? (
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  {polyResult.details.ipfsCid && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-1 border-b border-slate-200 gap-1">
                      <span className="text-black font-medium">IPFS Proof CID:</span>
                      <a
                        href={`https://ipfs.io/ipfs/${polyResult.details.ipfsCid}`}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-indigo-600 font-bold hover:underline text-[11px] flex items-center gap-1"
                      >
                        {polyResult.details.ipfsCid}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}

                  {polyResult.details.timestamp && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-1 gap-1">
                      <span className="text-black font-medium">Settlement Date:</span>
                      <span className="font-mono text-black text-[11px] font-bold">
                        {new Date(polyResult.details.timestamp).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Quick actions on verified result */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <div className="text-xs text-black font-bold flex items-center gap-1.5">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <span>Cryptographic proof anchored to Sovereign Ledger</span>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setIsReportOpen(true)}
                      className="rounded-full bg-white border border-slate-200 hover:border-indigo-400 text-black px-4 py-2 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <FileCheck2 className="h-3.5 w-3.5 text-indigo-600" />
                      <span>Certified Audit Report</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate(`/c/${encodeURIComponent(polyResult.certId)}`)}
                      className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 text-xs font-bold transition-all flex items-center gap-1 shadow-sm"
                    >
                      <span>Open Certificate Pass</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Live PolyLance Records Grid (Only rendered if live database has verified records) */}
        {activeTab === "polylance" && livePolyRecords.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-black uppercase tracking-wider text-black font-display">
                Live PolyLance Sovereign Ledger Attestations
              </h2>
              <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
                Live Network Connected
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {livePolyRecords.map((record) => (
                <div
                  key={record.id}
                  onClick={() => {
                    setInputVal(record.id);
                    verifyPolyLance(record.id);
                  }}
                  className="group cursor-pointer rounded-2xl bg-white border border-slate-200 hover:border-purple-400 p-5 transition-all duration-200 hover:-translate-y-1 shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="rounded-full bg-purple-100 text-purple-900 border border-purple-200 px-2.5 py-0.5 text-[10px] font-bold">
                      SBT ATTESTATION
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700 font-mono bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg flex items-center gap-1">
                      <Lock className="h-3 w-3" />
                      Verified
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-black group-hover:text-purple-600 transition-colors line-clamp-2 mb-2 font-display">
                    {record.title}
                  </h3>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-black truncate max-w-[170px]">
                        👤 {record.freelancer}
                      </span>
                      <span className="text-black font-mono text-[10px] truncate max-w-[180px]">
                        {record.id}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-purple-700 font-bold group-hover:translate-x-1 transition-all">
                      <span>Verify</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* PolyLance Verifier Modal */}
      <PolyLanceVerifierModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Certified Verification & Audit Report Modal */}
      {polyResult && polyResult.status === "VERIFIED" && polyResult.details && (
        <VerificationReportModal
          isOpen={isReportOpen}
          onClose={() => setIsReportOpen(false)}
          credentialId={polyResult.certId}
          title={polyResult.details.title}
          status={polyResult.status}
          freelancerName={polyResult.details.freelancerName || polyResult.details.freelancer}
          freelancerAddress={polyResult.details.freelancerAddress}
          clientName={polyResult.details.clientName || polyResult.details.client}
          clientAddress={polyResult.details.clientAddress}
          category={polyResult.details.category || polyResult.details.typeTitle}
          contractAddress={polyResult.details.contractAddress}
          oracleSignature={polyResult.details.oracleSignature}
          ipfsCid={polyResult.details.ipfsCid}
          timestamp={polyResult.details.timestamp}
          reason={polyResult.reason}
        />
      )}

      {/* Mobile Camera QR & Barcode Scanner Modal */}
      <MobileQRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleScanSuccess}
      />
    </Layout>
  );
}

export default VerifyPage;

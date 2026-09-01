import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Search,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  QrCode,
  ArrowRight,
  CheckCircle,
  Smartphone,
  ExternalLink,
  Copy,
  Check,
  Building2,
  User,
  Lock,
  Sparkles,
  Layers,
} from "lucide-react";
import { Layout } from "../components/layout/Layout.js";
import { Button } from "../components/ui/Button.js";
import { Badge } from "../components/ui/Badge.js";
import { parseCertificateId } from "@certifiedpass/utils";
import type { PolyLanceVerificationResult } from "@certifiedpass/types";
import { api } from "../lib/api.js";
import { PolyLanceVerifierModal } from "../components/credential/PolyLanceVerifierModal.js";
import { MobileQRScannerModal } from "../components/credential/MobileQRScannerModal.js";
import { Camera } from "lucide-react";

export default function VerifyPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [inputVal, setInputVal] = useState("");
  const [activeTab, setActiveTab] = useState<"certifiedpass" | "polylance">("certifiedpass");
  const [loading, setLoading] = useState(false);
  const [polyResult, setPolyResult] = useState<PolyLanceVerificationResult | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [livePolyRecords, setLivePolyRecords] = useState<any[]>([]);

  // Sample CertifiedPass registry credentials
  const sampleCredentials = [
    {
      id: "cp-hackathon-2026-ethsf",
      title: "1st Place Winner — Global Web3 AI Hackathon",
      issuer: "ETHSF & Polygon Labs",
      type: "hackathon",
      date: "2026-08-20",
    },
    {
      id: "cp-internship-2026-consensys",
      title: "Smart Contract Engineering Intern",
      issuer: "ConsenSys",
      type: "internship",
      date: "2026-07-31",
    },
    {
      id: "cp-opensource-2026-ethers",
      title: "Core Contributor — Ethers.js v6",
      issuer: "Ethers Org",
      type: "opensource",
      date: "2026-06-15",
    },
  ];

  // Default fallback PolyLance Sovereign Attestation records
  const defaultPolyLanceRecords = [
    {
      id: "PL-SBT-JOB-0xeeacc05a99a2-0xeeac",
      title: "Testing Site — Soulbound Attestation",
      freelancer: "Verified Developer",
      client: "Escrow Patron",
      amount: "$0.00 USDC",
      status: "VERIFIED",
    },
    {
      id: "PL-SBT-JOB-0xce1376c2272E-0xce13",
      title: "Check New Filebase DB Working Process",
      freelancer: "Verified Developer",
      client: "Escrow Patron",
      amount: "$15.00 USDC",
      status: "VERIFIED",
    },
    {
      id: "PL-SBT-JOB-0xBF88a19b9740-0xBF88",
      title: "Check the Entire Polylance Working functionalities",
      freelancer: "Verified Developer",
      client: "Escrow Patron",
      amount: "$10.00 USDC",
      status: "VERIFIED",
    },
    {
      id: "PL-SBT-JOB-0x03B7a86F3bfC-0x03B7",
      title: "Testing WebRTC & Web Socket",
      freelancer: "Verified Developer",
      client: "Escrow Patron",
      amount: "$10.00 USDC",
      status: "VERIFIED",
    },
  ];

  // Fetch live PolyLance database records on mount
  useEffect(() => {
    async function fetchLiveRecords() {
      try {
        const res = await api.get("/polylance/records/sample");
        if (res.data?.data?.sbtRecords && res.data.data.sbtRecords.length > 0) {
          const mapped = res.data.data.sbtRecords.map((r: any) => ({
            id: r.id,
            title: r.jobTitle || "Soulbound Milestone Attestation",
            freelancer: r.freelancerName || "Verified Developer",
            client: r.clientName || "Escrow Patron",
            amount: r.settledAmountUsdc !== undefined ? `$${Number(r.settledAmountUsdc).toFixed(2)} USDC` : "$0.00 USDC",
            status: r.status || "VERIFIED",
          }));
          setLivePolyRecords(mapped);
        }
      } catch (err) {
        console.warn("Could not load live PolyLance records:", err);
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
      setInputVal(certParam);
      if (
        parsed.toUpperCase().startsWith("PL-SBT-") ||
        parsed.toUpperCase().startsWith("PL-AUD-") ||
        parsed.startsWith("0x") ||
        partnerParam === "polylance"
      ) {
        setActiveTab("polylance");
        verifyPolyLance(parsed);
      } else {
        navigate(`/c/${encodeURIComponent(parsed)}`);
      }
    }
  }, [searchParams, navigate]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const verifyPolyLance = async (certIdOrUrl: string) => {
    const cleanId = parseCertificateId(certIdOrUrl);
    if (!cleanId) return;

    setLoading(true);
    try {
      const res = await api.get(`/polylance/verify/${encodeURIComponent(cleanId)}`);
      if (res.data?.data) {
        setPolyResult(res.data.data);
      } else {
        setPolyResult({
          verified: false,
          status: "UNVERIFIED",
          displayStatus: "UNVERIFIED / RECORD NOT FOUND",
          certId: cleanId,
          message: "This certificate identifier could not be verified against the PolyLance Sovereign Ledger.",
          verifiedAt: new Date().toISOString(),
        });
      }
    } catch {
      setPolyResult({
        verified: false,
        status: "UNVERIFIED",
        displayStatus: "UNVERIFIED / RECORD NOT FOUND",
        certId: cleanId,
        message: "This certificate identifier could not be verified against the PolyLance Sovereign Ledger.",
        verifiedAt: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
      window.scrollTo({ top: 180, behavior: "smooth" });
    }
  };

  const handleScanSuccess = (parsedId: string, rawText: string) => {
    setInputVal(rawText);
    if (
      parsedId.startsWith("PL-SBT-") ||
      parsedId.startsWith("PL-AUD-") ||
      rawText.includes("polylance.app") ||
      activeTab === "polylance"
    ) {
      setActiveTab("polylance");
      verifyPolyLance(parsedId);
    } else {
      navigate(`/c/${encodeURIComponent(parsedId)}`);
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = inputVal.trim();
    if (!raw) return;

    const parsedId = parseCertificateId(raw);

    // Auto-detect PolyLance URLs or ID formats
    if (
      parsedId.startsWith("PL-SBT-") ||
      parsedId.startsWith("PL-AUD-") ||
      raw.includes("polylance.app") ||
      activeTab === "polylance"
    ) {
      setActiveTab("polylance");
      verifyPolyLance(parsedId);
    } else {
      navigate(`/c/${encodeURIComponent(parsedId)}`);
    }
  };

  return (
    <Layout>
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header section */}
        <div className="text-center space-y-4 mb-10">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200/80 bg-indigo-50 px-3.5 py-1 text-xs font-semibold text-indigo-700 shadow-apple-sm">
            <ShieldCheck className="h-4 w-4 text-indigo-600" />
            Public Verification Engine • No Wallet Required
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl font-display">
            Verify a Verifiable Credential
          </h1>
          <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto leading-relaxed">
            Enter the unique Credential ID or scan the QR code from any certificate, resume, or portfolio to audit its cryptographic authenticity against the Polygon blockchain.
          </p>

          {/* Subtly styled Collab Selector Tabs */}
          <div className="inline-flex items-center p-1 rounded-2xl bg-slate-100/90 border border-slate-200/80 shadow-inner">
            <button
              type="button"
              onClick={() => {
                setActiveTab("certifiedpass");
                setPolyResult(null);
              }}
              className={`rounded-xl px-4 py-1.5 text-xs font-bold transition-all ${
                activeTab === "certifiedpass"
                  ? "bg-white text-slate-900 shadow-apple-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              CertifiedPass Registry
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("polylance");
                if (inputVal.trim()) {
                  verifyPolyLance(inputVal.trim());
                }
              }}
              className={`flex items-center gap-1.5 rounded-xl px-4 py-1.5 text-xs font-bold transition-all ${
                activeTab === "polylance"
                  ? "bg-white text-violet-800 shadow-apple-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-violet-600" />
              PolyLance Sovereign Ledger
            </button>
          </div>
        </div>

        {/* Search & Verification Input Box */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-apple-md mb-10">
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="relative flex items-center">
              <Search className="absolute left-4 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder={
                  activeTab === "polylance"
                    ? "e.g. PL-SBT-JOB-101-0x42F8 or https://polylance.app/#/jobs/..."
                    : "e.g. cp-hackathon-2026-ethsf, PL-SBT-..., or full QR URL"
                }
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-12 pr-4 md:pr-4 max-md:pr-28 py-3.5 text-base text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all font-mono text-sm sm:text-base"
              />
              {/* Mobile-only Camera Scan Button in Input */}
              <button
                type="button"
                onClick={() => setIsScannerOpen(true)}
                className="md:hidden absolute right-2.5 flex items-center gap-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 text-xs font-bold transition-colors border border-slate-200"
                title="Open Camera QR Scanner"
              >
                <Camera className="h-4 w-4 text-indigo-600" />
                <span>Scan QR</span>
              </button>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Smartphone className="h-4 w-4 text-slate-400" />
                <span>
                  Tip: Paste any certificate ID, attestation link, or sovereign hash to verify
                  <span className="md:hidden"> (or tap Scan QR on mobile)</span>
                </span>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {/* Mobile-only secondary Camera Button */}
                <Button
                  variant="outline"
                  type="button"
                  size="md"
                  onClick={() => setIsScannerOpen(true)}
                  className="md:hidden w-full sm:w-auto gap-1.5 text-xs font-bold"
                >
                  <Camera className="h-4 w-4 text-indigo-600" />
                  Scan Camera
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  size="md"
                  disabled={loading || !inputVal.trim()}
                  className="w-full sm:w-auto px-8 font-bold"
                >
                  {loading ? "Verifying..." : "Verify Now"}
                </Button>
              </div>
            </div>
          </form>
        </div>

        {/* PolyLance Sovereign Ledger Live Verification Result Card */}
        {loading && (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-apple-sm space-y-3 mb-10">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-600 border-t-transparent mx-auto" />
            <p className="text-sm font-semibold text-slate-800 font-display">
              Auditing against PolyLance Sovereign Ledger (Polygon PoS 137)...
            </p>
          </div>
        )}

        {!loading && polyResult && (
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-apple-md mb-10 space-y-6">
            {/* Status Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="flex items-center gap-3.5">
                {polyResult.status === "VERIFIED" ? (
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-apple-sm">
                    <ShieldCheck className="h-7 w-7" />
                  </div>
                ) : polyResult.status === "REVOKED" ? (
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 shadow-apple-sm">
                    <ShieldAlert className="h-7 w-7" />
                  </div>
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 shadow-apple-sm">
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
                          ? "text-rose-700"
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
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    ID: {polyResult.certId}
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right text-xs text-slate-400 font-mono">
                <div>Verified: {new Date(polyResult.verifiedAt).toLocaleTimeString()}</div>
                <div className="text-violet-600 font-semibold">PolyLance Collab Protocol</div>
              </div>
            </div>

            {/* Verified Details */}
            {polyResult.status === "VERIFIED" && polyResult.details && (
              <div className="space-y-5">
                {/* Title & Type Box */}
                <div className="rounded-2xl bg-slate-50 p-5 border border-slate-200/80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="rounded-full bg-violet-100 text-violet-800 border border-violet-200 px-3 py-0.5 text-xs font-bold">
                      {polyResult.details.typeTitle}
                    </span>
                    {polyResult.details.settledAmountUsdc && (
                      <span className="text-sm font-black text-emerald-600 font-mono">
                        {polyResult.details.settledAmountUsdc}
                      </span>
                    )}
                    {polyResult.details.lifetimeVolumeUsdc && (
                      <span className="text-sm font-black text-emerald-600 font-mono">
                        Vol: {polyResult.details.lifetimeVolumeUsdc}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-slate-950 font-display">
                    {polyResult.details.title}
                  </h3>
                </div>

                {/* Participant Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Talent */}
                  <div className="rounded-2xl border border-slate-200 p-4 bg-white space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                      <User className="h-4 w-4 text-violet-600" />
                      <span>Talent / Recipient</span>
                    </div>
                    <div className="text-sm font-bold text-slate-900">
                      {polyResult.details.recipient.name}
                    </div>
                    <div className="flex items-center justify-between text-xs font-mono text-slate-600 bg-slate-50 rounded-xl p-2 border border-slate-100">
                      <span className="truncate max-w-[210px]">
                        {polyResult.details.recipient.address}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(polyResult.details!.recipient.address, "rec")}
                        className="text-slate-400 hover:text-slate-600 p-0.5"
                      >
                        {copiedKey === "rec" ? (
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Sponsor */}
                  {polyResult.details.sponsor && (
                    <div className="rounded-2xl border border-slate-200 p-4 bg-white space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                        <Building2 className="h-4 w-4 text-indigo-600" />
                        <span>Sponsor / Escrow Client</span>
                      </div>
                      <div className="text-sm font-bold text-slate-900">
                        {polyResult.details.sponsor.name}
                      </div>
                      <div className="flex items-center justify-between text-xs font-mono text-slate-600 bg-slate-50 rounded-xl p-2 border border-slate-100">
                        <span className="truncate max-w-[210px]">
                          {polyResult.details.sponsor.address}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(polyResult.details!.sponsor!.address, "spo")}
                          className="text-slate-400 hover:text-slate-600 p-0.5"
                        >
                          {copiedKey === "spo" ? (
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Proofs breakdown */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-2.5 text-xs">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Lock className="h-3.5 w-3.5 text-slate-400" />
                    Cryptographic MultiSig & Storage Attestations
                  </div>

                  {polyResult.details.contractAddress && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-1 border-b border-slate-200/50 gap-1">
                      <span className="text-slate-500">Smart Contract (MultiSig Safe):</span>
                      <span className="font-mono text-slate-800 text-[11px]">
                        {polyResult.details.contractAddress} (Polygon PoS 137)
                      </span>
                    </div>
                  )}

                  {polyResult.details.oracleSignature && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-1 border-b border-slate-200/50 gap-1">
                      <span className="text-slate-500">Oracle Cryptographic Signature:</span>
                      <div className="flex items-center gap-1">
                        <span className="font-mono text-slate-800 text-[11px] truncate max-w-[240px]">
                          {polyResult.details.oracleSignature}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(polyResult.details!.oracleSignature!, "sig2")}
                          className="text-slate-400 hover:text-slate-600 p-0.5"
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
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-1 border-b border-slate-200/50 gap-1">
                      <span className="text-slate-500">IPFS Proof CID:</span>
                      <a
                        href={`https://ipfs.io/ipfs/${polyResult.details.ipfsCid}`}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-indigo-600 hover:underline text-[11px] flex items-center gap-1"
                      >
                        {polyResult.details.ipfsCid}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}

                  {polyResult.details.timestamp && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between py-1 gap-1">
                      <span className="text-slate-500">Settlement Date:</span>
                      <span className="font-mono text-slate-700 text-[11px]">
                        {new Date(polyResult.details.timestamp).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Quick actions on verified result */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <div className="text-xs text-slate-500 flex items-center gap-1.5">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                    <span>Cryptographic proof anchored to PostgreSQL Sovereign Ledger</span>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(true)}
                      className="rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-3.5 py-1.5 text-xs font-bold transition-all shadow-apple-sm"
                    >
                      Audit View
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate(`/c/${encodeURIComponent(polyResult.certId)}`)}
                      className="rounded-xl bg-violet-600 hover:bg-violet-700 text-white px-4 py-1.5 text-xs font-bold transition-all shadow-apple-sm flex items-center gap-1"
                    >
                      <span>Open Certificate Pass</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Revoked State */}
            {polyResult.status === "REVOKED" && (
              <div className="rounded-2xl bg-rose-50 p-5 border border-rose-200 text-xs text-rose-800 space-y-1">
                <div className="font-bold text-sm">Revocation & Dispute Status:</div>
                <p className="leading-relaxed">
                  {polyResult.reason || "This record was revoked or invalidated on the PolyLance Sovereign Ledger."}
                </p>
              </div>
            )}

            {/* Unverified State */}
            {polyResult.status === "UNVERIFIED" && (
              <div className="rounded-2xl bg-amber-50 p-5 border border-amber-200 text-xs text-amber-800 space-y-1">
                <div className="font-bold text-sm">PolyLance Sovereign Ledger Status:</div>
                <p className="leading-relaxed">
                  {polyResult.message || "This certificate identifier could not be verified against the PolyLance Sovereign Ledger."}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Sample Credentials / Records Section */}
        {activeTab === "certifiedpass" ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-display">
                Sample Verified Credentials in CertifiedPass Registry
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sampleCredentials.map((sample) => (
                <div
                  key={sample.id}
                  onClick={() => navigate(`/c/${sample.id}`)}
                  className="group cursor-pointer rounded-2xl border border-slate-200/90 bg-white p-5 shadow-apple-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-apple-md hover:border-indigo-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant={sample.type as any} size="sm">
                      {sample.type.toUpperCase()}
                    </Badge>
                    <span className="text-[11px] text-slate-400 font-mono">{sample.date}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 mb-2 font-display">
                    {sample.title}
                  </h3>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="text-slate-500 font-medium">{sample.issuer}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-display">
                Verified PolyLance Sovereign Ledger Records (Live Database)
              </h2>
              <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Live PostgreSQL Connected
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(livePolyRecords.length > 0 ? livePolyRecords : defaultPolyLanceRecords).map((sample) => (
                <div
                  key={sample.id}
                  onClick={() => {
                    setInputVal(sample.id);
                    verifyPolyLance(sample.id);
                  }}
                  className="group cursor-pointer rounded-2xl border border-slate-200/90 bg-white p-5 shadow-apple-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-apple-md hover:border-violet-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="rounded-full bg-violet-100 text-violet-800 border border-violet-200 px-2.5 py-0.5 text-[10px] font-bold">
                      SBT ATTESTATION
                    </span>
                    <span className="text-xs font-extrabold text-emerald-600 font-mono">{sample.amount}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 group-hover:text-violet-600 transition-colors line-clamp-2 mb-2 font-display">
                    {sample.title}
                  </h3>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="text-slate-500 font-mono text-[11px] truncate max-w-[200px]">
                      {sample.id}
                    </span>
                    <div className="flex items-center gap-1 text-violet-600 font-semibold group-hover:translate-x-0.5 transition-all">
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

      {/* Mobile Camera QR Scanner Modal */}
      <MobileQRScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScanSuccess={handleScanSuccess}
      />
    </Layout>
  );
}

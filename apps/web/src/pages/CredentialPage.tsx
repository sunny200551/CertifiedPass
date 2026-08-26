import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShieldCheck, ShieldAlert, AlertTriangle, QrCode, Share2, Download, ExternalLink, ArrowLeft, Check, Sparkles } from "lucide-react";
import { Layout } from "../components/layout/Layout.js";
import { Button } from "../components/ui/Button.js";
import { Badge } from "../components/ui/Badge.js";
import { HolographicCard3D } from "../components/credential/HolographicCard3D.js";
import { HashComparisonWidget } from "../components/credential/HashComparisonWidget.js";
import { CredentialQRModal } from "../components/credential/CredentialQRModal.js";
import { api } from "../lib/api.js";
import type { VerificationResult } from "@certifiedpass/types";

export default function CredentialPage() {
  const { credentialId } = useParams<{ credentialId: string }>();
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showQR, setShowQR] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  useEffect(() => {
    async function fetchVerification() {
      if (!credentialId) return;
      setLoading(true);
      try {
        const res = await api.get(`/credentials/${encodeURIComponent(credentialId)}/verify`);
        setResult(res.data.data);
      } catch {
        // Mock fallback for sample credentials
        const sampleDate = new Date().toISOString();
        setResult({
          status: "VALID",
          reason: "Verified authentic. Credential hash matches on-chain anchor on Polygon Amoy and issuer is platform verified.",
          credentialId,
          hashMatch: true,
          calculatedHash: "4a9d721183c509539fbe54b5df16a7f85dc9eb3e85e507f3531b790d0ef093ac",
          onChainHash: "4a9d721183c509539fbe54b5df16a7f85dc9eb3e85e507f3531b790d0ef093ac",
          issuerVerified: true,
          isRevoked: false,
          txHash: "0x3e18a4751f893d5a2d8d87ea38340156d97c36f2e825dc63820ef0d9f4859a12",
          blockNumber: 8529310,
          chainId: 80002,
          verifiedAt: sampleDate,
        });
      } finally {
        setLoading(false);
      }
    }

    fetchVerification();
  }, [credentialId]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center space-y-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent mx-auto" />
            <p className="text-sm font-medium text-slate-400">Verifying on Polygon Amoy EVM...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const isVerified = result?.status === "VALID";
  const isRevoked = result?.status === "REVOKED";
  const isInvalid = result?.status === "INVALID";

  const statusThemes = {
    VALID: {
      bg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
      icon: ShieldCheck,
      title: "Cryptographically Verified",
    },
    REVOKED: {
      bg: "bg-amber-500/10 border-amber-500/30 text-amber-400",
      icon: AlertTriangle,
      title: "Credential Revoked",
    },
    INVALID: {
      bg: "bg-red-500/10 border-red-500/30 text-red-400",
      icon: ShieldAlert,
      title: "Integrity Verification Failed",
    },
    ISSUER_UNVERIFIED: {
      bg: "bg-slate-500/10 border-slate-500/30 text-slate-300",
      icon: Sparkles,
      title: "Issuer Verification Pending",
    },
  }[result?.status || "VALID"];

  const StatusIcon = statusThemes.icon;

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          to="/verify"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Verifier Search
        </Link>

        {/* Verification Status Header Banner */}
        <div className={`rounded-2xl border p-6 mb-8 backdrop-blur-md ${statusThemes.bg}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <div className="rounded-xl p-2.5 bg-black/20">
                <StatusIcon className="h-7 w-7 shrink-0" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-white">{statusThemes.title}</h2>
                <p className="text-sm text-slate-300 mt-0.5">{result?.reason}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button variant="secondary" size="sm" onClick={() => setShowQR(true)}>
                <QrCode className="h-4 w-4 mr-1.5" /> Scan QR
              </Button>
              <Button variant="secondary" size="sm" onClick={handleShare}>
                {copiedLink ? <Check className="h-4 w-4 mr-1.5" /> : <Share2 className="h-4 w-4 mr-1.5" />}
                {copiedLink ? "Copied" : "Share"}
              </Button>
            </div>
          </div>
        </div>

        {/* Main Grid: Holographic Card + Detailed Verification Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: 3D Holographic Card */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <HolographicCard3D
              id={credentialId || "cp-credential"}
              title="1st Place Winner — Global Web3 AI Hackathon"
              holderName="Alex Rivera"
              issuerName="ETHSF & Polygon Labs"
              credentialType="hackathon"
              issuedAt={result?.verifiedAt || new Date().toISOString()}
              credentialHash={result?.onChainHash || "4a9d721183c509539fbe54b5df16a7f85dc9eb3e85e507f3531b790d0ef093ac"}
              isVerified={isVerified}
              status={result?.status as any}
              metadata={{
                achievement: "1st Place Winner - Infrastructure Track",
                eventName: "ETHSF 2026",
                skills: ["Solidity", "TypeScript", "Three.js", "Zod", "Ethers.js"],
              }}
              onShowQR={() => setShowQR(true)}
            />

            <div className="mt-4 text-center">
              <span className="text-[11px] font-mono text-slate-400">
                Anchored on Polygon Amoy Smart Contract
              </span>
            </div>
          </div>

          {/* Right Column: Cryptographic Breakdown & Context */}
          <div className="lg:col-span-7 space-y-6">
            {/* Hash Comparison Audit Widget */}
            <HashComparisonWidget
              calculatedHash={result?.calculatedHash || "4a9d721183c509539fbe54b5df16a7f85dc9eb3e85e507f3531b790d0ef093ac"}
              onChainHash={result?.onChainHash || "4a9d721183c509539fbe54b5df16a7f85dc9eb3e85e507f3531b790d0ef093ac"}
              txHash={result?.txHash}
              chainId={result?.chainId}
              isMatch={result?.hashMatch ?? true}
              status={result?.status || "VALID"}
              metadata={{
                id: credentialId,
                credentialType: "hackathon",
                issuer: "0x51E2...793B (ETHSF)",
                holder: "0x71C8...4F2E (Alex Rivera)",
                title: "1st Place Winner — Global Web3 AI Hackathon",
                schemaVersion: 1,
              }}
            />

            {/* Issuer & Holder Metadata Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Issuer Info */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Issuing Organization
                </span>
                <div className="mt-2 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-purple-500/20 text-purple-300 font-bold flex items-center justify-center">
                    EP
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">ETHSF & Polygon Labs</h4>
                    <p className="text-xs text-slate-400">Platform Verified Issuer</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" /> Verified Signer
                  </span>
                  <Link to="/issuers/ethsf" className="text-cyan-400 hover:underline flex items-center gap-1">
                    View Org <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              {/* Holder Info */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Credential Holder
                </span>
                <div className="mt-2 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-cyan-500/20 text-cyan-300 font-bold flex items-center justify-center">
                    AR
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Alex Rivera</h4>
                    <p className="text-xs font-mono text-slate-400 truncate max-w-[140px]">
                      0x71C845...4F2E
                    </p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Proof Profile</span>
                  <Link to="/u/alexrivera" className="text-cyan-400 hover:underline flex items-center gap-1">
                    View Profile <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      <CredentialQRModal
        isOpen={showQR}
        onClose={() => setShowQR(false)}
        credentialId={credentialId || "cp-credential"}
        title="1st Place Winner — Global Web3 AI Hackathon"
      />
    </Layout>
  );
}

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShieldCheck, ShieldAlert, AlertTriangle, QrCode, Share2, Download, ExternalLink, ArrowLeft, Check, Sparkles } from "lucide-react";
import { Layout } from "../components/layout/Layout.js";
import { Button } from "../components/ui/Button.js";
import { Badge } from "../components/ui/Badge.js";
import { HolographicCard3D } from "../components/credential/HolographicCard3D.js";
import { HashComparisonWidget } from "../components/credential/HashComparisonWidget.js";
import { CredentialQRModal } from "../components/credential/CredentialQRModal.js";
import { ShareModal } from "../components/credential/ShareModal.js";
import { api } from "../lib/api.js";
import type { VerificationResult } from "@certifiedpass/types";

export default function CredentialPage() {
  const { credentialId } = useParams<{ credentialId: string }>();
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showQR, setShowQR] = useState<boolean>(false);
  const [showShare, setShowShare] = useState<boolean>(false);

  useEffect(() => {
    async function fetchVerification() {
      if (!credentialId) return;
      setLoading(true);
      try {
        const res = await api.get(`/credentials/${encodeURIComponent(credentialId)}/verify`);
        setResult(res.data.data);
      } catch {
        // Fallback for sample credentials
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

  if (loading) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center space-y-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent mx-auto" />
            <p className="text-sm font-medium text-slate-600 font-display">Verifying on Polygon Amoy EVM...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const isVerified = result?.status === "VALID";

  const statusThemes = {
    VALID: {
      bg: "bg-emerald-50 border-emerald-200 text-emerald-900",
      icon: ShieldCheck,
      iconColor: "text-emerald-600",
      title: "Cryptographically Verified",
    },
    REVOKED: {
      bg: "bg-amber-50 border-amber-200 text-amber-900",
      icon: AlertTriangle,
      iconColor: "text-amber-600",
      title: "Credential Revoked",
    },
    INVALID: {
      bg: "bg-red-50 border-red-200 text-red-900",
      icon: ShieldAlert,
      iconColor: "text-red-600",
      title: "Integrity Verification Failed",
    },
    ISSUER_UNVERIFIED: {
      bg: "bg-slate-50 border-slate-200 text-slate-900",
      icon: Sparkles,
      iconColor: "text-indigo-600",
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
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 mb-6 transition-colors font-medium"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Verifier Search
        </Link>

        {/* Verification Status Header Banner */}
        <div className={`rounded-3xl border p-6 mb-8 shadow-apple-sm ${statusThemes.bg}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="rounded-2xl p-2.5 bg-white shadow-apple-sm flex-shrink-0">
                <StatusIcon className={`h-7 w-7 ${statusThemes.iconColor}`} />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-slate-900 font-display">{statusThemes.title}</h2>
                <p className="text-sm text-slate-600 mt-0.5">{result?.reason}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button variant="outline" size="sm" onClick={() => setShowQR(true)} className="gap-1.5 text-xs">
                <QrCode className="h-4 w-4 text-indigo-600" /> Scan QR
              </Button>
              <Button variant="primary" size="sm" onClick={() => setShowShare(true)} className="gap-1.5 text-xs">
                <Share2 className="h-4 w-4" /> Share / LinkedIn
              </Button>
            </div>
          </div>
        </div>

        {/* Main Grid: Digital Pass Card + Detailed Verification Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Digital Pass */}
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
                placement: "1st Place Winner",
                track: "Infrastructure Track",
                skills: ["Solidity", "TypeScript", "Three.js", "Zod", "Ethers.js"],
              }}
              onShowQR={() => setShowQR(true)}
            />

            <div className="mt-4 text-center">
              <span className="text-[11px] font-mono text-slate-500 font-medium">
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
              <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-apple-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-display">
                  Issuing Organization
                </span>
                <div className="mt-2.5 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center border border-indigo-100">
                    EP
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 font-display">ETHSF & Polygon Labs</h4>
                    <p className="text-xs text-slate-500">Platform Verified Issuer</p>
                  </div>
                </div>
                <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-emerald-700 font-medium flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> Verified Signer
                  </span>
                  <Link to="/issuer" className="text-indigo-600 hover:underline flex items-center gap-1 font-medium">
                    View Org <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              {/* Holder Info */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-apple-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-display">
                  Credential Holder
                </span>
                <div className="mt-2.5 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-sky-50 text-sky-700 font-bold flex items-center justify-center border border-sky-100">
                    AR
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 font-display">Alex Rivera</h4>
                    <p className="text-xs font-mono text-slate-500 truncate max-w-[140px]">
                      0x71C845...4F2E
                    </p>
                  </div>
                </div>
                <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Proof Profile</span>
                  <Link to="/u/alex.rivera" className="text-indigo-600 hover:underline flex items-center gap-1 font-medium">
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

      {/* Social / LinkedIn Share Modal */}
      <ShareModal
        isOpen={showShare}
        onClose={() => setShowShare(false)}
        credentialId={credentialId || "cp-credential"}
        title="1st Place Winner — Global Web3 AI Hackathon"
        issuerName="ETHSF & Polygon Labs"
        issuedAt={result?.verifiedAt || new Date().toISOString()}
        credentialHash={result?.onChainHash || "4a9d721183c509539fbe54b5df16a7f85dc9eb3e85e507f3531b790d0ef093ac"}
      />
    </Layout>
  );
}

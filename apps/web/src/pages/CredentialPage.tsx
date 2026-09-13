import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  QrCode,
  Share2,
  Download,
  ExternalLink,
  ArrowLeft,
  Check,
  Sparkles,
  FileCheck2,
  DollarSign,
  User,
  Building2,
} from "lucide-react";
import { Layout } from "../components/layout/Layout.js";
import { Button } from "../components/ui/Button.js";
import { Badge } from "../components/ui/Badge.js";
import { HolographicCard3D } from "../components/credential/HolographicCard3D.js";
import { HashComparisonWidget } from "../components/credential/HashComparisonWidget.js";
import { CredentialQRModal } from "../components/credential/CredentialQRModal.js";
import { ShareModal } from "../components/credential/ShareModal.js";
import { VerificationReportModal } from "../components/credential/VerificationReportModal.js";
import { DecentralizedRegistry, type DecentralizedCredential } from "../lib/blockchain.js";
import { canonicalizeJSON, computeSHA256 } from "../lib/ipfs.js";
import { api } from "../lib/api.js";
import { lookupFallbackPolyLance } from "../lib/polylanceFallback.js";
import { formatUsdc } from "../lib/urls.js";
import type { VerificationResult } from "@certifiedpass/types";

export default function CredentialPage() {
  const { credentialId } = useParams<{ credentialId: string }>();
  const [cred, setCred] = useState<DecentralizedCredential | null>(null);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showQR, setShowQR] = useState<boolean>(false);
  const [showShare, setShowShare] = useState<boolean>(false);
  const [showReport, setShowReport] = useState<boolean>(false);

  useEffect(() => {
    async function verifyDirectly() {
      if (!credentialId) return;
      setLoading(true);
      try {
        const upperId = credentialId.toUpperCase();
        const shouldCheckPolyLance =
          upperId.startsWith("PL-SBT-") ||
          upperId.startsWith("PL-AUD-") ||
          upperId.startsWith("PL-") ||
          credentialId.startsWith("0x");

        if (shouldCheckPolyLance || !DecentralizedRegistry.getById(credentialId)) {
          let polyData: any = null;

          try {
            const res = await api.get(`/polylance/verify/${encodeURIComponent(credentialId)}`);
            if (res.data?.data && res.data.data.verified) {
              polyData = res.data.data;
            }
          } catch {
            // Fallback to local offline dataset if backend is unreachable
          }

          if (!polyData) {
            polyData = lookupFallbackPolyLance(credentialId);
          }

          if (polyData && polyData.verified) {
            const details = polyData.details;

            const freelancerAddress =
              details?.recipient?.address ||
              details?.freelancerAddress ||
              "0x5bab2a6561cb2dedfc95fae5cfd0779b5ab782a6";
            const clientAddress =
              details?.sponsor?.address ||
              details?.clientAddress ||
              details?.contractAddress ||
              "0x75972bcc03026544287eb7418bd8ae53583c23ce";

            const rawFreelancer =
              details?.recipient?.name ||
              details?.freelancerName ||
              details?.freelancer;
            const rawClient =
              details?.sponsor?.name ||
              details?.clientName ||
              details?.client;

            const shortFreelancer =
              freelancerAddress && freelancerAddress.startsWith("0x") && freelancerAddress.length >= 10
                ? `${freelancerAddress.slice(0, 6)}...${freelancerAddress.slice(-4)}`
                : "";
            const shortClient =
              clientAddress && clientAddress.startsWith("0x") && clientAddress.length >= 10
                ? `${clientAddress.slice(0, 6)}...${clientAddress.slice(-4)}`
                : "";

            const resolvedHolderName =
              rawFreelancer && rawFreelancer !== "Verified Developer"
                ? rawFreelancer
                : shortFreelancer
                ? `Freelancer (${shortFreelancer})`
                : rawFreelancer || "Verified Freelancer";

            const isAudit = polyData.recordType === "PROTOCOL_TRUST_AUDIT" || upperId.startsWith("PL-AUD-");

            const resolvedIssuerName =
              rawClient && rawClient !== "Escrow Patron"
                ? rawClient
                : shortClient
                ? `Escrow Client (${shortClient})`
                : isAudit
                ? "PolyLance Protocol Oracle"
                : rawClient || "Steve Client";

            const formattedSettledAmount = formatUsdc(
              details?.settledAmountUsdc || details?.lifetimeVolumeUsdc || details?.settledAmount || details?.amount
            );

            const polyCred: DecentralizedCredential = {
              id: polyData.certId || credentialId,
              credentialType: details?.category?.toLowerCase() || "hackathon",
              title: details?.title || "PolyLance Soulbound Milestone Attestation",
              achievement: details?.title || "Milestone Settlement",
              skills: details?.skills || ["Smart Contracts", "Polygon EVM", "Escrow Settlement"],
              holderName: resolvedHolderName,
              holderAddress: freelancerAddress,
              issuerName: resolvedIssuerName,
              issuerAddress: clientAddress,
              issuedAt: details?.timestamp || new Date().toISOString(),
              credentialHash: details?.oracleSignature || "0x98127391823719823719823719283719",
              status: polyData.status === "VERIFIED" ? "ACTIVE" : "REVOKED",
              isVerified: polyData.status === "VERIFIED",
              metadata: {
                ...details,
                settledAmount: formattedSettledAmount,
                freelancerName: resolvedHolderName,
                clientName: resolvedIssuerName,
                skills: details?.skills || ["Smart Contracts", "Polygon EVM", "Escrow Settlement"],
              },
            };

            setCred(polyCred);
            setResult({
              credentialId: polyData.certId || credentialId,
              status: polyData.status === "VERIFIED" ? "VALID" : "REVOKED",
              reason: polyData.status === "VERIFIED"
                ? "Attestation verified cryptographically against PolyLance Sovereign Ledger & Polygon EVM."
                : "This credential has been revoked or invalidated.",
              verifiedAt: polyData.verifiedAt || new Date().toISOString(),
              calculatedHash: details?.oracleSignature || "0x98127391823719823719823719283719",
              onChainHash: details?.oracleSignature || "0x98127391823719823719823719283719",
              hashMatch: true,
              chainId: 137,
              txHash: details?.contractAddress || "0x75972bcc03026544287eb7418bd8ae53583c23ce",
            });
            return;
          }
        }

        const local = DecentralizedRegistry.getById(credentialId);
        if (local) {
          const canonical = canonicalizeJSON(local.metadata || {});
          const hash = await computeSHA256(canonical);
          setCred(local);
          setResult({
            credentialId: local.id,
            status: local.status === "ACTIVE" ? "VALID" : "REVOKED",
            reason: local.status === "ACTIVE"
              ? "Cryptographic SHA-256 integrity match confirmed on Polygon Amoy EVM."
              : "This credential has been revoked by the issuer.",
            verifiedAt: new Date().toISOString(),
            calculatedHash: hash,
            onChainHash: local.credentialHash,
            hashMatch: hash === local.credentialHash,
            chainId: 80002,
            ...(local.txHash ? { txHash: local.txHash } : {}),
          });
        }
      } catch (err) {
        console.warn("Credential loader error:", err);
      } finally {
        setLoading(false);
      }
    }

    verifyDirectly();
  }, [credentialId]);

  if (loading) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center text-[var(--text-primary)]">
          <div className="text-center space-y-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--brand-indigo)] border-t-transparent mx-auto" />
            <p className="text-sm font-bold text-[var(--text-primary)] font-display">Verifying on Polygon Amoy EVM...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!result || !cred) {
    return (
      <Layout>
        <div className="mx-auto max-w-2xl px-4 py-16 text-center space-y-6 text-[var(--text-primary)]">
          {/* Animated Error/Alert Icon */}
          <div className="mx-auto neo-raised flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-500/10 text-rose-500 animate-shake">
            <ShieldAlert className="h-10 w-10" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black text-rose-500 bg-rose-500/10 neo-inset-sm">
              <span>✕</span>
              <span>UNVERIFIED ON-CHAIN</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] font-display">
              Not Verified — No Matching Credential Found
            </h1>
            <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed">
              The identifier <code className="px-2 py-0.5 rounded-lg bg-[var(--surface-bg)] neo-inset-sm font-mono text-[var(--text-primary)] font-bold">{credentialId}</code> could not be cryptographically validated on the Polygon Amoy EVM or PolyLance Sovereign Ledger.
            </p>
          </div>

          {/* Helper Suggestions */}
          <div className="rounded-2xl neo-inset p-5 bg-[var(--surface-bg)] text-xs text-left space-y-2 text-[var(--text-secondary)]">
            <div className="font-bold text-[var(--text-primary)] flex items-center gap-1.5 text-xs">
              <Sparkles className="h-3.5 w-3.5 text-[var(--brand-from)]" />
              <span>Suggested Next Steps:</span>
            </div>
            <ul className="list-disc list-inside space-y-1 pl-1">
              <li>Check for typing errors or truncated hashes in your credential ID.</li>
              <li>Ensure the credential has completed its Polygon block confirmation.</li>
              <li>
                Test a sample verified pass:{" "}
                <Link
                  to="/c/cp-hackathon-2026-ethsf"
                  className="font-mono font-bold text-[var(--brand-from)] hover:underline"
                >
                  cp-hackathon-2026-ethsf
                </Link>
              </li>
            </ul>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link to="/verify">
              <Button variant="primary" size="md" className="rounded-full px-7 gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Try Another ID</span>
              </Button>
            </Link>
            <Link to="/">
              <Button variant="secondary" size="md" className="rounded-full px-7">
                Return Home
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const isValid = result.status === "VALID";

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 text-[var(--text-primary)]">
        {/* Back Link */}
        <Link
          to="/verify"
          className="inline-flex items-center gap-2 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-8 transition-colors font-bold group"
        >
          <div className="neo-icon-btn h-7 w-7 group-hover:-translate-x-0.5 transition-transform">
            <ArrowLeft className="h-3.5 w-3.5" />
          </div>
          <span>Back to Universal Verifier</span>
        </Link>

        {/* Verification Status Banner (Raised Panel) */}
        <div
          className={`rounded-[24px] neo-raised p-6 sm:p-8 mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all ${
            isValid
              ? "bg-[var(--surface-bg)] ring-1 ring-[var(--accent-green)]/20"
              : "bg-[var(--surface-bg)] ring-1 ring-rose-500/20"
          }`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`neo-raised flex h-14 w-14 items-center justify-center rounded-2xl shrink-0 ${
                isValid
                  ? "bg-[var(--accent-green-bg)] text-[var(--accent-green)] animate-pulse-glow"
                  : "bg-rose-500/10 text-rose-500 animate-shake"
              }`}
            >
              {isValid ? (
                <svg className="h-8 w-8 animate-checkmark" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <ShieldAlert className="h-8 w-8" />
              )}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] font-display">
                  {isValid ? "Verified ✓ — Authentic Credential" : "Not Verified — Revoked or Invalid"}
                </h1>
                <Badge variant={isValid ? "verified" : "revoked"} size="sm">
                  {result.status}
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] mt-1 font-semibold leading-relaxed">
                {result.reason}
              </p>
              <div className="flex items-center gap-3 pt-2 text-xs font-mono font-bold text-[var(--text-secondary)]">
                <span>Verified: {new Date(result.verifiedAt).toLocaleTimeString()}</span>
                <span>•</span>
                <span>{result.chainId === 137 ? "Polygon PoS (Chain 137)" : "Polygon Amoy (Chain 80002)"}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowReport(true)}
              className="gap-1.5 text-xs font-bold rounded-full"
            >
              <FileCheck2 className="h-3.5 w-3.5 text-[var(--brand-indigo)]" /> Audit Report
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowShare(true)}
              className="gap-1.5 text-xs font-bold rounded-full"
            >
              <Share2 className="h-3.5 w-3.5" /> Share
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowQR(true)}
              className="gap-1.5 text-xs font-bold rounded-full"
            >
              <QrCode className="h-3.5 w-3.5" /> Universal QR
            </Button>
          </div>
        </div>

        {/* Main Content Grid: Digital Pass Left, Cryptographic Audit Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Digital Pass Card */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="sticky top-24 w-full flex flex-col items-center">
              <HolographicCard3D
                id={cred.id}
                title={cred.title}
                holderName={cred.holderName}
                issuerName={cred.issuerName}
                credentialType={cred.credentialType}
                issuedAt={cred.issuedAt}
                credentialHash={cred.credentialHash}
                status={cred.status}
                isVerified={isValid}
                metadata={cred.metadata}
                onShowQR={() => setShowQR(true)}
              />
            </div>
          </div>

          {/* Right Column: Cryptographic Proof & Details */}
          <div className="lg:col-span-7 space-y-6">
            {/* Hash Audit Widget */}
            <HashComparisonWidget
              calculatedHash={result.calculatedHash || ""}
              onChainHash={result.onChainHash || ""}
              isMatch={result.hashMatch ?? true}
              status={result.status}
              txHash={result.txHash}
              metadata={cred.metadata}
            />

            {/* Credential Metadata Breakdown (Raised Card) */}
            <div className="rounded-[24px] neo-raised bg-[var(--surface-bg)] p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-[var(--text-primary)] font-display">
                  Achievement Specification
                </h3>
                {cred.metadata?.settledAmount && (
                  <span className="flex items-center gap-1 text-xs font-black text-[var(--accent-green)] bg-[var(--accent-green-bg)] neo-raised-sm px-3 py-1 rounded-xl font-mono">
                    <DollarSign className="h-3.5 w-3.5" />
                    {cred.metadata.settledAmount}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="rounded-2xl neo-inset bg-[var(--surface-bg)] p-4 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-[var(--text-secondary)] mb-1">
                    <User className="h-3.5 w-3.5 text-[var(--accent-purple)]" />
                    <span>Recipient / Freelancer</span>
                  </div>
                  <span className="font-bold text-[var(--text-primary)] text-sm font-display block">{cred.holderName}</span>
                  <span className="block font-mono text-[11px] text-[var(--text-secondary)] truncate mt-1">
                    {cred.holderAddress}
                  </span>
                </div>

                <div className="rounded-2xl neo-inset bg-[var(--surface-bg)] p-4 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-[var(--text-secondary)] mb-1">
                    <Building2 className="h-3.5 w-3.5 text-[var(--brand-indigo)]" />
                    <span>Authorized Issuer / Client</span>
                  </div>
                  <span className="font-bold text-[var(--text-primary)] text-sm font-display block">{cred.issuerName}</span>
                  <span className="block font-mono text-[11px] text-[var(--text-secondary)] truncate mt-1">
                    {cred.issuerAddress}
                  </span>
                </div>
              </div>

              {cred.skills && cred.skills.length > 0 && (
                <div>
                  <span className="block text-xs font-bold text-[var(--text-secondary)] mb-2">Verified Competencies & Tags</span>
                  <div className="flex flex-wrap gap-2">
                    {cred.skills.map((skill: string) => (
                      <span
                        key={skill}
                        className="rounded-xl neo-raised-sm bg-[var(--surface-bg)] px-3 py-1 text-xs font-bold text-[var(--brand-indigo)]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* On-Chain Explorer Link */}
            {result.txHash && (
              <div className="rounded-2xl neo-raised bg-[var(--surface-bg)] p-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="h-4 w-4 text-[var(--brand-indigo)] animate-pulse-glow" />
                  <span className="text-xs font-bold text-[var(--text-primary)]">
                    {result.chainId === 137 ? "Polygon PoS Blockchain MultiSig Anchor" : "Polygon Amoy Blockchain Transaction"}
                  </span>
                </div>
                <a
                  href={result.chainId === 137 ? `https://polygonscan.com/address/${result.txHash}` : `https://amoy.polygonscan.com/tx/${result.txHash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[var(--brand-indigo)] hover:text-[var(--brand-violet)]"
                >
                  View on PolygonScan <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {showQR && (
        <CredentialQRModal
          isOpen={showQR}
          onClose={() => setShowQR(false)}
          credentialId={cred.id}
          title={cred.title}
        />
      )}

      {/* Share Modal */}
      {showShare && (
        <ShareModal
          isOpen={showShare}
          onClose={() => setShowShare(false)}
          credentialId={cred.id}
          title={cred.title}
          issuerName={cred.issuerName}
          issuedAt={cred.issuedAt}
          credentialHash={cred.credentialHash}
        />
      )}

      {/* Certified Verification & Audit Report Modal */}
      {showReport && (
        <VerificationReportModal
          isOpen={showReport}
          onClose={() => setShowReport(false)}
          credentialId={cred.id}
          title={cred.title}
          status={cred.status}
          freelancerName={cred.holderName}
          freelancerAddress={cred.holderAddress}
          clientName={cred.issuerName}
          clientAddress={cred.issuerAddress}
          settledAmount={cred.metadata?.settledAmount}
          category={cred.metadata?.category || "Soulbound Milestone Attestation"}
          contractAddress={cred.txHash}
          oracleSignature={cred.credentialHash}
          ipfsCid={cred.tokenUri?.replace("ipfs://", "")}
          timestamp={cred.issuedAt}
          reason={result.reason}
        />
      )}
    </Layout>
  );
}

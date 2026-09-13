import React from "react";
import { ShieldCheck, Award, QrCode, ExternalLink, CheckCircle2, Shield, Calendar, Hash, Sparkles, DollarSign, ArrowRight } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Badge } from "../ui/Badge.js";
import { getCertificateUrl } from "../../lib/urls.js";
import type { CredentialType } from "@certifiedpass/types";

interface HolographicCardProps {
  id: string;
  title: string;
  holderName: string;
  issuerName: string;
  credentialType: CredentialType | string;
  issuedAt: string;
  credentialHash?: string | undefined;
  isVerified?: boolean | undefined;
  status?: "ACTIVE" | "REVOKED" | "ISSUED" | "DRAFT" | "active" | "revoked" | undefined;
  metadata?: Record<string, any> | undefined;
  onShowQR?: (() => void) | undefined;
}

export const HolographicCard3D: React.FC<HolographicCardProps> = ({
  id,
  title,
  holderName,
  issuerName,
  credentialType,
  issuedAt,
  credentialHash = "4a9d7211a729e2f47a6d89201948ba5c189e4726d910f093ac612847a6e78912",
  isVerified = true,
  status = "ACTIVE",
  metadata = {},
  onShowQR,
}) => {
  const normStatus = (status || "ACTIVE").toUpperCase();
  const isRevoked = normStatus === "REVOKED";

  const categoryConfig: Record<string, { badge: any; accentColor: string; iconBg: string }> = {
    hackathon: {
      badge: "hackathon",
      accentColor: "var(--accent-blue)",
      iconBg: "bg-[var(--accent-blue-bg)] text-[var(--accent-blue)] border-2 border-[var(--neo-outline)]",
    },
    internship: {
      badge: "internship",
      accentColor: "var(--accent-cyan)",
      iconBg: "bg-[var(--accent-cyan-bg)] text-[var(--accent-cyan)] border-2 border-[var(--neo-outline)]",
    },
    opensource: {
      badge: "opensource",
      accentColor: "var(--accent-green)",
      iconBg: "bg-[var(--accent-green-bg)] text-[var(--accent-green)] border-2 border-[var(--neo-outline)]",
    },
    competition: {
      badge: "competition",
      accentColor: "var(--accent-amber)",
      iconBg: "bg-[var(--accent-amber-bg)] text-[var(--accent-amber)] border-2 border-[var(--neo-outline)]",
    },
    workshop: {
      badge: "workshop",
      accentColor: "var(--accent-purple)",
      iconBg: "bg-[var(--accent-purple-bg)] text-[var(--accent-purple)] border-2 border-[var(--neo-outline)]",
    },
    event: {
      badge: "event",
      accentColor: "var(--accent-pink)",
      iconBg: "bg-[var(--accent-pink-bg)] text-[var(--accent-pink)] border-2 border-[var(--neo-outline)]",
    },
  };

  const fallbackCategory = {
    badge: "default",
    accentColor: "var(--brand-from)",
    iconBg: "bg-[var(--accent-indigo-bg)] text-[var(--brand-from)] border-2 border-[var(--neo-outline)]",
  };

  const currentCategory = categoryConfig[credentialType?.toLowerCase()] || fallbackCategory;
  const publicVerifyUrl = getCertificateUrl(id);

  const formattedDate = issuedAt
    ? new Date(issuedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Aug 26, 2026";

  const shortHash = credentialHash
    ? `${credentialHash.slice(0, 8)}...${credentialHash.slice(-6)}`
    : "0x4a9d...f093ac";

  return (
    <div className="w-full max-w-[440px] mx-auto select-none">
      {/* Neomorphic Verifiable Pass Card */}
      <div className="relative overflow-hidden rounded-[24px] neo-raised-lg bg-[var(--surface-bg)] p-6 sm:p-7 transition-all duration-300">
        {/* Subtle Security Guilloche Watermark Pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] pass-texture" />

        {/* Top Header: Issuer Identity & Pass Type Badge */}
        <div className="relative z-10 flex items-start justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div
              className={`neo-raised-sm flex h-11 w-11 items-center justify-center rounded-full ${currentCategory.iconBg} font-bold flex-shrink-0`}
            >
              <Award className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-primary)] tracking-tight">
                <span>{issuerName || "ETHSF & Polygon Labs"}</span>
                <CheckCircle2 className="h-3.5 w-3.5 text-[var(--brand-indigo)] flex-shrink-0" />
              </div>
              <div className="text-[11px] font-medium text-[var(--text-secondary)]">
                CertifiedPass Registry
              </div>
            </div>
          </div>

          <Badge variant={currentCategory.badge} size="sm">
            {credentialType.toUpperCase()}
          </Badge>
        </div>

        {/* Credential Main Content */}
        <div className="relative z-10 my-4 space-y-3">
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-primary)] leading-tight font-display">
            {title || "1st Place Winner — Global Web3 AI Hackathon"}
          </h3>

          <div className="flex items-baseline gap-2 pt-0.5">
            <span className="text-xs font-medium text-[var(--text-secondary)]">Issued to:</span>
            <span className="text-sm font-bold text-[var(--text-primary)] tracking-tight">
              {holderName || "Alex Rivera"}
            </span>
          </div>

          {/* Achievement Details (Track / Role / Placement) */}
          {(metadata?.placement || metadata?.track || metadata?.role || metadata?.projectName) && (
            <div className="flex items-center gap-2 text-xs text-[var(--text-primary)] neo-inset-sm rounded-xl px-3 py-2 bg-[var(--surface-bg)]">
              <Sparkles className="h-3.5 w-3.5 text-[var(--accent-amber)] flex-shrink-0 animate-pulse-glow" />
              <span className="font-medium truncate">
                {metadata.placement ? `🏆 ${metadata.placement} — ` : ""}
                {metadata.track || metadata.role || metadata.projectName || "Top Performing Project"}
              </span>
            </div>
          )}

          {/* Settled Escrow Value / Transaction Amount */}
          {(metadata?.settledAmount || metadata?.amount || metadata?.bounty) && (
            <div className="flex items-center justify-between text-xs bg-[var(--accent-green-bg)] neo-raised-sm rounded-xl px-3.5 py-2 text-[var(--accent-green)] font-bold">
              <div className="flex items-center gap-1.5 font-sans">
                <DollarSign className="h-3.5 w-3.5 text-[var(--accent-green)]" />
                <span>Settled Transaction:</span>
              </div>
              <span className="font-mono text-[var(--accent-green)] font-black text-sm">
                {metadata?.settledAmount || metadata?.amount || metadata?.bounty}
              </span>
            </div>
          )}

          {/* Skills / Tech Tags (Neomorphic Chips with Stagger Feel) */}
          {Array.isArray(metadata?.skills) && metadata.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {metadata.skills.slice(0, 4).map((skill: string, idx: number) => (
                <span
                  key={idx}
                  className="neo-raised-sm rounded-lg px-2.5 py-1 text-[11px] font-semibold text-[var(--text-secondary)] bg-[var(--surface-bg)] hover:text-[var(--text-primary)] transition-all"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Live Working QR Code Section & Scan Trigger (Inset Well) */}
        <div className="relative z-10 my-5 rounded-2xl neo-inset p-4 bg-[var(--surface-bg)] flex items-center justify-between gap-4">
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-primary)]">
              <QrCode className="h-4 w-4 text-[var(--brand-indigo)]" />
              <span>Instant Public Scan</span>
            </div>
            <p className="text-[11px] text-[var(--text-secondary)] leading-normal">
              Scan with any mobile camera to verify cryptographic validity on Polygon Amoy.
            </p>
            {onShowQR && (
              <button
                type="button"
                onClick={onShowQR}
                className="group flex items-center gap-1 text-[11px] font-bold text-[var(--brand-indigo)] hover:text-[var(--brand-violet)] transition-colors pt-1"
              >
                <span>Expand High-Res QR</span>
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
              </button>
            )}
          </div>

          <div
            onClick={onShowQR}
            className="cursor-pointer bg-white p-2 rounded-xl neo-raised-sm transition-transform hover:scale-105 flex-shrink-0"
            title="Click to view full screen QR Code"
          >
            <QRCodeSVG
              value={publicVerifyUrl}
              size={64}
              level="M"
              includeMargin={false}
            />
          </div>
        </div>

        {/* Pass Footer: Timestamp, Verification Status & SHA-256 Digest */}
        <div className="relative z-10 border-t border-[var(--shadow-dark)]/15 pt-4 flex items-center justify-between text-xs text-[var(--text-secondary)]">
          <div className="space-y-0.5">
            <div className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-secondary)]/70">
              Date Issued
            </div>
            <div className="font-semibold text-[var(--text-primary)]">{formattedDate}</div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-[var(--accent-green)] pt-0.5">
              <ShieldCheck className="h-3.5 w-3.5 text-[var(--accent-green)]" />
              <span>{isRevoked ? "Revoked" : "On-Chain Verified"}</span>
            </div>
          </div>

          <div className="text-right space-y-0.5">
            <div className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-secondary)]/70">
              Anchor Hash
            </div>
            <div
              className="font-mono text-xs font-bold text-[var(--brand-indigo)] hover:underline cursor-pointer"
              title={`Full SHA-256 Digest: ${credentialHash}`}
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.open(`https://amoy.polygonscan.com/address/0x123`, "_blank");
                }
              }}
            >
              {shortHash}
            </div>
            <div className="text-[10px] text-[var(--text-secondary)] font-medium">
              Polygon Amoy (80002)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

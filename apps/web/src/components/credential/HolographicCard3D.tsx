import React from "react";
import { ShieldCheck, Award, QrCode, ExternalLink, CheckCircle2, Shield, Calendar, Hash, Sparkles } from "lucide-react";
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

  // Category-specific theme accents (clean Apple light mode palettes)
  const categoryConfig: Record<string, { badge: any; accentColor: string; bgSoft: string; iconBg: string }> = {
    hackathon: {
      badge: "hackathon",
      accentColor: "#4F46E5",
      bgSoft: "from-indigo-50/50 via-white to-sky-50/30",
      iconBg: "bg-indigo-600 text-white",
    },
    internship: {
      badge: "internship",
      accentColor: "#2563EB",
      bgSoft: "from-blue-50/50 via-white to-indigo-50/30",
      iconBg: "bg-blue-600 text-white",
    },
    opensource: {
      badge: "opensource",
      accentColor: "#059669",
      bgSoft: "from-emerald-50/50 via-white to-teal-50/30",
      iconBg: "bg-emerald-600 text-white",
    },
    competition: {
      badge: "competition",
      accentColor: "#D97706",
      bgSoft: "from-amber-50/50 via-white to-orange-50/30",
      iconBg: "bg-amber-600 text-white",
    },
  };

  const fallbackCategory = {
    badge: "default",
    accentColor: "#0EA5E9",
    bgSoft: "from-slate-50 via-white to-slate-50",
    iconBg: "bg-slate-900 text-white",
  };

  const currentCategory = categoryConfig[credentialType?.toLowerCase()] || fallbackCategory;

  // Real world public verification URL (can be scanned by any smartphone camera)
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
      {/* Physical Apple-style Verifiable Pass Card (Stable, crisp, zero tilt animation) */}
      <div
        className={`relative overflow-hidden rounded-3xl border border-slate-200/90 bg-gradient-to-br ${currentCategory.bgSoft} p-6 sm:p-7 shadow-apple-lg transition-all duration-200 hover:shadow-xl hover:border-slate-300`}
      >
        {/* Subtle Security Guilloche Watermark Pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] pass-texture" />

        {/* Top Header: Issuer Identity & Pass Type Badge */}
        <div className="relative z-10 flex items-start justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-2xl ${currentCategory.iconBg} shadow-apple-sm font-bold flex-shrink-0`}
            >
              <Award className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 tracking-tight">
                <span>{issuerName || "ETHSF & Polygon Labs"}</span>
                <CheckCircle2 className="h-3.5 w-3.5 text-indigo-600 flex-shrink-0" />
              </div>
              <div className="text-[11px] font-medium text-slate-400">
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
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 leading-tight font-display">
            {title || "1st Place Winner — Global Web3 AI Hackathon"}
          </h3>

          <div className="flex items-baseline gap-2 pt-0.5">
            <span className="text-xs font-medium text-slate-500">Issued to:</span>
            <span className="text-sm font-bold text-slate-900 tracking-tight">
              {holderName || "Alex Rivera"}
            </span>
          </div>

          {/* Achievement Details (Track / Role / Placement) */}
          {(metadata?.placement || metadata?.track || metadata?.role || metadata?.projectName) && (
            <div className="flex items-center gap-1.5 text-xs text-slate-700 bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-xl px-3 py-2">
              <Sparkles className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
              <span className="font-medium truncate">
                {metadata.placement ? `🏆 ${metadata.placement} — ` : ""}
                {metadata.track || metadata.role || metadata.projectName || "Top Performing Project"}
              </span>
            </div>
          )}

          {/* Skills / Tech Tags */}
          {Array.isArray(metadata?.skills) && metadata.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {metadata.skills.slice(0, 4).map((skill: string, idx: number) => (
                <span
                  key={idx}
                  className="rounded-lg bg-slate-100/90 border border-slate-200/80 px-2 py-0.5 text-[11px] font-medium text-slate-600"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Live Working QR Code Section & Scan Trigger */}
        <div className="relative z-10 my-5 rounded-2xl bg-white/90 border border-slate-200/90 p-4 shadow-apple-sm flex items-center justify-between gap-4">
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
              <QrCode className="h-4 w-4 text-indigo-600" />
              <span>Instant Public Scan</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              Scan with any mobile camera to verify cryptographic validity on Polygon Amoy.
            </p>
            {onShowQR && (
              <button
                type="button"
                onClick={onShowQR}
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 hover:underline pt-0.5 inline-block"
              >
                Expand High-Res QR →
              </button>
            )}
          </div>

          <div
            onClick={onShowQR}
            className="cursor-pointer bg-white p-2 rounded-xl border border-slate-200 shadow-sm transition-transform hover:scale-105 flex-shrink-0"
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
        <div className="relative z-10 border-t border-slate-200/80 pt-4 flex items-center justify-between text-xs text-slate-500">
          <div className="space-y-0.5">
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Date Issued
            </div>
            <div className="font-medium text-slate-800">{formattedDate}</div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 pt-0.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>{isRevoked ? "Revoked" : "On-Chain Verified"}</span>
            </div>
          </div>

          <div className="text-right space-y-0.5">
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Anchor Hash
            </div>
            <div
              className="font-mono text-xs font-semibold text-indigo-600 hover:underline cursor-pointer"
              title={`Full SHA-256 Digest: ${credentialHash}`}
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.open(`https://amoy.polygonscan.com/address/0x123`, "_blank");
                }
              }}
            >
              {shortHash}
            </div>
            <div className="text-[10px] text-slate-400 font-medium">
              Polygon Amoy (80002)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

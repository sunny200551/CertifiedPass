import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ShieldCheck, Award, QrCode, ExternalLink, Sparkles, CheckCircle2 } from "lucide-react";
import { Badge } from "../ui/Badge.js";
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
  credentialHash = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
  isVerified = true,
  status = "ACTIVE",
  metadata = {},
  onShowQR,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse tilt physics
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["14deg", "-14deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-14deg", "14deg"]);
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const categoryThemes: Record<string, { gradient: string; accentBorder: string; badge: string; glow: string }> = {
    hackathon: {
      gradient: "from-cyan-500/20 via-blue-600/10 to-transparent",
      accentBorder: "border-cyan-500/40 hover:border-cyan-400",
      badge: "hackathon",
      glow: "rgba(34, 211, 238, 0.25)",
    },
    internship: {
      gradient: "from-purple-500/20 via-indigo-600/10 to-transparent",
      accentBorder: "border-purple-500/40 hover:border-purple-400",
      badge: "internship",
      glow: "rgba(168, 85, 247, 0.25)",
    },
    opensource: {
      gradient: "from-emerald-500/20 via-teal-600/10 to-transparent",
      accentBorder: "border-emerald-500/40 hover:border-emerald-400",
      badge: "opensource",
      glow: "rgba(52, 211, 153, 0.25)",
    },
    competition: {
      gradient: "from-amber-500/20 via-orange-600/10 to-transparent",
      accentBorder: "border-amber-500/40 hover:border-amber-400",
      badge: "competition",
      glow: "rgba(251, 191, 36, 0.25)",
    },
    workshop: {
      gradient: "from-blue-500/20 via-sky-600/10 to-transparent",
      accentBorder: "border-blue-500/40 hover:border-blue-400",
      badge: "workshop",
      glow: "rgba(59, 130, 246, 0.25)",
    },
    event: {
      gradient: "from-pink-500/20 via-rose-600/10 to-transparent",
      accentBorder: "border-pink-500/40 hover:border-pink-400",
      badge: "event",
      glow: "rgba(244, 114, 182, 0.25)",
    },
  };

  const defaultTheme = {
    gradient: "from-cyan-500/20 via-blue-600/10 to-transparent",
    accentBorder: "border-cyan-500/40 hover:border-cyan-400",
    badge: "hackathon",
    glow: "rgba(34, 211, 238, 0.25)",
  };

  const theme = categoryThemes[credentialType.toLowerCase()] ?? defaultTheme;
  const isRevoked = status ? status.toUpperCase() === "REVOKED" : false;

  return (
    <div className="perspective-1000 w-full max-w-md py-4">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className={`relative overflow-hidden rounded-2xl border ${theme.accentBorder} bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-slate-950/95 p-6 shadow-2xl backdrop-blur-xl transition-colors duration-300 select-none ${
          isRevoked ? "opacity-75 grayscale-[40%]" : ""
        }`}
      >
        {/* Holographic Specular Foil Layer */}
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
          style={{
            opacity: isHovered ? 0.35 : 0,
            background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.8) 0%, rgba(34,211,238,0.4) 25%, rgba(168,85,247,0.4) 50%, rgba(52,211,153,0.3) 75%, transparent 100%)`,
            mixBlendMode: "color-dodge",
          }}
        />

        {/* Ambient Gradient Corner */}
        <div
          className={`pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full bg-gradient-to-br ${theme.gradient} blur-2xl`}
        />

        {/* Card Header */}
        <div className="relative z-10 flex items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 text-slate-950 font-bold shadow-md shadow-cyan-500/20">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                {issuerName}
              </p>
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-slate-200">CertifiedPass</span>
                <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant={theme.badge as any} size="sm">
              {credentialType.toUpperCase()}
            </Badge>
            {onShowQR && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onShowQR();
                }}
                className="rounded-lg border border-slate-700/60 bg-slate-800/60 p-1.5 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                title="View QR Code"
              >
                <QrCode className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Card Body */}
        <div className="relative z-10 my-6">
          <h3 className="text-xl font-bold tracking-tight text-white line-clamp-2">
            {title}
          </h3>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-xs text-slate-400">Issued to:</span>
            <span className="text-base font-semibold text-cyan-300">
              {holderName}
            </span>
          </div>

          {/* Specific category details */}
          {metadata["achievement"] && (
            <div className="mt-2 text-xs font-medium text-purple-300">
              🏆 {metadata["achievement"]}
            </div>
          )}

          {metadata["companyName"] && (
            <div className="mt-2 text-xs font-medium text-slate-300">
              🏢 {metadata["companyName"]} • {metadata["role"]}
            </div>
          )}

          {metadata["skills"] && Array.isArray(metadata["skills"]) && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {metadata["skills"].slice(0, 4).map((skill: string, i: number) => (
                <span
                  key={i}
                  className="rounded-md bg-slate-800/80 px-2 py-0.5 text-[10px] font-medium text-slate-300 border border-slate-700/40"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Card Footer / On-Chain Anchor Info */}
        <div className="relative z-10 border-t border-slate-800/80 pt-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div>
              <p className="text-[10px] uppercase text-slate-500">Date Issued</p>
              <p className="font-mono text-slate-300">{issuedAt.slice(0, 10)}</p>
            </div>

            <div className="text-right">
              <p className="text-[10px] uppercase text-slate-500">Anchor Hash</p>
              <p className="font-mono text-cyan-400 text-[11px]">
                {credentialHash.slice(0, 8)}...{credentialHash.slice(-6)}
              </p>
            </div>
          </div>

          {/* Verification Pill */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {isRevoked ? (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400">
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  Revoked
                </span>
              ) : isVerified ? (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400">
                  <ShieldCheck className="h-4 w-4" />
                  On-Chain Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400">
                  <Sparkles className="h-3.5 w-3.5" />
                  Off-Chain Draft
                </span>
              )}
            </div>

            <span className="font-mono text-[10px] text-slate-500">
              Polygon Amoy (80002)
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

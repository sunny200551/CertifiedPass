import React from "react";
import { Link } from "react-router-dom";
import {
  ExternalLink,
  ShieldCheck,
  LayoutGrid,
  Landmark,
  User,
  Sparkles,
  FileText,
  Box,
  EyeOff,
  Hammer,
  Radio,
  Shield,
  Github,
  Twitter,
  Linkedin,
  MessageSquare,
  Cpu,
  Lock,
  FileCheck2,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import { logoUrl } from "../../lib/urls.js";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full relative bg-[var(--surface-bg)] text-[var(--text-primary)] transition-colors duration-300 mt-16">
      {/* Top Colorful Accent Line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-[var(--brand-indigo)] via-[var(--brand-violet)] to-[var(--brand-cyan)] opacity-80" />

      {/* Top Banner / Protocol Live Status Strip (Compact Raised Pills) */}
      <div className="py-3 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Live Network Status Pill */}
          <div className="flex items-center gap-2 rounded-full neo-raised-sm px-3.5 py-1.5 bg-[var(--surface-bg)]">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent-green)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent-green)]"></span>
            </span>
            <span className="text-[11px] font-bold text-[var(--text-primary)] flex items-center gap-1.5">
              <span>Network Status:</span>
              <span className="text-[var(--accent-green)] font-extrabold neo-inset-sm px-2 py-0.5 rounded-full text-[10px] bg-[var(--accent-green-bg)]">
                Polygon Amoy & Mainnet (Operational)
              </span>
            </span>
          </div>

          {/* Security & Feature Badges */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] font-semibold text-[var(--text-secondary)]">
            <div className="flex items-center gap-1.5 rounded-full neo-raised-sm px-3 py-1 bg-[var(--surface-bg)] text-[var(--text-primary)]">
              <Lock className="h-3 w-3 text-[var(--accent-indigo)] shrink-0" />
              <span>Zero-Knowledge & Zero-PII</span>
            </div>

            <div className="flex items-center gap-1.5 rounded-full neo-raised-sm px-3 py-1 bg-[var(--surface-bg)] text-[var(--text-primary)]">
              <Cpu className="h-3 w-3 text-[var(--accent-purple)] shrink-0" />
              <span>Gemini 1.5 Flash Oracle</span>
            </div>

            <div className="flex items-center gap-1.5 rounded-full neo-raised-sm px-3 py-1 bg-[var(--surface-bg)] text-[var(--text-primary)]">
              <Layers className="h-3 w-3 text-[var(--accent-blue)] shrink-0" />
              <span>EIP-712 & Soulbound Attestations</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Navigation: Brand 24% Left + 3 Columns Tighter Row on Right */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-8 items-start">
          {/* Brand Block: Anchored to Far Left (~24% width on lg) */}
          <div className="lg:col-span-3 space-y-3.5 lg:pr-4">
            <Link to="/" className="flex items-center gap-2.5 group w-fit">
              <div className="neo-raised-sm rounded-full p-1.5 bg-[var(--surface-bg)] transition-transform group-hover:scale-105 shrink-0">
                <img
                  src={logoUrl}
                  alt="CertifiedPass Logo"
                  className="h-7 w-7 object-contain rounded-full"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tight text-[var(--text-primary)] font-display flex items-center gap-2">
                  CertifiedPass
                  <span className="rounded-full neo-inset-sm bg-[var(--accent-indigo-bg)] text-[var(--brand-from)] border-2 border-[var(--neo-outline)] px-2.5 py-0.5 text-[10px] font-black leading-none">
                    V1.0
                  </span>
                </span>
              </div>
            </Link>

            <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed">
              AI-powered verifiable credential infrastructure for hackathons, open-source milestones, professional escrow settlements, and career achievements. Anchored cryptographically on Polygon EVM.
            </p>

            <div className="pt-1">
              <div className="inline-flex items-center gap-2 rounded-full neo-inset-sm px-3 py-1.5 text-[11px] font-mono font-bold text-[var(--accent-green)] bg-[var(--accent-green-bg)]">
                <span className="h-2 w-2 rounded-full bg-[var(--accent-green)] animate-pulse-glow" />
                <span>Polygon Amoy (Chain 80002) & PoS (137)</span>
              </div>
            </div>
          </div>

          {/* 3 Right Columns Container (Tighter Horizontal Grid: ~76% width) */}
          <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-3 gap-5 lg:gap-6 pt-1">
            {/* Column 1: Verification Hub */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 rounded-full neo-raised-sm px-3 py-1 bg-[var(--surface-bg)] text-[var(--accent-indigo)]">
                <ShieldCheck className="h-3.5 w-3.5" />
                <h4 className="text-[11px] font-bold uppercase tracking-wider font-display">
                  Verification Hub
                </h4>
              </div>

              <ul className="space-y-2">
                <li>
                  <Link
                    to="/verify"
                    className="flex items-start gap-2.5 p-2 rounded-xl hover:neo-raised-sm transition-all group"
                  >
                    <div className="neo-raised-sm flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent-blue-bg)] text-[var(--accent-blue)] group-hover:scale-105 transition-all shrink-0 mt-0.5">
                      <ShieldCheck className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <span className="block text-[13px] font-bold text-[var(--text-primary)] group-hover:text-[var(--brand-indigo)] transition-colors leading-tight">
                        Universal Verifier
                      </span>
                      <span className="text-[11px] text-[var(--text-secondary)] font-medium leading-tight block mt-0.5">
                        Verify hash, multi-sig & issuer signatures
                      </span>
                    </div>
                  </Link>
                </li>

                <li>
                  <Link
                    to="/verify?partner=polylance"
                    className="flex items-start gap-2.5 p-2 rounded-xl hover:neo-raised-sm transition-all group"
                  >
                    <div className="neo-raised-sm flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent-purple-bg)] text-[var(--accent-purple)] group-hover:scale-105 transition-all shrink-0 mt-0.5">
                      <FileCheck2 className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <span className="flex items-center gap-1.5 text-[13px] font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-purple)] transition-colors leading-tight">
                        PolyLance Escrow Audit
                        <span className="rounded-full neo-raised-sm bg-[var(--accent-purple)] text-white px-1.5 py-0.5 text-[8.5px] font-black leading-none">
                          Collab
                        </span>
                      </span>
                      <span className="text-[11px] text-[var(--text-secondary)] font-medium leading-tight block mt-0.5">
                        Sovereign SBT records & settlement values
                      </span>
                    </div>
                  </Link>
                </li>

                <li>
                  <a
                    href="https://amoy.polygonscan.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-start gap-2.5 p-2 rounded-xl hover:neo-raised-sm transition-all group"
                  >
                    <div className="neo-raised-sm flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent-cyan-bg)] text-[var(--accent-cyan)] group-hover:scale-105 transition-all shrink-0 mt-0.5">
                      <Box className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <span className="flex items-center gap-1 text-[13px] font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-cyan)] transition-colors leading-tight">
                        PolygonScan Explorer <ArrowUpRight className="h-3 w-3" />
                      </span>
                      <span className="text-[11px] text-[var(--text-secondary)] font-medium leading-tight block mt-0.5">
                        Inspect on-chain smart contract transactions
                      </span>
                    </div>
                  </a>
                </li>

                <li>
                  <Link
                    to="/u/alex.rivera"
                    className="flex items-start gap-2.5 p-2 rounded-xl hover:neo-raised-sm transition-all group"
                  >
                    <div className="neo-raised-sm flex h-7 w-7 items-center justify-center rounded-full bg-[var(--surface-bg)] text-[var(--text-primary)] group-hover:scale-105 transition-all shrink-0 mt-0.5">
                      <FileText className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <span className="block text-[13px] font-bold text-[var(--text-primary)] group-hover:text-[var(--brand-indigo)] transition-colors leading-tight">
                        Sample Proof Profile
                      </span>
                      <span className="text-[11px] text-[var(--text-secondary)] font-medium leading-tight block mt-0.5">
                        View demo 3D credential & public audit badge
                      </span>
                    </div>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: Portals */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 rounded-full neo-raised-sm px-3 py-1 bg-[var(--surface-bg)] text-[var(--accent-purple)]">
                <LayoutGrid className="h-3.5 w-3.5" />
                <h4 className="text-[11px] font-bold uppercase tracking-wider font-display">
                  Portals
                </h4>
              </div>

              <ul className="space-y-2">
                <li>
                  <Link
                    to="/dashboard"
                    className="flex items-start gap-2.5 p-2 rounded-xl hover:neo-raised-sm transition-all group"
                  >
                    <div className="neo-raised-sm flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent-purple-bg)] text-[var(--accent-purple)] group-hover:scale-105 transition-all shrink-0 mt-0.5">
                      <User className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <span className="block text-[13px] font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-purple)] transition-colors leading-tight">
                        Holder Dashboard
                      </span>
                      <span className="text-[11px] text-[var(--text-secondary)] font-medium leading-tight block mt-0.5">
                        Manage badges & QR codes
                      </span>
                    </div>
                  </Link>
                </li>

                <li>
                  <Link
                    to="/issuer"
                    className="flex items-start gap-2.5 p-2 rounded-xl hover:neo-raised-sm transition-all group"
                  >
                    <div className="neo-raised-sm flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent-pink-bg)] text-[var(--accent-pink)] group-hover:scale-105 transition-all shrink-0 mt-0.5">
                      <Landmark className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <span className="block text-[13px] font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-pink)] transition-colors leading-tight">
                        Issuer Portal
                      </span>
                      <span className="text-[11px] text-[var(--text-secondary)] font-medium leading-tight block mt-0.5">
                        Sign & anchor credentials
                      </span>
                    </div>
                  </Link>
                </li>

                <li>
                  <Link
                    to="/issuer/issue"
                    className="flex items-start gap-2.5 p-2 rounded-xl hover:neo-raised-sm transition-all group"
                  >
                    <div className="neo-raised-sm flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent-pink-bg)] text-[var(--accent-pink)] group-hover:scale-105 transition-all shrink-0 mt-0.5">
                      <Sparkles className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <span className="block text-[13px] font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-pink)] transition-colors leading-tight">
                        AI Issuance
                      </span>
                      <span className="text-[11px] text-[var(--text-secondary)] font-medium leading-tight block mt-0.5">
                        Gemini document extractor
                      </span>
                    </div>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Cryptographic Stack */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 rounded-full neo-raised-sm px-3 py-1 bg-[var(--surface-bg)] text-[var(--accent-green)]">
                <Cpu className="h-3.5 w-3.5" />
                <h4 className="text-[11px] font-bold uppercase tracking-wider font-display">
                  Cryptographic Stack
                </h4>
              </div>

              <p className="text-[11.5px] text-[var(--text-secondary)] font-medium leading-tight">
                Canonical JSON SHA-256 hashing. Zero private data on chain. Cryptographic multi-sig verifiable proof.
              </p>

              {/* Compact 2x3 Stack Chips Grid */}
              <div className="grid grid-cols-2 gap-2 pt-0.5 select-none">
                <div className="neo-raised-sm flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-[11px] font-bold text-[var(--text-primary)] hover:text-[var(--accent-green)] transition-all hover:scale-[1.02] bg-[var(--surface-bg)]">
                  <ShieldCheck className="h-3.5 w-3.5 text-[var(--accent-green)] shrink-0" />
                  <span>SHA-256</span>
                </div>

                <div className="neo-raised-sm flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-[11px] font-bold text-[var(--text-primary)] hover:text-[var(--accent-indigo)] transition-all hover:scale-[1.02] bg-[var(--surface-bg)]">
                  <EyeOff className="h-3.5 w-3.5 text-[var(--accent-indigo)] shrink-0" />
                  <span>Zero PII</span>
                </div>

                <div className="neo-raised-sm flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-[11px] font-bold text-[var(--text-primary)] hover:text-[var(--accent-amber)] transition-all hover:scale-[1.02] bg-[var(--surface-bg)]">
                  <Hammer className="h-3.5 w-3.5 text-[var(--accent-amber)] shrink-0" />
                  <span>Foundry</span>
                </div>

                <div className="neo-raised-sm flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-[11px] font-bold text-[var(--text-primary)] hover:text-[var(--accent-blue)] transition-all hover:scale-[1.02] bg-[var(--surface-bg)]">
                  <span className="font-mono text-[10px] font-black text-[var(--accent-blue)] leading-none">OZ</span>
                  <span>OpenZeppelin</span>
                </div>

                <div className="neo-raised-sm flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-[11px] font-bold text-[var(--text-primary)] hover:text-[var(--accent-purple)] transition-all hover:scale-[1.02] bg-[var(--surface-bg)]">
                  <Radio className="h-3.5 w-3.5 text-[var(--accent-purple)] shrink-0" />
                  <span>RainbowKit</span>
                </div>

                <div className="neo-raised-sm flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-[11px] font-bold text-[var(--text-primary)] hover:text-[var(--accent-pink)] transition-all hover:scale-[1.02] bg-[var(--surface-bg)]">
                  <Sparkles className="h-3.5 w-3.5 text-[var(--accent-pink)] shrink-0" />
                  <span>Gemini 1.5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal, Socials & Copyright Bar */}
      <div className="py-4 px-4 sm:px-6 lg:px-8 border-t border-[var(--shadow-dark)]/10">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          {/* Copyright & Shield */}
          <div className="flex items-center gap-2.5">
            <div className="neo-raised-sm flex h-7 w-7 items-center justify-center rounded-full bg-[var(--surface-bg)] text-[var(--brand-indigo)]">
              <Shield className="h-3.5 w-3.5" />
            </div>
            <div className="text-[11px] text-[var(--text-secondary)] font-medium">
              <span className="font-bold text-[var(--text-primary)]">© 2026 CertifiedPass.</span> All rights reserved. Powered by Polygon EVM.
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-2.5">
            <a
              href="https://github.com/sunny200551/CertifiedPass"
              target="_blank"
              rel="noreferrer"
              className="neo-raised-sm flex h-7 w-7 items-center justify-center rounded-full bg-[var(--surface-bg)] text-[var(--text-primary)] hover:text-[var(--brand-indigo)] transition-all hover:scale-105 active:neo-inset-sm"
              title="GitHub"
            >
              <Github className="h-3.5 w-3.5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="neo-raised-sm flex h-7 w-7 items-center justify-center rounded-full bg-[var(--surface-bg)] text-[var(--text-primary)] hover:text-[var(--accent-blue)] transition-all hover:scale-105 active:neo-inset-sm"
              title="Twitter / X"
            >
              <Twitter className="h-3.5 w-3.5" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="neo-raised-sm flex h-7 w-7 items-center justify-center rounded-full bg-[var(--surface-bg)] text-[var(--text-primary)] hover:text-[var(--accent-blue)] transition-all hover:scale-105 active:neo-inset-sm"
              title="LinkedIn"
            >
              <Linkedin className="h-3.5 w-3.5" />
            </a>
            <a
              href="https://discord.com"
              target="_blank"
              rel="noreferrer"
              className="neo-raised-sm flex h-7 w-7 items-center justify-center rounded-full bg-[var(--surface-bg)] text-[var(--text-primary)] hover:text-[var(--accent-purple)] transition-all hover:scale-105 active:neo-inset-sm"
              title="Discord"
            >
              <MessageSquare className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Legal / Policy Links */}
          <div className="flex items-center gap-5 text-[11px] font-bold text-[var(--text-secondary)]">
            <Link to="/verify" className="hover:text-[var(--brand-indigo)] transition-colors">
              Privacy Policy
            </Link>
            <Link to="/verify" className="hover:text-[var(--brand-indigo)] transition-colors">
              Terms of Service
            </Link>
            <a
              href="https://amoy.polygonscan.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[var(--brand-indigo)] transition-colors"
            >
              Docs
            </a>
            <Link to="/verify" className="hover:text-[var(--brand-indigo)] transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

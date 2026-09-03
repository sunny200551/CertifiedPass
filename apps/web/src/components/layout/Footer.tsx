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
  CheckCircle2,
  Zap,
} from "lucide-react";
import { logoUrl } from "../../lib/urls.js";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full relative border-t border-slate-200 bg-white text-black transition-colors selection:bg-indigo-500/20">
      {/* Top Colorful Accent Line */}
      <div className="h-1 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400" />

      {/* Top Banner / Core Protocol Highlights (High Contrast & Redesigned) */}
      <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 via-indigo-50/30 to-purple-50/30 py-4 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-4">
          {/* Live Network Status Pill */}
          <div className="flex items-center gap-2.5 rounded-full bg-white border border-emerald-300 px-3.5 py-1.5 shadow-sm">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
            </span>
            <span className="text-xs font-bold text-black flex items-center gap-1.5">
              <span>Network Status:</span>
              <span className="text-emerald-700 font-extrabold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Polygon Amoy & Mainnet (Operational)
              </span>
            </span>
          </div>

          {/* Security & Feature Badges */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs font-bold text-black">
            <div className="flex items-center gap-1.5 rounded-full bg-white border border-indigo-200 px-3 py-1 shadow-sm text-black hover:border-indigo-400 transition-colors">
              <Lock className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
              <span className="text-black">Zero-Knowledge & Zero-PII</span>
            </div>

            <div className="flex items-center gap-1.5 rounded-full bg-white border border-purple-200 px-3 py-1 shadow-sm text-black hover:border-purple-400 transition-colors">
              <Cpu className="h-3.5 w-3.5 text-purple-600 shrink-0" />
              <span className="text-black">Gemini 1.5 Flash Oracle</span>
            </div>

            <div className="flex items-center gap-1.5 rounded-full bg-white border border-blue-200 px-3 py-1 shadow-sm text-black hover:border-blue-400 transition-colors">
              <Layers className="h-3.5 w-3.5 text-blue-600 shrink-0" />
              <span className="text-black">EIP-712 & Soulbound Attestations</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Navigation Grid */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12">
          {/* Column 1: Brand & Identity (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <Link to="/" className="flex items-center gap-3 group w-fit">
              <div className="relative p-1 rounded-xl bg-white border border-slate-200 shadow-sm group-hover:border-indigo-400 transition-all">
                <img
                  src={logoUrl}
                  alt="CertifiedPass Logo"
                  className="h-9 w-auto object-contain transition-transform group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent font-display flex items-center gap-2">
                  CertifiedPass
                  <span className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-2 py-0.5 text-[10px] font-black text-white shadow-sm">
                    V1.0
                  </span>
                </span>
              </div>
            </Link>

            <p className="text-sm text-black font-medium leading-relaxed pr-4">
              AI-powered verifiable credential infrastructure for hackathons, open-source milestones, professional escrow settlements, and career achievements. Anchored cryptographically on Polygon EVM.
            </p>

            <div className="pt-2">
              <div className="inline-flex items-center gap-2.5 rounded-xl border border-emerald-300 bg-emerald-50/80 px-4 py-2.5 text-xs font-mono font-extrabold text-black shadow-sm">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-600 ring-4 ring-emerald-200 animate-pulse" />
                <span className="text-emerald-950 font-bold">Polygon Amoy (Chain 80002) & PoS (137)</span>
              </div>
            </div>
          </div>

          {/* Column 2: VERIFICATION SERVICES (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-lg bg-indigo-50 border border-indigo-200 px-3 py-1.5 text-indigo-700">
              <ShieldCheck className="h-4 w-4 text-indigo-600" />
              <h4 className="text-xs font-black uppercase tracking-wider font-display text-indigo-900">
                Verification Hub
              </h4>
            </div>

            <ul className="space-y-2.5">
              <li>
                <Link
                  to="/verify"
                  className="flex items-start gap-3 p-2 rounded-xl hover:bg-indigo-50/60 border border-transparent hover:border-indigo-100 transition-all group"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 border border-indigo-200 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm shrink-0 mt-0.5">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-black group-hover:text-indigo-600 transition-colors">
                      Universal Verifier
                    </span>
                    <span className="text-xs text-black font-medium leading-tight block mt-0.5">
                      Verify hash, multi-sig & issuer signatures
                    </span>
                  </div>
                </Link>
              </li>

              <li>
                <Link
                  to="/verify?partner=polylance"
                  className="flex items-start gap-3 p-2 rounded-xl hover:bg-violet-50/60 border border-transparent hover:border-violet-100 transition-all group"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-violet-700 border border-violet-200 group-hover:bg-violet-600 group-hover:text-white transition-all shadow-sm shrink-0 mt-0.5">
                    <FileCheck2 className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="flex items-center gap-1.5 text-sm font-bold text-black group-hover:text-violet-600 transition-colors">
                      PolyLance Escrow Audit
                      <span className="rounded-full bg-violet-600 text-white px-2 py-0.2 text-[9px] font-black">
                        Collab
                      </span>
                    </span>
                    <span className="text-xs text-black font-medium leading-tight block mt-0.5">
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
                  className="flex items-start gap-3 p-2 rounded-xl hover:bg-blue-50/60 border border-transparent hover:border-blue-100 transition-all group"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-700 border border-blue-200 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm shrink-0 mt-0.5">
                    <Box className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="flex items-center gap-1 text-sm font-bold text-black group-hover:text-blue-600 transition-colors">
                      PolygonScan Explorer <ArrowUpRight className="h-3.5 w-3.5 text-blue-600" />
                    </span>
                    <span className="text-xs text-black font-medium leading-tight block mt-0.5">
                      Inspect on-chain smart contract transactions
                    </span>
                  </div>
                </a>
              </li>

              <li>
                <Link
                  to="/u/alex.rivera"
                  className="flex items-start gap-3 p-2 rounded-xl hover:bg-slate-100/70 border border-transparent hover:border-slate-200 transition-all group"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-200 text-black border border-slate-300 group-hover:bg-black group-hover:text-white transition-all shadow-sm shrink-0 mt-0.5">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-black group-hover:text-indigo-600 transition-colors">
                      Sample Proof Profile
                    </span>
                    <span className="text-xs text-black font-medium leading-tight block mt-0.5">
                      View demo 3D credential & public audit badge
                    </span>
                  </div>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: PORTALS & ISSUANCE (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-lg bg-purple-50 border border-purple-200 px-3 py-1.5 text-purple-700">
              <LayoutGrid className="h-4 w-4 text-purple-600" />
              <h4 className="text-xs font-black uppercase tracking-wider font-display text-purple-900">
                Portals
              </h4>
            </div>

            <ul className="space-y-2.5">
              <li>
                <Link
                  to="/dashboard"
                  className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-purple-50/60 border border-transparent hover:border-purple-100 transition-all group"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-700 border border-purple-200 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-sm shrink-0 mt-0.5">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-black group-hover:text-purple-600 transition-colors">
                      Holder Dashboard
                    </span>
                    <span className="text-xs text-black font-medium leading-tight block mt-0.5">
                      Manage badges & QR codes
                    </span>
                  </div>
                </Link>
              </li>

              <li>
                <Link
                  to="/issuer"
                  className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-fuchsia-50/60 border border-transparent hover:border-fuchsia-100 transition-all group"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-fuchsia-100 text-fuchsia-700 border border-fuchsia-200 group-hover:bg-fuchsia-600 group-hover:text-white transition-all shadow-sm shrink-0 mt-0.5">
                    <Landmark className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-black group-hover:text-fuchsia-600 transition-colors">
                      Issuer Portal
                    </span>
                    <span className="text-xs text-black font-medium leading-tight block mt-0.5">
                      Sign & anchor credentials
                    </span>
                  </div>
                </Link>
              </li>

              <li>
                <Link
                  to="/issuer/issue"
                  className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-pink-50/60 border border-transparent hover:border-pink-100 transition-all group"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pink-100 text-pink-700 border border-pink-200 group-hover:bg-pink-600 group-hover:text-white transition-all shadow-sm shrink-0 mt-0.5">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-black group-hover:text-pink-600 transition-colors">
                      AI Issuance
                    </span>
                    <span className="text-xs text-black font-medium leading-tight block mt-0.5">
                      Gemini document extractor
                    </span>
                  </div>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: ARCHITECTURE & TRUST MATRIX (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-emerald-800">
              <Cpu className="h-4 w-4 text-emerald-600" />
              <h4 className="text-xs font-black uppercase tracking-wider font-display text-emerald-950">
                Cryptographic Stack
              </h4>
            </div>

            <p className="text-xs text-black font-semibold leading-relaxed">
              Canonical JSON SHA-256 hashing. Zero private data on chain. Cryptographic multi-sig verifiable proof.
            </p>

            {/* High-Contrast Stack Badges */}
            <div className="grid grid-cols-2 gap-2 pt-1 select-none">
              <div className="flex items-center gap-2 rounded-xl bg-white border border-slate-200 hover:border-emerald-400 p-2.5 text-xs font-bold text-black shadow-sm transition-all hover:scale-[1.02]">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span className="text-black font-bold">SHA-256</span>
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 p-2.5 text-xs font-bold text-black shadow-sm transition-all hover:scale-[1.02]">
                <EyeOff className="h-4 w-4 text-indigo-600 shrink-0" />
                <span className="text-black font-bold">Zero PII</span>
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-white border border-slate-200 hover:border-amber-400 p-2.5 text-xs font-bold text-black shadow-sm transition-all hover:scale-[1.02]">
                <Hammer className="h-4 w-4 text-amber-600 shrink-0" />
                <span className="text-black font-bold">Foundry</span>
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-white border border-slate-200 hover:border-blue-400 p-2.5 text-xs font-bold text-black shadow-sm transition-all hover:scale-[1.02]">
                <span className="font-mono text-xs font-black text-blue-600">OZ</span>
                <span className="text-black font-bold">OpenZeppelin</span>
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-white border border-slate-200 hover:border-purple-400 p-2.5 text-xs font-bold text-black shadow-sm transition-all hover:scale-[1.02]">
                <Radio className="h-4 w-4 text-purple-600 shrink-0" />
                <span className="text-black font-bold">RainbowKit</span>
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-white border border-slate-200 hover:border-pink-400 p-2.5 text-xs font-bold text-black shadow-sm transition-all hover:scale-[1.02]">
                <Sparkles className="h-4 w-4 text-pink-600 shrink-0" />
                <span className="text-black font-bold">Gemini 1.5</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal, Socials & Copyright Bar */}
      <div className="border-t border-slate-200 bg-slate-50/80 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright & Shield */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-slate-200 text-indigo-600 shadow-sm">
              <Shield className="h-4 w-4" />
            </div>
            <div className="text-xs text-black font-medium">
              <span className="font-bold text-black">© 2026 CertifiedPass.</span> All rights reserved. Powered by Polygon EVM.
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/sunny200551/CertifiedPass"
              target="_blank"
              rel="noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-black hover:text-white hover:bg-slate-950 hover:border-slate-950 transition-all shadow-sm hover:scale-105"
              title="GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-black hover:text-white hover:bg-sky-500 hover:border-sky-500 transition-all shadow-sm hover:scale-105"
              title="Twitter / X"
            >
              <Twitter className="h-4 w-4" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-black hover:text-white hover:bg-blue-600 hover:border-blue-600 transition-all shadow-sm hover:scale-105"
              title="LinkedIn"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              href="https://discord.com"
              target="_blank"
              rel="noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-black hover:text-white hover:bg-indigo-600 hover:border-indigo-600 transition-all shadow-sm hover:scale-105"
              title="Discord"
            >
              <MessageSquare className="h-4 w-4" />
            </a>
          </div>

          {/* Legal / Policy Links */}
          <div className="flex items-center gap-6 text-xs font-bold text-black">
            <Link to="/verify" className="text-black hover:text-indigo-600 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/verify" className="text-black hover:text-indigo-600 transition-colors">
              Terms of Service
            </Link>
            <a
              href="https://amoy.polygonscan.com"
              target="_blank"
              rel="noreferrer"
              className="text-black hover:text-indigo-600 transition-colors"
            >
              Docs
            </a>
            <Link to="/verify" className="text-black hover:text-indigo-600 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

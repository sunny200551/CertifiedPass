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
    <footer className="w-full relative border-t border-slate-200 bg-white text-slate-900 transition-colors">
      {/* Top Colorful Accent Line */}
      <div className="h-0.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400" />

      {/* Top Banner / Protocol Live Status Strip (Compact) */}
      <div className="border-b border-slate-200/80 bg-slate-50/70 py-2.5 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Live Network Status Pill */}
          <div className="flex items-center gap-2 rounded-full bg-white border border-emerald-300 px-3 py-1 shadow-sm">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
            </span>
            <span className="text-[11px] font-bold text-slate-900 flex items-center gap-1.5">
              <span>Network Status:</span>
              <span className="text-emerald-700 font-extrabold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 text-[10px]">
                Polygon Amoy & Mainnet (Operational)
              </span>
            </span>
          </div>

          {/* Security & Feature Badges */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] font-semibold text-slate-700">
            <div className="flex items-center gap-1.5 rounded-full bg-white border border-indigo-200 px-2.5 py-0.5 shadow-sm text-slate-800">
              <Lock className="h-3 w-3 text-indigo-600 shrink-0" />
              <span>Zero-Knowledge & Zero-PII</span>
            </div>

            <div className="flex items-center gap-1.5 rounded-full bg-white border border-purple-200 px-2.5 py-0.5 shadow-sm text-slate-800">
              <Cpu className="h-3 w-3 text-purple-600 shrink-0" />
              <span>Gemini 1.5 Flash Oracle</span>
            </div>

            <div className="flex items-center gap-1.5 rounded-full bg-white border border-blue-200 px-2.5 py-0.5 shadow-sm text-slate-800">
              <Layers className="h-3 w-3 text-blue-600 shrink-0" />
              <span>EIP-712 & Soulbound Attestations</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Navigation: Brand 23% Left + 3 Columns Tighter Row on Right */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-8 items-start">
          {/* Brand Block: Anchored to Far Left (~24% width on lg) with breathing room */}
          <div className="lg:col-span-3 space-y-3.5 lg:pr-4">
            <Link to="/" className="flex items-center gap-2.5 group w-fit">
              <div className="relative p-1 rounded-lg bg-white border border-slate-200 shadow-sm group-hover:border-indigo-400 transition-all shrink-0">
                <img
                  src={logoUrl}
                  alt="CertifiedPass Logo"
                  className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tight text-slate-950 font-display flex items-center gap-1.5">
                  CertifiedPass
                  <span className="rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-1.5 py-0.2 text-[9px] font-black text-white shadow-sm leading-none">
                    V1.0
                  </span>
                </span>
              </div>
            </Link>

            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              AI-powered verifiable credential infrastructure for hackathons, open-source milestones, professional escrow settlements, and career achievements. Anchored cryptographically on Polygon EVM.
            </p>

            <div className="pt-1">
              <div className="inline-flex items-center gap-2 rounded-lg border border-emerald-300 bg-emerald-50/80 px-2.5 py-1.5 text-[11px] font-mono font-bold text-emerald-950 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-600 ring-2 ring-emerald-200 animate-pulse" />
                <span className="text-emerald-900 font-bold">Polygon Amoy (Chain 80002) & PoS (137)</span>
              </div>
            </div>
          </div>

          {/* 3 Right Columns Container (Tighter Horizontal Grid: ~76% width) */}
          <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-3 gap-5 lg:gap-6 pt-1">
            {/* Column 1: Verification Hub */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-200 px-2.5 py-1 text-indigo-800">
                <ShieldCheck className="h-3.5 w-3.5 text-indigo-600" />
                <h4 className="text-[11px] font-bold uppercase tracking-wider font-display text-indigo-950">
                  Verification Hub
                </h4>
              </div>

              <ul className="space-y-2">
                <li>
                  <Link
                    to="/verify"
                    className="flex items-start gap-2.5 p-1.5 rounded-lg hover:bg-indigo-50/60 border border-transparent hover:border-indigo-100 transition-all group"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-100 text-indigo-700 border border-indigo-200 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm shrink-0 mt-0.5">
                      <ShieldCheck className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <span className="block text-[13px] font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">
                        Universal Verifier
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium leading-tight block mt-0.5">
                        Verify hash, multi-sig & issuer signatures
                      </span>
                    </div>
                  </Link>
                </li>

                <li>
                  <Link
                    to="/verify?partner=polylance"
                    className="flex items-start gap-2.5 p-1.5 rounded-lg hover:bg-violet-50/60 border border-transparent hover:border-violet-100 transition-all group"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-violet-100 text-violet-700 border border-violet-200 group-hover:bg-violet-600 group-hover:text-white transition-all shadow-sm shrink-0 mt-0.5">
                      <FileCheck2 className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <span className="flex items-center gap-1.5 text-[13px] font-bold text-slate-900 group-hover:text-violet-600 transition-colors leading-tight">
                        PolyLance Escrow Audit
                        <span className="rounded-full bg-violet-600 text-white px-1.5 py-0.5 text-[8.5px] font-black leading-none">
                          Collab
                        </span>
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium leading-tight block mt-0.5">
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
                    className="flex items-start gap-2.5 p-1.5 rounded-lg hover:bg-blue-50/60 border border-transparent hover:border-blue-100 transition-all group"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-100 text-blue-700 border border-blue-200 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm shrink-0 mt-0.5">
                      <Box className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <span className="flex items-center gap-1 text-[13px] font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                        PolygonScan Explorer <ArrowUpRight className="h-3 w-3 text-blue-500" />
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium leading-tight block mt-0.5">
                        Inspect on-chain smart contract transactions
                      </span>
                    </div>
                  </a>
                </li>

                <li>
                  <Link
                    to="/u/alex.rivera"
                    className="flex items-start gap-2.5 p-1.5 rounded-lg hover:bg-slate-100/70 border border-transparent hover:border-slate-200 transition-all group"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-200 text-slate-800 border border-slate-300 group-hover:bg-slate-950 group-hover:text-white transition-all shadow-sm shrink-0 mt-0.5">
                      <FileText className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <span className="block text-[13px] font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">
                        Sample Proof Profile
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium leading-tight block mt-0.5">
                        View demo 3D credential & public audit badge
                      </span>
                    </div>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: Portals */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 border border-purple-200 px-2.5 py-1 text-purple-800">
                <LayoutGrid className="h-3.5 w-3.5 text-purple-600" />
                <h4 className="text-[11px] font-bold uppercase tracking-wider font-display text-purple-950">
                  Portals
                </h4>
              </div>

              <ul className="space-y-2">
                <li>
                  <Link
                    to="/dashboard"
                    className="flex items-start gap-2.5 p-1.5 rounded-lg hover:bg-purple-50/60 border border-transparent hover:border-purple-100 transition-all group"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-purple-100 text-purple-700 border border-purple-200 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-sm shrink-0 mt-0.5">
                      <User className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <span className="block text-[13px] font-bold text-slate-900 group-hover:text-purple-600 transition-colors leading-tight">
                        Holder Dashboard
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium leading-tight block mt-0.5">
                        Manage badges & QR codes
                      </span>
                    </div>
                  </Link>
                </li>

                <li>
                  <Link
                    to="/issuer"
                    className="flex items-start gap-2.5 p-1.5 rounded-lg hover:bg-fuchsia-50/60 border border-transparent hover:border-fuchsia-100 transition-all group"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-fuchsia-100 text-fuchsia-700 border border-fuchsia-200 group-hover:bg-fuchsia-600 group-hover:text-white transition-all shadow-sm shrink-0 mt-0.5">
                      <Landmark className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <span className="block text-[13px] font-bold text-slate-900 group-hover:text-fuchsia-600 transition-colors leading-tight">
                        Issuer Portal
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium leading-tight block mt-0.5">
                        Sign & anchor credentials
                      </span>
                    </div>
                  </Link>
                </li>

                <li>
                  <Link
                    to="/issuer/issue"
                    className="flex items-start gap-2.5 p-1.5 rounded-lg hover:bg-pink-50/60 border border-transparent hover:border-pink-100 transition-all group"
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-pink-100 text-pink-700 border border-pink-200 group-hover:bg-pink-600 group-hover:text-white transition-all shadow-sm shrink-0 mt-0.5">
                      <Sparkles className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <span className="block text-[13px] font-bold text-slate-900 group-hover:text-pink-600 transition-colors leading-tight">
                        AI Issuance
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium leading-tight block mt-0.5">
                        Gemini document extractor
                      </span>
                    </div>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Cryptographic Stack */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-emerald-800">
                <Cpu className="h-3.5 w-3.5 text-emerald-600" />
                <h4 className="text-[11px] font-bold uppercase tracking-wider font-display text-emerald-950">
                  Cryptographic Stack
                </h4>
              </div>

              <p className="text-[11.5px] text-slate-600 font-medium leading-tight">
                Canonical JSON SHA-256 hashing. Zero private data on chain. Cryptographic multi-sig verifiable proof.
              </p>

              {/* Compact 2x3 Stack Chips Grid */}
              <div className="grid grid-cols-2 gap-1.5 pt-0.5 select-none">
                <div className="flex items-center gap-1.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-emerald-400 px-2 py-1 text-[11px] font-bold text-slate-800 shadow-sm transition-all hover:scale-[1.02]">
                  <ShieldCheck className="h-3 w-3 text-emerald-600 shrink-0" />
                  <span>SHA-256</span>
                </div>

                <div className="flex items-center gap-1.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-indigo-400 px-2 py-1 text-[11px] font-bold text-slate-800 shadow-sm transition-all hover:scale-[1.02]">
                  <EyeOff className="h-3 w-3 text-indigo-600 shrink-0" />
                  <span>Zero PII</span>
                </div>

                <div className="flex items-center gap-1.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-amber-400 px-2 py-1 text-[11px] font-bold text-slate-800 shadow-sm transition-all hover:scale-[1.02]">
                  <Hammer className="h-3 w-3 text-amber-600 shrink-0" />
                  <span>Foundry</span>
                </div>

                <div className="flex items-center gap-1.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-blue-400 px-2 py-1 text-[11px] font-bold text-slate-800 shadow-sm transition-all hover:scale-[1.02]">
                  <span className="font-mono text-[10px] font-black text-blue-600 leading-none">OZ</span>
                  <span>OpenZeppelin</span>
                </div>

                <div className="flex items-center gap-1.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-purple-400 px-2 py-1 text-[11px] font-bold text-slate-800 shadow-sm transition-all hover:scale-[1.02]">
                  <Radio className="h-3 w-3 text-purple-600 shrink-0" />
                  <span>RainbowKit</span>
                </div>

                <div className="flex items-center gap-1.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-pink-400 px-2 py-1 text-[11px] font-bold text-slate-800 shadow-sm transition-all hover:scale-[1.02]">
                  <Sparkles className="h-3 w-3 text-pink-600 shrink-0" />
                  <span>Gemini 1.5</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal, Socials & Copyright Bar (Compact & Sleek) */}
      <div className="border-t border-slate-200 bg-slate-50/80 py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          {/* Copyright & Shield */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white border border-slate-200 text-indigo-600 shadow-sm">
              <Shield className="h-3.5 w-3.5" />
            </div>
            <div className="text-[11px] text-slate-600 font-medium">
              <span className="font-bold text-slate-900">© 2026 CertifiedPass.</span> All rights reserved. Powered by Polygon EVM.
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/sunny200551/CertifiedPass"
              target="_blank"
              rel="noreferrer"
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:text-white hover:bg-slate-950 hover:border-slate-950 transition-all shadow-sm hover:scale-105"
              title="GitHub"
            >
              <Github className="h-3.5 w-3.5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:text-white hover:bg-sky-500 hover:border-sky-500 transition-all shadow-sm hover:scale-105"
              title="Twitter / X"
            >
              <Twitter className="h-3.5 w-3.5" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:text-white hover:bg-blue-600 hover:border-blue-600 transition-all shadow-sm hover:scale-105"
              title="LinkedIn"
            >
              <Linkedin className="h-3.5 w-3.5" />
            </a>
            <a
              href="https://discord.com"
              target="_blank"
              rel="noreferrer"
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:text-white hover:bg-indigo-600 hover:border-indigo-600 transition-all shadow-sm hover:scale-105"
              title="Discord"
            >
              <MessageSquare className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Legal / Policy Links */}
          <div className="flex items-center gap-5 text-[11px] font-bold text-slate-600">
            <Link to="/verify" className="hover:text-indigo-600 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/verify" className="hover:text-indigo-600 transition-colors">
              Terms of Service
            </Link>
            <a
              href="https://amoy.polygonscan.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-indigo-600 transition-colors"
            >
              Docs
            </a>
            <Link to="/verify" className="hover:text-indigo-600 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

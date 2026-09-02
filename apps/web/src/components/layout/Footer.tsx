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
    <footer className="w-full border-t border-slate-200 bg-white text-slate-900 transition-colors">
      {/* Top Banner / Core Protocol Highlights */}
      <div className="border-b border-slate-100 bg-slate-50/70 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
              </span>
              <span className="font-bold text-slate-900">
                Network Status: <span className="text-emerald-700 font-extrabold">Polygon Amoy & Mainnet (Operational)</span>
              </span>
            </div>

            <div className="flex items-center gap-6 font-semibold text-slate-600">
              <span className="flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-indigo-600" />
                <span>Zero-Knowledge & Zero-PII</span>
              </span>
              <span className="hidden sm:inline-block text-slate-300">•</span>
              <span className="flex items-center gap-1.5">
                <Cpu className="h-3.5 w-3.5 text-violet-600" />
                <span>Gemini 1.5 Flash Oracle</span>
              </span>
              <span className="hidden sm:inline-block text-slate-300">•</span>
              <span className="flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-blue-600" />
                <span>EIP-712 & Soulbound Attestations</span>
              </span>
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
              <img
                src={logoUrl}
                alt="CertifiedPass Logo"
                className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
              />
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-slate-950 font-display flex items-center gap-2">
                  CertifiedPass
                  <span className="rounded-md bg-indigo-100 border border-indigo-200 px-1.5 py-0.5 text-[10px] font-black text-indigo-900">
                    V1.0
                  </span>
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-600 leading-relaxed font-medium pr-4">
              AI-powered verifiable credential infrastructure for hackathons, open-source milestones, professional escrow settlements, and career achievements. Anchored cryptographically on Polygon EVM.
            </p>

            <div className="pt-1">
              <div className="inline-flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-mono font-bold text-emerald-950 shadow-apple-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-600 ring-4 ring-emerald-100 animate-pulse" />
                <span>Polygon Amoy (Chain 80002) & PoS (137)</span>
              </div>
            </div>
          </div>

          {/* Column 2: VERIFICATION SERVICES (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center gap-2 text-indigo-600">
              <ShieldCheck className="h-4 w-4" />
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-950 font-display">
                Verification Hub
              </h4>
            </div>

            <ul className="space-y-3">
              <li>
                <Link to="/verify" className="flex items-start gap-3 group">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-apple-sm shrink-0 mt-0.5">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      Universal Verifier
                    </span>
                    <span className="text-xs text-slate-500 font-medium leading-tight block">
                      Verify hash, multi-sig & issuer signatures
                    </span>
                  </div>
                </Link>
              </li>

              <li>
                <Link to="/verify?partner=polylance" className="flex items-start gap-3 group">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600 border border-violet-200 group-hover:bg-violet-600 group-hover:text-white transition-all shadow-apple-sm shrink-0 mt-0.5">
                    <FileCheck2 className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="flex items-center gap-1.5 text-sm font-bold text-slate-900 group-hover:text-violet-600 transition-colors">
                      PolyLance Escrow Audit
                      <span className="rounded-full bg-violet-100 text-violet-800 px-1.5 py-0.2 text-[9px] font-black">
                        Collab
                      </span>
                    </span>
                    <span className="text-xs text-slate-500 font-medium leading-tight block">
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
                  className="flex items-start gap-3 group"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700 border border-slate-200 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-apple-sm shrink-0 mt-0.5">
                    <Box className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="flex items-center gap-1 text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      PolygonScan Explorer <ArrowUpRight className="h-3 w-3 text-slate-400" />
                    </span>
                    <span className="text-xs text-slate-500 font-medium leading-tight block">
                      Inspect on-chain smart contract transactions
                    </span>
                  </div>
                </a>
              </li>

              <li>
                <Link to="/u/alex.rivera" className="flex items-start gap-3 group">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-700 border border-slate-200 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-apple-sm shrink-0 mt-0.5">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      Sample Proof Profile
                    </span>
                    <span className="text-xs text-slate-500 font-medium leading-tight block">
                      View demo 3D credential & public audit badge
                    </span>
                  </div>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: PORTALS & ISSUANCE (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2 text-violet-600">
              <LayoutGrid className="h-4 w-4" />
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-950 font-display">
                Portals
              </h4>
            </div>

            <ul className="space-y-3">
              <li>
                <Link to="/dashboard" className="flex items-start gap-2.5 group">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600 border border-purple-200 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-apple-sm shrink-0 mt-0.5">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                      Holder Dashboard
                    </span>
                    <span className="text-xs text-slate-500 font-medium leading-tight block">
                      Manage badges & QR codes
                    </span>
                  </div>
                </Link>
              </li>

              <li>
                <Link to="/issuer" className="flex items-start gap-2.5 group">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600 border border-purple-200 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-apple-sm shrink-0 mt-0.5">
                    <Landmark className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                      Issuer Portal
                    </span>
                    <span className="text-xs text-slate-500 font-medium leading-tight block">
                      Sign & anchor credentials
                    </span>
                  </div>
                </Link>
              </li>

              <li>
                <Link to="/issuer/issue" className="flex items-start gap-2.5 group">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600 border border-purple-200 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-apple-sm shrink-0 mt-0.5">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                      AI Issuance
                    </span>
                    <span className="text-xs text-slate-500 font-medium leading-tight block">
                      Gemini document extractor
                    </span>
                  </div>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: ARCHITECTURE & TRUST MATRIX (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center gap-2 text-emerald-700">
              <Cpu className="h-4 w-4" />
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-950 font-display">
                Cryptographic Stack
              </h4>
            </div>

            <p className="text-xs text-slate-600 font-medium leading-relaxed">
              Canonical JSON SHA-256 hashing. Zero private data on chain. Cryptographic multi-sig verifiable proof.
            </p>

            {/* High-Contrast Stack Badges */}
            <div className="grid grid-cols-2 gap-2 pt-1 select-none">
              <div className="flex items-center gap-2 rounded-lg bg-slate-100 border border-slate-200 px-3 py-2 text-xs font-bold text-slate-800 shadow-apple-sm">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>SHA-256</span>
              </div>

              <div className="flex items-center gap-2 rounded-lg bg-slate-100 border border-slate-200 px-3 py-2 text-xs font-bold text-slate-800 shadow-apple-sm">
                <EyeOff className="h-4 w-4 text-indigo-600 shrink-0" />
                <span>Zero PII</span>
              </div>

              <div className="flex items-center gap-2 rounded-lg bg-slate-100 border border-slate-200 px-3 py-2 text-xs font-bold text-slate-800 shadow-apple-sm">
                <Hammer className="h-4 w-4 text-amber-600 shrink-0" />
                <span>Foundry</span>
              </div>

              <div className="flex items-center gap-2 rounded-lg bg-slate-100 border border-slate-200 px-3 py-2 text-xs font-bold text-slate-800 shadow-apple-sm">
                <span className="font-mono text-xs font-black text-blue-600">OZ</span>
                <span>OpenZeppelin</span>
              </div>

              <div className="flex items-center gap-2 rounded-lg bg-slate-100 border border-slate-200 px-3 py-2 text-xs font-bold text-slate-800 shadow-apple-sm">
                <Radio className="h-4 w-4 text-violet-600 shrink-0" />
                <span>RainbowKit</span>
              </div>

              <div className="flex items-center gap-2 rounded-lg bg-slate-100 border border-slate-200 px-3 py-2 text-xs font-bold text-slate-800 shadow-apple-sm">
                <Sparkles className="h-4 w-4 text-fuchsia-600 shrink-0" />
                <span>Gemini 1.5</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal, Socials & Copyright Bar */}
      <div className="border-t border-slate-200 bg-slate-50 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright & Shield */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-slate-200 text-indigo-600 shadow-apple-sm">
              <Shield className="h-4 w-4" />
            </div>
            <div className="text-xs text-slate-600 font-medium">
              <span className="font-bold text-slate-900">© 2026 CertifiedPass.</span> All rights reserved. Powered by Polygon EVM.
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-2.5">
            <a
              href="https://github.com/sunny200551/CertifiedPass"
              target="_blank"
              rel="noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:text-white hover:bg-slate-950 hover:border-slate-950 transition-all shadow-apple-sm"
              title="GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:text-white hover:bg-slate-950 hover:border-slate-950 transition-all shadow-apple-sm"
              title="Twitter / X"
            >
              <Twitter className="h-4 w-4" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:text-white hover:bg-slate-950 hover:border-slate-950 transition-all shadow-apple-sm"
              title="LinkedIn"
            >
              <Linkedin className="h-4 w-4" />
            </a>
            <a
              href="https://discord.com"
              target="_blank"
              rel="noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:text-white hover:bg-slate-950 hover:border-slate-950 transition-all shadow-apple-sm"
              title="Discord"
            >
              <MessageSquare className="h-4 w-4" />
            </a>
          </div>

          {/* Legal / Policy Links */}
          <div className="flex items-center gap-6 text-xs font-bold text-slate-600">
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

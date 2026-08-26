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
} from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-slate-50/60 py-12 text-slate-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Card Container Matching Design */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-8 sm:p-12 shadow-apple-sm space-y-12">
          {/* 4-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Column 1: Brand & Logo */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src="/CP_logo.png"
                  alt="CertifiedPass Logo"
                  className="h-10 w-auto object-contain"
                />
                <span className="font-black text-slate-950 tracking-tight font-display text-2xl">
                  CertifiedPass
                </span>
              </div>

              {/* Purple accent line */}
              <div className="h-0.5 w-7 bg-indigo-600 rounded-full" />

              <p className="text-xs text-slate-900 leading-relaxed font-semibold">
                Proof of What You've Achieved. AI-powered verifiable credentials anchored on Polygon Amoy EVM.
              </p>

              <div className="pt-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300 bg-emerald-50/90 px-3.5 py-1.5 text-xs font-mono font-bold text-emerald-950 cursor-default select-none shadow-apple-sm">
                  <span className="h-2 w-2 rounded-full bg-emerald-600 ring-2 ring-emerald-300 animate-pulse" />
                  <span>Polygon Amoy (Chain ID 80002)</span>
                </div>
              </div>
            </div>

            {/* Column 2: VERIFICATION (Clickable Actions) */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 text-blue-600">
                  <ShieldCheck className="h-5 w-5" />
                  <h4 className="text-xs font-black uppercase tracking-wider font-display">
                    VERIFICATION
                  </h4>
                </div>
                <div className="h-0.5 w-6 bg-blue-600 rounded-full mt-1.5" />
              </div>

              <ul className="space-y-3.5 pt-1">
                <li>
                  <Link to="/verify" className="flex items-start gap-3 group">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-200 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-apple-sm shrink-0">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <div className="text-xs">
                      <span className="block font-black text-slate-950 group-hover:text-blue-600 transition-colors">
                        Public Verifier
                      </span>
                      <span className="text-[11px] text-slate-900 font-semibold">
                        Verify any credential instantly
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
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-200 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-apple-sm shrink-0">
                      <Box className="h-4 w-4" />
                    </div>
                    <div className="text-xs">
                      <span className="flex items-center gap-1 font-black text-slate-950 group-hover:text-blue-600 transition-colors">
                        PolygonScan Explorer <ExternalLink className="h-3 w-3" />
                      </span>
                      <span className="text-[11px] text-slate-900 font-semibold">
                        View on-chain transactions
                      </span>
                    </div>
                  </a>
                </li>

                <li>
                  <Link to="/u/alex.rivera" className="flex items-start gap-3 group">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-200 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-apple-sm shrink-0">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="text-xs">
                      <span className="block font-black text-slate-950 group-hover:text-blue-600 transition-colors">
                        Sample Proof Profile
                      </span>
                      <span className="text-[11px] text-slate-900 font-semibold">
                        Explore a verified credential
                      </span>
                    </div>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: PORTALS (Clickable Actions) */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 text-purple-600">
                  <LayoutGrid className="h-5 w-5" />
                  <h4 className="text-xs font-black uppercase tracking-wider font-display">
                    PORTALS
                  </h4>
                </div>
                <div className="h-0.5 w-6 bg-purple-600 rounded-full mt-1.5" />
              </div>

              <ul className="space-y-3.5 pt-1">
                <li>
                  <Link to="/dashboard" className="flex items-start gap-3 group">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-200 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-apple-sm shrink-0">
                      <User className="h-4 w-4" />
                    </div>
                    <div className="text-xs">
                      <span className="block font-black text-slate-950 group-hover:text-purple-600 transition-colors">
                        Holder Dashboard
                      </span>
                      <span className="text-[11px] text-slate-900 font-semibold">
                        View & manage your credentials
                      </span>
                    </div>
                  </Link>
                </li>

                <li>
                  <Link to="/issuer" className="flex items-start gap-3 group">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-200 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-apple-sm shrink-0">
                      <Landmark className="h-4 w-4" />
                    </div>
                    <div className="text-xs">
                      <span className="block font-black text-slate-950 group-hover:text-purple-600 transition-colors">
                        Issuer Portal
                      </span>
                      <span className="text-[11px] text-slate-900 font-semibold">
                        Issue verifiable credentials
                      </span>
                    </div>
                  </Link>
                </li>

                <li>
                  <Link to="/issuer/issue" className="flex items-start gap-3 group">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-200 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-apple-sm shrink-0">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div className="text-xs">
                      <span className="block font-black text-slate-950 group-hover:text-purple-600 transition-colors">
                        AI Document Issuance
                      </span>
                      <span className="text-[11px] text-slate-900 font-semibold">
                        Create documents with AI
                      </span>
                    </div>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: ARCHITECTURE (Non-Clickable Specification Badges) */}
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 text-emerald-700">
                  <Landmark className="h-5 w-5" />
                  <h4 className="text-xs font-black uppercase tracking-wider font-display">
                    ARCHITECTURE
                  </h4>
                </div>
                <div className="h-0.5 w-6 bg-emerald-600 rounded-full mt-1.5" />
              </div>

              <p className="text-xs text-slate-900 leading-relaxed font-semibold cursor-default">
                Anchored with SHA-256 canonical hashing. Zero PII stored on-chain. Built with Foundry, OpenZeppelin, RainbowKit, and Gemini 1.5 Flash.
              </p>

              {/* 6 Non-Clickable Technology Badges */}
              <div className="grid grid-cols-2 gap-2 pt-1 select-none">
                <div className="flex items-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-300 px-2.5 py-1.5 text-[11px] font-black text-emerald-950 shadow-apple-sm cursor-default">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                  <span>SHA-256</span>
                </div>

                <div className="flex items-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-300 px-2.5 py-1.5 text-[11px] font-black text-emerald-950 shadow-apple-sm cursor-default">
                  <EyeOff className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                  <span>Zero PII</span>
                </div>

                <div className="flex items-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-300 px-2.5 py-1.5 text-[11px] font-black text-emerald-950 shadow-apple-sm cursor-default">
                  <Hammer className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                  <span>Foundry</span>
                </div>

                <div className="flex items-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-300 px-2.5 py-1.5 text-[11px] font-black text-emerald-950 shadow-apple-sm cursor-default">
                  <span className="text-xs font-black font-mono text-emerald-800">Z</span>
                  <span>OpenZeppelin</span>
                </div>

                <div className="flex items-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-300 px-2.5 py-1.5 text-[11px] font-black text-emerald-950 shadow-apple-sm cursor-default">
                  <Radio className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                  <span>RainbowKit</span>
                </div>

                <div className="flex items-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-300 px-2.5 py-1.5 text-[11px] font-black text-emerald-950 shadow-apple-sm cursor-default">
                  <Sparkles className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                  <span>Gemini 1.5 Flash</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Copyright with Shield */}
            <div className="flex items-center gap-3.5 cursor-default select-none">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 shadow-apple-sm">
                <Shield className="h-5 w-5" />
              </div>
              <div className="text-xs">
                <span className="block font-black text-slate-950">© 2025 CertifiedPass</span>
                <span className="text-slate-900 font-semibold">All rights reserved.</span>
              </div>
            </div>

            {/* Social Icons (Clickable) */}
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/sunny200551/CertifiedPass"
                target="_blank"
                rel="noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-slate-100 text-slate-800 hover:text-white hover:bg-slate-950 hover:border-slate-950 transition-all shadow-apple-sm"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-slate-100 text-slate-800 hover:text-white hover:bg-slate-950 hover:border-slate-950 transition-all shadow-apple-sm"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-slate-100 text-slate-800 hover:text-white hover:bg-slate-950 hover:border-slate-950 transition-all shadow-apple-sm"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-slate-100 text-slate-800 hover:text-white hover:bg-slate-950 hover:border-slate-950 transition-all shadow-apple-sm"
              >
                <MessageSquare className="h-4 w-4" />
              </a>
            </div>

            {/* Legal / Nav Links (Clickable) */}
            <div className="flex items-center divide-x divide-slate-300 text-xs font-black text-slate-950">
              <span className="px-3 hover:text-indigo-600 cursor-pointer transition-colors">Privacy Policy</span>
              <span className="px-3 hover:text-indigo-600 cursor-pointer transition-colors">Terms of Service</span>
              <span className="px-3 hover:text-indigo-600 cursor-pointer transition-colors">Docs</span>
              <span className="pl-3 hover:text-indigo-600 cursor-pointer transition-colors">Contact</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

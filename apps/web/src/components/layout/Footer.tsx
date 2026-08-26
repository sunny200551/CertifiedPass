import React from "react";
import { Link } from "react-router-dom";
import { ExternalLink, ShieldCheck } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t-2 border-slate-300 bg-white py-16 text-slate-950 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 p-1.5 shadow-md ring-2 ring-slate-900">
                <img
                  src="/CP_logo.png"
                  alt="CertifiedPass Logo"
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="font-black text-slate-950 tracking-tight font-display text-xl">
                CertifiedPass
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-900 font-semibold">
              Proof of What You've Achieved. AI-powered verifiable credentials anchored on Polygon Amoy EVM.
            </p>
            <div className="flex items-center gap-2.5 pt-1">
              <span className="h-3 w-3 rounded-full bg-emerald-600 ring-4 ring-emerald-200 inline-block animate-pulse" />
              <span className="text-xs font-mono font-black text-slate-950 tracking-wide bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-300">
                Polygon Amoy (Chain ID 80002)
              </span>
            </div>
          </div>

          {/* Verification Links */}
          <div>
            <h4 className="text-sm font-black uppercase tracking-wider text-slate-950 mb-4 font-display">
              Verification
            </h4>
            <ul className="space-y-3.5 text-sm font-bold">
              <li>
                <Link to="/verify" className="text-slate-900 hover:text-indigo-600 transition-colors">
                  Public Verifier
                </Link>
              </li>
              <li>
                <a
                  href="https://amoy.polygonscan.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-slate-900 hover:text-indigo-600 transition-colors"
                >
                  PolygonScan Explorer <ExternalLink className="h-4 w-4" />
                </a>
              </li>
              <li>
                <Link to="/u/alex.rivera" className="text-slate-900 hover:text-indigo-600 transition-colors">
                  Sample Proof Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Portals */}
          <div>
            <h4 className="text-sm font-black uppercase tracking-wider text-slate-950 mb-4 font-display">
              Portals
            </h4>
            <ul className="space-y-3.5 text-sm font-bold">
              <li>
                <Link to="/dashboard" className="text-slate-900 hover:text-indigo-600 transition-colors">
                  Holder Dashboard
                </Link>
              </li>
              <li>
                <Link to="/issuer" className="text-slate-900 hover:text-indigo-600 transition-colors">
                  Issuer Portal
                </Link>
              </li>
              <li>
                <Link to="/issuer/issue" className="text-slate-900 hover:text-indigo-600 transition-colors">
                  AI Document Issuance
                </Link>
              </li>
            </ul>
          </div>

          {/* Architecture */}
          <div>
            <h4 className="text-sm font-black uppercase tracking-wider text-slate-950 mb-4 font-display">
              Architecture
            </h4>
            <p className="text-sm text-slate-900 leading-relaxed font-semibold">
              Anchored with SHA-256 canonical hashing. Zero PII stored on-chain. Built with Foundry, OpenZeppelin, RainbowKit, and Gemini 1.5 Flash.
            </p>
          </div>
        </div>

        <div className="mt-12 border-t-2 border-slate-200 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-900 gap-4 font-bold">
          <p>© 2026 CertifiedPass. Verifiable achievements for the decentralized world.</p>
          <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-300">
            <span className="h-2 w-2 rounded-full bg-indigo-600"></span>
            <span className="font-mono text-slate-950 font-black">CertifiedPassRegistry.sol</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

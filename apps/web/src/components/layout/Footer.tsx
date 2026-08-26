import React from "react";
import { Link } from "react-router-dom";
import { ExternalLink, ShieldCheck } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t-2 border-slate-200 bg-white py-14 text-slate-900 shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1 space-y-3.5">
            <div className="flex items-center gap-2.5">
              <img
                src="/CP_logo.png"
                alt="CertifiedPass"
                className="h-9 w-9 object-contain rounded-xl shadow-apple-sm"
              />
              <span className="font-extrabold text-slate-950 tracking-tight font-display text-lg">
                CertifiedPass
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-800 font-medium">
              Proof of What You've Achieved. AI-powered verifiable credentials anchored on Polygon Amoy EVM.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100 inline-block animate-pulse" />
              <span className="text-xs font-mono font-bold text-slate-900">
                Polygon Amoy (Chain ID 80002)
              </span>
            </div>
          </div>

          {/* Verification Links */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-950 mb-3.5 font-display">
              Verification
            </h4>
            <ul className="space-y-3 text-sm font-semibold">
              <li>
                <Link to="/verify" className="text-slate-800 hover:text-indigo-600 transition-colors">
                  Public Verifier
                </Link>
              </li>
              <li>
                <a
                  href="https://amoy.polygonscan.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-slate-800 hover:text-indigo-600 transition-colors"
                >
                  PolygonScan Explorer <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </li>
              <li>
                <Link to="/u/alex.rivera" className="text-slate-800 hover:text-indigo-600 transition-colors">
                  Sample Proof Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Portals */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-950 mb-3.5 font-display">
              Portals
            </h4>
            <ul className="space-y-3 text-sm font-semibold">
              <li>
                <Link to="/dashboard" className="text-slate-800 hover:text-indigo-600 transition-colors">
                  Holder Dashboard
                </Link>
              </li>
              <li>
                <Link to="/issuer" className="text-slate-800 hover:text-indigo-600 transition-colors">
                  Issuer Portal
                </Link>
              </li>
              <li>
                <Link to="/issuer/issue" className="text-slate-800 hover:text-indigo-600 transition-colors">
                  AI Document Issuance
                </Link>
              </li>
            </ul>
          </div>

          {/* Architecture */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-950 mb-3.5 font-display">
              Architecture
            </h4>
            <p className="text-xs text-slate-800 leading-relaxed font-medium">
              Anchored with SHA-256 canonical hashing. Zero PII stored on-chain. Built with Foundry, OpenZeppelin, RainbowKit, and Gemini 1.5 Flash.
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-700 gap-4 font-semibold">
          <p>© 2026 CertifiedPass. Verifiable achievements for the decentralized world.</p>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-indigo-600"></span>
            <span className="font-mono text-slate-900 font-bold">CertifiedPassRegistry.sol</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

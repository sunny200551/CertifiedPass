import React from "react";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200/90 bg-white py-12 text-slate-600">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <img
                src="/CP_logo.png"
                alt="CertifiedPass"
                className="h-8 w-8 object-contain rounded-xl shadow-apple-sm"
              />
              <span className="font-bold text-slate-900 tracking-tight font-display text-base">
                CertifiedPass
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-600 font-normal">
              Proof of What You've Achieved. AI-powered verifiable credentials anchored on Polygon Amoy EVM.
            </p>
            <div className="flex items-center gap-2 pt-1 text-slate-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
              <span className="text-xs font-mono font-semibold text-slate-800">
                Polygon Amoy (80002)
              </span>
            </div>
          </div>

          {/* Verification Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 font-display">
              Verification
            </h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <Link to="/verify" className="text-slate-600 hover:text-indigo-600 transition-colors">
                  Public Verifier
                </Link>
              </li>
              <li>
                <a
                  href="https://amoy.polygonscan.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  PolygonScan Explorer <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <Link to="/u/alex.rivera" className="text-slate-600 hover:text-indigo-600 transition-colors">
                  Sample Proof Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Portals */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 font-display">
              Portals
            </h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <Link to="/dashboard" className="text-slate-600 hover:text-indigo-600 transition-colors">
                  Holder Dashboard
                </Link>
              </li>
              <li>
                <Link to="/issuer" className="text-slate-600 hover:text-indigo-600 transition-colors">
                  Issuer Portal
                </Link>
              </li>
              <li>
                <Link to="/issuer/issue" className="text-slate-600 hover:text-indigo-600 transition-colors">
                  AI Document Issuance
                </Link>
              </li>
            </ul>
          </div>

          {/* Specs */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 font-display">
              Architecture
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Anchored with SHA-256 canonical hashing. Zero PII stored on-chain. Built with Foundry, OpenZeppelin, RainbowKit, and Gemini 1.5 Flash.
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4 font-medium">
          <p>© 2026 CertifiedPass. Verifiable achievements for the decentralized world.</p>
          <div className="flex items-center gap-4">
            <span className="font-mono text-slate-700 font-semibold">CertifiedPassRegistry.sol</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

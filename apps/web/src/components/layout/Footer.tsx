import React from "react";
import { Link } from "react-router-dom";
import { Shield, ExternalLink } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200/90 bg-white py-12 text-slate-500">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-white font-bold">
                <Shield className="h-4 w-4 text-indigo-400" />
              </div>
              <span className="font-bold text-slate-900 tracking-tight font-display">CertifiedPass</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-500">
              Proof of What You've Achieved. AI-powered verifiable credentials anchored on Polygon Amoy EVM.
            </p>
            <div className="flex items-center gap-3 pt-1 text-slate-400">
              <a
                href="https://polygon.technology"
                target="_blank"
                rel="noreferrer"
                className="hover:text-indigo-600 transition-colors text-xs font-mono font-semibold"
              >
                Polygon Amoy (80002)
              </a>
            </div>
          </div>

          {/* Verification Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Verification</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/verify" className="hover:text-indigo-600 transition-colors">
                  Public Verifier
                </Link>
              </li>
              <li>
                <a
                  href="https://amoy.polygonscan.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 hover:text-indigo-600 transition-colors"
                >
                  PolygonScan Explorer <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <Link to="/u/alex.rivera" className="hover:text-indigo-600 transition-colors">
                  Sample Proof Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Portals */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Portals</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/dashboard" className="hover:text-indigo-600 transition-colors">
                  Holder Dashboard
                </Link>
              </li>
              <li>
                <Link to="/issuer" className="hover:text-indigo-600 transition-colors">
                  Issuer Portal
                </Link>
              </li>
              <li>
                <Link to="/issuer/issue" className="hover:text-indigo-600 transition-colors">
                  AI Document Issuance
                </Link>
              </li>
            </ul>
          </div>

          {/* Specs */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Architecture</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Anchored with SHA-256 canonical hashing. Zero PII stored on-chain. Built with Foundry, OpenZeppelin, RainbowKit, and Gemini 1.5 Flash.
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 CertifiedPass. Verifiable achievements for the decentralized world.</p>
          <div className="flex items-center gap-4">
            <span className="font-mono text-slate-500">CertifiedPassRegistry.sol</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

import React from "react";
import { Link } from "react-router-dom";
import { Shield, ExternalLink, Github, Twitter } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 py-12 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 text-slate-950 font-bold">
                <Shield className="h-4 w-4" />
              </div>
              <span className="font-bold text-white tracking-tight">CertifiedPass</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              Proof of What You've Achieved. AI-powered verifiable credentials anchored on Polygon Amoy EVM.
            </p>
            <div className="flex items-center gap-3 pt-2 text-slate-400">
              <a
                href="https://polygon.technology"
                target="_blank"
                rel="noreferrer"
                className="hover:text-cyan-400 transition-colors"
                title="Polygon Network"
              >
                <span className="text-xs font-mono font-semibold">Polygon Amoy</span>
              </a>
            </div>
          </div>

          {/* Verification Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Verification</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/verify" className="hover:text-cyan-400 transition-colors">
                  Public Verifier
                </Link>
              </li>
              <li>
                <a
                  href="https://amoy.polygonscan.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 hover:text-cyan-400 transition-colors"
                >
                  PolygonScan Explorer <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <Link to="/u/vitalik.eth" className="hover:text-cyan-400 transition-colors">
                  Sample Proof Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Ecosystem Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Portals</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/dashboard" className="hover:text-cyan-400 transition-colors">
                  Holder Dashboard
                </Link>
              </li>
              <li>
                <Link to="/issuer" className="hover:text-purple-400 transition-colors">
                  Issuer Portal
                </Link>
              </li>
              <li>
                <Link to="/issuer/issue" className="hover:text-purple-400 transition-colors">
                  AI Document Issuance
                </Link>
              </li>
            </ul>
          </div>

          {/* Tech Spec */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Specs</h4>
            <p className="text-xs leading-relaxed text-slate-400">
              Anchored with SHA-256 canonical hashing. Zero PII stored on-chain. Built with Foundry, OpenZeppelin, RainbowKit, and Gemini 1.5 Flash.
            </p>
            <div className="mt-3 rounded bg-slate-900 px-2.5 py-1.5 border border-slate-800 text-[11px] font-mono text-cyan-400">
              Network: Polygon Amoy (80002)
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 CertifiedPass. Verifiable achievements for the decentralized world.</p>
          <p className="mt-2 sm:mt-0 font-mono text-[11px]">CertifiedPassRegistry.sol</p>
        </div>
      </div>
    </footer>
  );
};

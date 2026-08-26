import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ShieldCheck, QrCode, ArrowRight, ShieldAlert, CheckCircle } from "lucide-react";
import { Layout } from "../components/layout/Layout.js";
import { Button } from "../components/ui/Button.js";
import { Badge } from "../components/ui/Badge.js";

export default function VerifyPage() {
  const navigate = useNavigate();
  const [inputVal, setInputVal] = useState("");

  const sampleCredentials = [
    {
      id: "cp-hackathon-2026-ethsf",
      title: "1st Place Winner — Global Web3 AI Hackathon",
      issuer: "ETHSF & Polygon Labs",
      type: "hackathon",
      date: "2026-08-20",
    },
    {
      id: "cp-internship-2026-consensys",
      title: "Smart Contract Engineering Intern",
      issuer: "ConsenSys",
      type: "internship",
      date: "2026-07-31",
    },
    {
      id: "cp-opensource-2026-ethers",
      title: "Core Contributor — Ethers.js v6",
      issuer: "Ethers Org",
      type: "opensource",
      date: "2026-06-15",
    },
  ];

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim()) {
      navigate(`/c/${encodeURIComponent(inputVal.trim())}`);
    }
  };

  return (
    <Layout>
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">
            <ShieldCheck className="h-4 w-4" />
            Public Verification Engine • Zero Wallet Required
          </div>
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            Verify a CertifiedPass Credential
          </h1>
          <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
            Enter the unique Credential ID from any certificate, resume, or QR code to audit its cryptographic authenticity against the Polygon Amoy blockchain.
          </p>
        </div>

        {/* Search Box */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-xl mb-12">
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-slate-300 mb-2">
                Credential ID or Anchor Hash
              </label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                <input
                  type="text"
                  placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000 or cp-hackathon-2026-ethsf"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950/90 pl-12 pr-4 py-3.5 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 font-mono transition-all"
                />
              </div>
            </div>

            <Button variant="primary" size="lg" type="submit" className="w-full">
              Verify Credential Authenticity
            </Button>
          </form>
        </div>

        {/* Sample Verified Credentials */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Or Explore Example Verified Records:
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sampleCredentials.map((c) => (
              <div
                key={c.id}
                onClick={() => navigate(`/c/${c.id}`)}
                className="group cursor-pointer rounded-xl border border-slate-800 bg-slate-900/50 p-4 hover:border-cyan-500/50 hover:bg-slate-900 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={c.type as any} size="sm">
                    {c.type.toUpperCase()}
                  </Badge>
                  <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                </div>
                <h4 className="text-sm font-semibold text-white group-hover:text-cyan-300 line-clamp-2">
                  {c.title}
                </h4>
                <p className="text-xs text-slate-400 mt-1">{c.issuer}</p>
                <p className="text-[10px] font-mono text-slate-500 mt-2">{c.date}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Verification Status Legend */}
        <div className="mt-16 rounded-xl border border-slate-800/80 bg-slate-950 p-6 text-xs text-slate-400 space-y-3">
          <h4 className="font-bold text-slate-200 text-sm">How Verification Works</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="flex gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
              <div>
                <strong className="text-slate-200">VERIFIED:</strong> Hash matches on-chain anchor exactly & issuer is platform verified.
              </div>
            </div>
            <div className="flex gap-2">
              <ShieldAlert className="h-4 w-4 text-amber-400 shrink-0" />
              <div>
                <strong className="text-slate-200">REVOKED:</strong> Issuer permanently revoked the credential; invalid for future claims.
              </div>
            </div>
            <div className="flex gap-2">
              <ShieldAlert className="h-4 w-4 text-red-400 shrink-0" />
              <div>
                <strong className="text-slate-200">INVALID:</strong> Metadata has been modified or does not match on-chain hash.
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

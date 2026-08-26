import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ShieldCheck, QrCode, ArrowRight, CheckCircle, Smartphone } from "lucide-react";
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
          <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200/80 bg-indigo-50 px-3.5 py-1 text-xs font-semibold text-indigo-700 shadow-apple-sm">
            <ShieldCheck className="h-4 w-4 text-indigo-600" />
            Public Verification Engine • No Wallet Required
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl font-display">
            Verify a CertifiedPass Credential
          </h1>
          <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto leading-relaxed">
            Enter the unique Credential ID or scan the QR code from any certificate, resume, or portfolio to audit its cryptographic authenticity against the Polygon Amoy blockchain.
          </p>
        </div>

        {/* Search Box */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-apple-md mb-12">
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="e.g. cp-hackathon-2026-ethsf or SHA-256 digest"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 pl-12 pr-4 py-3.5 text-base text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all font-mono"
              />
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Smartphone className="h-4 w-4 text-slate-400" />
                <span>Tip: Point your phone camera at any credential QR code to verify instantly</span>
              </div>
              <Button variant="primary" type="submit" size="md" className="w-full sm:w-auto px-8">
                Verify Now
              </Button>
            </div>
          </form>
        </div>

        {/* Verified Sample Credentials */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-display">
            Verified Sample Credentials in Registry
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sampleCredentials.map((sample) => (
              <div
                key={sample.id}
                onClick={() => navigate(`/c/${sample.id}`)}
                className="group cursor-pointer rounded-2xl border border-slate-200/90 bg-white p-5 shadow-apple-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-apple-md hover:border-indigo-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <Badge variant={sample.type as any} size="sm">
                    {sample.type.toUpperCase()}
                  </Badge>
                  <span className="text-[11px] text-slate-400 font-mono">{sample.date}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 mb-2 font-display">
                  {sample.title}
                </h3>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="text-slate-500 font-medium">{sample.issuer}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Sparkles, Award, Search, ArrowRight, CheckCircle2, Lock, Cpu, Globe, QrCode } from "lucide-react";
import { Layout } from "../components/layout/Layout.js";
import { Button } from "../components/ui/Button.js";
import { HolographicCard3D } from "../components/credential/HolographicCard3D.js";
import { CredentialQRModal } from "../components/credential/CredentialQRModal.js";

export default function LandingPage() {
  const navigate = useNavigate();
  const [searchId, setSearchId] = useState("");
  const [showQR, setShowQR] = useState(false);

  const sampleId = "cp-hackathon-2026-ethsf";

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchId.trim()) {
      navigate(`/c/${encodeURIComponent(searchId.trim())}`);
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Copy & Quick Search */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-spin-slow" />
                Next-Gen Verifiable Credentials on Polygon Amoy
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-white leading-tight">
                Proof of What You've{" "}
                <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">
                  Achieved.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
                Cryptographically verifiable credentials for hackathons, internships, open-source milestones, and professional achievements. AI-parsed, blockchain-anchored, verifiable by anyone without a wallet.
              </p>

              {/* Instant Verification Search Bar */}
              <div className="pt-2">
                <form onSubmit={handleVerifySubmit} className="flex max-w-lg gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Paste Credential ID or Hash to verify..."
                      value={searchId}
                      onChange={(e) => setSearchId(e.target.value)}
                      className="w-full rounded-lg border border-slate-700 bg-slate-900/90 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
                    />
                  </div>
                  <Button variant="primary" type="submit">
                    Verify
                  </Button>
                </form>

                <div className="mt-2.5 flex items-center gap-2 text-xs text-slate-400">
                  <span>Try sample:</span>
                  <button
                    onClick={() => navigate(`/c/${sampleId}`)}
                    className="font-mono text-cyan-400 hover:underline hover:text-cyan-300"
                  >
                    {sampleId}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link to="/verify">
                  <Button variant="cyan" size="lg" className="gap-2">
                    Universal Verifier <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/issuer">
                  <Button variant="outline" size="lg">
                    Issuer Portal
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-400 border-t border-slate-800/80">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Immutable SHA-256 On-Chain</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Zero PII On-Chain (§11 Privacy)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Wallet-Free Public Verification</span>
                </div>
              </div>
            </div>

            {/* Right Column: Live Interactive Holographic 3D Card Preview */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <div className="text-center mb-2">
                <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400/80">
                  Interactive 3D Holographic Card • Tilt Mouse
                </span>
              </div>
              <HolographicCard3D
                id={sampleId}
                title="1st Place Winner — Global Web3 AI Hackathon"
                holderName="Alex Rivera"
                issuerName="ETHSF & Polygon Labs"
                credentialType="hackathon"
                issuedAt={new Date().toISOString()}
                credentialHash="4a9d721183c509539fbe54b5df16a7f85dc9eb3e85e507f3531b790d0ef093ac"
                isVerified={true}
                metadata={{
                  achievement: "1st Place Winner - Infrastructure Track",
                  eventName: "ETHSF 2026",
                  skills: ["Solidity", "TypeScript", "Three.js", "Zod", "Ethers.js"],
                }}
                onShowQR={() => setShowQR(true)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="border-t border-slate-800/80 bg-slate-950/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-white tracking-tight sm:text-4xl">
              Engineered for Authenticity & Privacy
            </h2>
            <p className="mt-4 text-base text-slate-400">
              Traditional certificates are easily forged. CertifiedPass combines Gemini AI document parsing with Polygon Amoy EVM anchoring for bulletproof credential verification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 mb-5 border border-cyan-500/20">
                <Cpu className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">AI Document Parsing</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Issuers upload certificates or spreadsheets. Gemini 1.5 Flash extracts structured achievement data, rigorously verified by strict Zod schemas before review.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 mb-5 border border-purple-500/20">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">On-Chain SHA-256 Anchor</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Only the cryptographic hash and metadata URI touch the smart contract. Full privacy compliance—no PII is ever leaked to the public blockchain.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 mb-5 border border-emerald-500/20">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Instant Public Verification</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Anyone can verify credentials by link or QR code without connecting a Web3 wallet, logging in, or needing prior blockchain knowledge.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* QR Code Modal for Preview Card */}
      <CredentialQRModal
        isOpen={showQR}
        onClose={() => setShowQR(false)}
        credentialId={sampleId}
        title="1st Place Winner — Global Web3 AI Hackathon"
      />
    </Layout>
  );
}

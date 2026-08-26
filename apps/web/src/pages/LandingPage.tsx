import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, ShieldCheck, Sparkles, Award, Search, ArrowRight, CheckCircle2, Lock, Cpu, Globe, QrCode, Check, Smartphone, Layers, Share2 } from "lucide-react";
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
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Copy & Quick Search */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="lg:col-span-7 space-y-6"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-indigo-50/80 px-3.5 py-1 text-xs font-semibold text-indigo-700 shadow-apple-sm">
                <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                Next-Gen Verifiable Credentials on Polygon Amoy
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-slate-900 leading-[1.1] font-display">
                Proof of What You’ve{" "}
                <span className="bg-gradient-to-r from-indigo-600 via-sky-600 to-cyan-500 bg-clip-text text-transparent">
                  Achieved.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed font-normal">
                Cryptographically verifiable digital passes for hackathons, internships, open-source milestones, and professional achievements. AI-parsed, blockchain-anchored, and verifiable by anyone worldwide via instant QR scan.
              </p>

              {/* Instant Verification Search Bar */}
              <div className="pt-2">
                <form onSubmit={handleVerifySubmit} className="flex max-w-lg gap-2 shadow-apple-sm rounded-2xl bg-white p-1.5 border border-slate-200/90">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Paste Credential ID or Hash to verify..."
                      value={searchId}
                      onChange={(e) => setSearchId(e.target.value)}
                      className="w-full rounded-xl border-0 bg-transparent pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-0"
                    />
                  </div>
                  <Button variant="primary" type="submit" size="sm" className="rounded-xl px-5">
                    Verify
                  </Button>
                </form>

                <div className="mt-2.5 flex items-center gap-2 text-xs text-slate-500">
                  <span>Try demo:</span>
                  <button
                    onClick={() => navigate(`/c/${sampleId}`)}
                    className="font-mono text-indigo-600 font-medium hover:underline hover:text-indigo-700"
                  >
                    {sampleId}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link to="/verify">
                  <Button variant="cyan" size="lg" className="gap-2 shadow-apple-sm">
                    Universal Verifier <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/issuer">
                  <Button variant="outline" size="lg" className="shadow-apple-sm">
                    Issuer Portal
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-500 border-t border-slate-200/80">
                <div className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Immutable SHA-256 On-Chain</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Zero PII On-Chain (§11 Privacy)</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Wallet-Free Public Verification</span>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Physical Digital Pass Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="lg:col-span-5 flex flex-col items-center justify-center"
            >
              <div className="w-full">
                <div className="text-center mb-3">
                  <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-400 flex items-center justify-center gap-1.5">
                    <QrCode className="h-3.5 w-3.5 text-indigo-600" />
                    Interactive Digital Pass • Live QR Scan
                  </span>
                </div>

                <HolographicCard3D
                  id={sampleId}
                  title="1st Place Winner — Global Web3 AI Hackathon"
                  holderName="Alex Rivera"
                  issuerName="ETHSF & Polygon Labs"
                  credentialType="hackathon"
                  issuedAt="2026-08-26T00:00:00Z"
                  credentialHash="4a9d7211a729e2f47a6d89201948ba5c189e4726d910f093ac612847a6e78912"
                  status="ACTIVE"
                  isVerified={true}
                  metadata={{
                    placement: "1st Place Winner",
                    track: "Infrastructure Track",
                    skills: ["Solidity", "TypeScript", "Three.js", "Zod"],
                  }}
                  onShowQR={() => setShowQR(true)}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3-Pillar Value Proposition (Apple-Style Minimalist Grid) */}
      <section className="py-20 bg-slate-50/70 border-y border-slate-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 font-display">
              Built for Absolute Trust
            </h2>
            <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 font-display">
              Engineered for Authenticity & Privacy
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Traditional certificates are static and easily forged. CertifiedPass combines Gemini AI document intelligence with Polygon Amoy EVM anchoring for bulletproof credential verification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1: AI Document Parsing */}
            <motion.div
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 16 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="rounded-3xl border border-slate-200/90 bg-white p-8 shadow-apple-sm hover:shadow-apple-md transition-all space-y-4"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <Cpu className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 font-display">AI Document Extraction</h4>
              <p className="text-sm text-slate-500 leading-relaxed">
                Issuers upload certificates, badges, or CSV rosters. Gemini 1.5 Flash extracts structured metadata, validated by strict Zod schemas before on-chain hashing.
              </p>
            </motion.div>

            {/* Feature 2: On-Chain SHA-256 Anchoring */}
            <motion.div
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 16 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="rounded-3xl border border-slate-200/90 bg-white p-8 shadow-apple-sm hover:shadow-apple-md transition-all space-y-4"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
                <Lock className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 font-display">Zero-PII On-Chain Anchor</h4>
              <p className="text-sm text-slate-500 leading-relaxed">
                Only the cryptographic SHA-256 digest touches the Polygon Amoy smart contract. Full privacy compliance—no names, emails, or personal data are ever leaked on-chain.
              </p>
            </motion.div>

            {/* Feature 3: Global Public Verification */}
            <motion.div
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 16 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="rounded-3xl border border-slate-200/90 bg-white p-8 shadow-apple-sm hover:shadow-apple-md transition-all space-y-4"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <Globe className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 font-display">Instant Public Scan</h4>
              <p className="text-sm text-slate-500 leading-relaxed">
                Recruiters, judges, and verifiers worldwide scan the physical QR code with any phone camera—no wallet connection, login, or blockchain experience required.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Connects: Issuers, Receivers, and Verifiers */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-indigo-600 font-display">
              End-to-End Ecosystem
            </h2>
            <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 font-display">
              How CertifiedPass Connects Everyone
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1: For Issuers */}
            <div className="rounded-3xl border border-slate-200/80 bg-slate-50/50 p-7 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider">
                <Award className="h-4 w-4" />
                <span>1. Issuers</span>
              </div>
              <h4 className="text-base font-bold text-slate-900">Upload & Issue in Batches</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Hackathon organizers, universities, and companies connect their EVM wallet, let AI parse the rosters, and anchor immutable credentials with 1 transaction.
              </p>
              <div className="pt-2">
                <Link to="/issuer" className="text-xs font-semibold text-indigo-600 hover:underline">
                  Launch Issuer Portal →
                </Link>
              </div>
            </div>

            {/* Step 2: For Receivers / Holders */}
            <div className="rounded-3xl border border-slate-200/80 bg-slate-50/50 p-7 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-sky-600 uppercase tracking-wider">
                <Layers className="h-4 w-4" />
                <span>2. Receivers (Holders)</span>
              </div>
              <h4 className="text-base font-bold text-slate-900">Own & Share Proof Profiles</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Holders collect credentials in their wallet, display digital passes, share 1-click LinkedIn badges, and embed verified badges on GitHub & portfolios.
              </p>
              <div className="pt-2">
                <Link to="/dashboard" className="text-xs font-semibold text-sky-600 hover:underline">
                  View Holder Portal →
                </Link>
              </div>
            </div>

            {/* Step 3: For Verifiers */}
            <div className="rounded-3xl border border-slate-200/80 bg-slate-50/50 p-7 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider">
                <ShieldCheck className="h-4 w-4" />
                <span>3. Verifiers</span>
              </div>
              <h4 className="text-base font-bold text-slate-900">Zero-Friction Scan & Audit</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Anyone scans the QR code or pastes the ID into the universal verifier to verify SHA-256 hash match against the Polygon Amoy registry in real-time.
              </p>
              <div className="pt-2">
                <Link to="/verify" className="text-xs font-semibold text-emerald-600 hover:underline">
                  Open Public Verifier →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QR Modal */}
      <CredentialQRModal
        isOpen={showQR}
        onClose={() => setShowQR(false)}
        credentialId={sampleId}
        title="1st Place Winner — Global Web3 AI Hackathon"
      />
    </Layout>
  );
}

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Sparkles,
  Award,
  Search,
  ArrowRight,
  CheckCircle2,
  Lock,
  Cpu,
  Globe,
  QrCode,
  Layers,
} from "lucide-react";
import { Layout } from "../components/layout/Layout.js";
import { Button } from "../components/ui/Button.js";
import { HolographicCard3D } from "../components/credential/HolographicCard3D.js";
import { CredentialQRModal } from "../components/credential/CredentialQRModal.js";

export default function LandingPage() {
  const navigate = useNavigate();
  const [searchId, setSearchId] = useState("");
  const [showQR, setShowQR] = useState(false);

  const [isVerifying, setIsVerifying] = useState(false);

  const sampleId = "cp-hackathon-2026-ethsf";

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchId.trim()) {
      setIsVerifying(true);
      setTimeout(() => {
        navigate(`/c/${encodeURIComponent(searchId.trim())}`);
      }, 400);
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Copy & Quick Search */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="lg:col-span-7 space-y-6"
            >
              <div className="inline-flex items-center gap-2 rounded-full neo-raised-sm bg-[var(--surface-bg)] px-4 py-1.5 text-xs font-bold text-[var(--brand-indigo)]">
                <Sparkles className="h-3.5 w-3.5 text-[var(--brand-indigo)] animate-pulse-glow" />
                Next-Gen Verifiable Credentials on Polygon Amoy
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-[var(--text-primary)] leading-[1.1] font-display">
                Proof of What You’ve{" "}
                <span className="gradient-text-animated">
                  Achieved.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-2xl leading-relaxed font-normal">
                Cryptographically verifiable digital passes for hackathons, internships, open-source milestones, and professional achievements. AI-parsed, blockchain-anchored, and verifiable by anyone worldwide via instant QR scan.
              </p>

              {/* Instant Verification Search Bar */}
              <div className="pt-2">
                <form
                  onSubmit={handleVerifySubmit}
                  className="flex max-w-lg items-center gap-2 neo-inset neo-input-glow rounded-2xl p-2 bg-[var(--surface-bg)] transition-all"
                >
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)]" />
                    <input
                      type="text"
                      placeholder="Paste Credential ID or Hash to verify..."
                      value={searchId}
                      onChange={(e) => setSearchId(e.target.value)}
                      className="w-full rounded-xl border-0 bg-transparent pl-10 pr-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none"
                    />
                  </div>
                  <Button
                    variant="primary"
                    type="submit"
                    size="sm"
                    isLoading={isVerifying}
                    className="rounded-full px-5 gap-1.5 group"
                  >
                    {!isVerifying && (
                      <>
                        <span>Verify</span>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-2.5 flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                  <span>Try demo:</span>
                  <button
                    onClick={() => {
                      setSearchId(sampleId);
                      navigate(`/c/${sampleId}`);
                    }}
                    className="font-mono text-[var(--brand-from)] font-bold hover:underline"
                  >
                    {sampleId}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link to="/verify">
                  <Button variant="primary" size="lg" className="group gap-2 rounded-full px-7">
                    <span>Universal Verifier</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link to="/issuer">
                  <Button variant="secondary" size="lg" className="rounded-full px-7">
                    Issuer Portal
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-[var(--text-secondary)] border-t border-[var(--shadow-dark)]/10">
                <div className="flex items-center gap-1.5 font-semibold">
                  <CheckCircle2 className="h-4 w-4 text-[var(--accent-green)]" />
                  <span>Immutable SHA-256 On-Chain</span>
                </div>
                <div className="flex items-center gap-1.5 font-semibold">
                  <CheckCircle2 className="h-4 w-4 text-[var(--accent-green)]" />
                  <span>Zero PII On-Chain (§11 Privacy)</span>
                </div>
                <div className="flex items-center gap-1.5 font-semibold">
                  <CheckCircle2 className="h-4 w-4 text-[var(--accent-green)]" />
                  <span>Wallet-Free Public Verification</span>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Physical Digital Pass Preview (Neomorphic Showpiece) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
              className="lg:col-span-5 flex flex-col items-center justify-center animate-float-gentle"
            >
              <div className="w-full">
                <div className="text-center mb-3">
                  <span className="neo-raised-sm inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)] bg-[var(--surface-bg)]">
                    <QrCode className="h-3.5 w-3.5 text-[var(--brand-indigo)] animate-pulse-glow" />
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

      {/* 3-Pillar Value Proposition (Neomorphic Soft Grid) */}
      <section className="py-20 bg-[var(--surface-bg)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--brand-indigo)] font-display">
              Built for Absolute Trust
            </h2>
            <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)] font-display">
              Engineered for Authenticity & Privacy
            </h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
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
              className="rounded-[24px] neo-raised bg-[var(--surface-bg)] p-8 space-y-4 hover:scale-[1.02] transition-all"
            >
              <div className="neo-raised-sm flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent-indigo-bg)] text-[var(--accent-indigo)]">
                <Cpu className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold text-[var(--text-primary)] font-display">AI Document Extraction</h4>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Issuers upload certificates, badges, or CSV rosters. Gemini 1.5 Flash extracts structured metadata, validated by strict Zod schemas before on-chain hashing.
              </p>
            </motion.div>

            {/* Feature 2: On-Chain SHA-256 Anchoring */}
            <motion.div
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 16 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="rounded-[24px] neo-raised bg-[var(--surface-bg)] p-8 space-y-4 hover:scale-[1.02] transition-all"
            >
              <div className="neo-raised-sm flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent-blue-bg)] text-[var(--accent-blue)]">
                <Lock className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold text-[var(--text-primary)] font-display">Zero-PII On-Chain Anchor</h4>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Only the cryptographic SHA-256 digest touches the Polygon Amoy smart contract. Full privacy compliance—no names, emails, or personal data are ever leaked on-chain.
              </p>
            </motion.div>

            {/* Feature 3: Global Public Verification */}
            <motion.div
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 16 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="rounded-[24px] neo-raised bg-[var(--surface-bg)] p-8 space-y-4 hover:scale-[1.02] transition-all"
            >
              <div className="neo-raised-sm flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent-green-bg)] text-[var(--accent-green)]">
                <Globe className="h-6 w-6" />
              </div>
              <h4 className="text-lg font-bold text-[var(--text-primary)] font-display">Instant Public Scan</h4>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Recruiters, judges, and verifiers worldwide scan the physical QR code with any phone camera—no wallet connection, login, or blockchain experience required.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Connects: Issuers, Receivers, and Verifiers */}
      <section className="py-20 bg-[var(--surface-bg)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--brand-indigo)] font-display">
              End-to-End Ecosystem
            </h2>
            <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-primary)] font-display">
              How CertifiedPass Connects Everyone
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1: For Issuers */}
            <div className="rounded-[24px] neo-raised bg-[var(--surface-bg)] p-7 space-y-3 hover:scale-[1.01] transition-all">
              <div className="flex items-center gap-2 text-xs font-bold text-[var(--brand-indigo)] uppercase tracking-wider">
                <Award className="h-4 w-4" />
                <span>1. Issuers</span>
              </div>
              <h4 className="text-base font-bold text-[var(--text-primary)]">Upload & Issue in Batches</h4>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Hackathon organizers, universities, and companies connect their EVM wallet, let AI parse the rosters, and anchor immutable credentials with 1 transaction.
              </p>
              <div className="pt-2">
                <Link to="/issuer" className="text-xs font-bold text-[var(--brand-indigo)] hover:underline">
                  Launch Issuer Portal →
                </Link>
              </div>
            </div>

            {/* Step 2: For Receivers / Holders */}
            <div className="rounded-[24px] neo-raised bg-[var(--surface-bg)] p-7 space-y-3 hover:scale-[1.01] transition-all">
              <div className="flex items-center gap-2 text-xs font-bold text-[var(--accent-blue)] uppercase tracking-wider">
                <Layers className="h-4 w-4" />
                <span>2. Receivers (Holders)</span>
              </div>
              <h4 className="text-base font-bold text-[var(--text-primary)]">Own & Share Proof Profiles</h4>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Holders collect credentials in their wallet, display digital passes, share 1-click LinkedIn badges, and embed verified badges on GitHub & portfolios.
              </p>
              <div className="pt-2">
                <Link to="/dashboard" className="text-xs font-bold text-[var(--accent-blue)] hover:underline">
                  View Holder Portal →
                </Link>
              </div>
            </div>

            {/* Step 3: For Verifiers */}
            <div className="rounded-[24px] neo-raised bg-[var(--surface-bg)] p-7 space-y-3 hover:scale-[1.01] transition-all">
              <div className="flex items-center gap-2 text-xs font-bold text-[var(--accent-green)] uppercase tracking-wider">
                <ShieldCheck className="h-4 w-4" />
                <span>3. Verifiers</span>
              </div>
              <h4 className="text-base font-bold text-[var(--text-primary)]">Zero-Friction Scan & Audit</h4>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Anyone scans the QR code or pastes the ID into the universal verifier to verify SHA-256 hash match against the Polygon Amoy registry in real-time.
              </p>
              <div className="pt-2">
                <Link to="/verify" className="text-xs font-bold text-[var(--accent-green)] hover:underline">
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

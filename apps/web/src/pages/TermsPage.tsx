import React from "react";
import { Link } from "react-router-dom";
import {
  Scale,
  FileCheck,
  ShieldCheck,
  AlertTriangle,
  Award,
  Lock,
  ArrowLeft,
  CheckCircle2,
  Cpu,
  Mail,
} from "lucide-react";
import { Layout } from "../components/layout/Layout.js";

export default function TermsPage() {
  const lastUpdated = "October 3, 2026";

  return (
    <Layout>
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8 text-[var(--text-primary)]">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-8 transition-colors font-bold group"
        >
          <div className="neo-icon-btn h-7 w-7 group-hover:-translate-x-0.5 transition-transform">
            <ArrowLeft className="h-3.5 w-3.5" />
          </div>
          <span>Back to Home</span>
        </Link>

        {/* Hero Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-black text-[var(--brand-indigo)] bg-indigo-500/10 border border-indigo-500/20 neo-inset-sm">
            <Scale className="h-4 w-4" />
            <span>LEGAL & PROTOCOL FRAMEWORK</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[var(--text-primary)] font-display tracking-tight">
            Terms & Conditions of Service
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-2xl mx-auto font-medium leading-relaxed">
            Please read these terms carefully before accessing or issuing credentials on the CertifiedPass protocol and platform.
          </p>
          <p className="text-xs font-mono font-bold text-[var(--text-secondary)]">
            Effective Date: {lastUpdated} | Domain: certifiedpass.polylance.codes
          </p>
        </div>

        {/* Core Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="neo-raised p-6 rounded-3xl bg-[var(--surface-bg)] border border-[var(--neo-outline)]/40 space-y-3">
            <div className="h-10 w-10 rounded-2xl neo-inset-sm bg-blue-500/10 text-[var(--accent-blue)] flex items-center justify-center font-bold">
              <Award className="h-5 w-5" />
            </div>
            <h3 className="text-base font-extrabold font-display">Issuer Accountability</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium">
              Issuing organizations represent and warrant that all issued achievements, grades, milestone completions, and badges reflect legitimate participant achievements.
            </p>
          </div>

          <div className="neo-raised p-6 rounded-3xl bg-[var(--surface-bg)] border border-[var(--neo-outline)]/40 space-y-3">
            <div className="h-10 w-10 rounded-2xl neo-inset-sm bg-indigo-500/10 text-[var(--brand-indigo)] flex items-center justify-center font-bold">
              <Lock className="h-5 w-5" />
            </div>
            <h3 className="text-base font-extrabold font-display">Non-Transferability</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium">
              ERC-5192 Soulbound Credentials and achievement attestations are bound to the designated recipient wallet and cannot be sold, rented, or transferred.
            </p>
          </div>

          <div className="neo-raised p-6 rounded-3xl bg-[var(--surface-bg)] border border-[var(--neo-outline)]/40 space-y-3">
            <div className="h-10 w-10 rounded-2xl neo-inset-sm bg-emerald-500/10 text-[var(--accent-green)] flex items-center justify-center font-bold">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-base font-extrabold font-display">Public Verifiability</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium">
              Verifiers may inspect cryptographic proof, EIP-712 signatures, and on-chain blockchain hashes without requiring a wallet login or paying fees.
            </p>
          </div>
        </div>

        {/* Detailed Legal Clauses */}
        <div className="space-y-8 bg-[var(--surface-bg)] neo-raised p-6 sm:p-10 rounded-3xl border border-[var(--neo-outline)]/50 text-sm leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl font-extrabold text-[var(--text-primary)] font-display flex items-center gap-2">
              <span className="text-[var(--brand-indigo)]">1.</span> Acceptance of Terms
            </h2>
            <p className="text-[var(--text-secondary)]">
              By accessing <code className="font-mono text-xs font-bold text-[var(--text-primary)]">certifiedpass.polylance.codes</code>, connecting a Web3 wallet, or utilizing our issuance APIs, smart contracts, or verifiers, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, do not use the service.
            </p>
          </section>

          <hr className="border-[var(--neo-outline)]/40" />

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-xl font-extrabold text-[var(--text-primary)] font-display flex items-center gap-2">
              <span className="text-[var(--brand-indigo)]">2.</span> Decentralized Protocol & Smart Contracts
            </h2>
            <p className="text-[var(--text-secondary)]">
              CertifiedPass provides web interfaces and decentralized smart contracts on the Polygon network (including Polygon Amoy Testnet and Polygon PoS Mainnet). You acknowledge that:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-[var(--text-secondary)]">
              <li>Transactions submitted to the blockchain are irreversible and execute autonomously according to smart contract code.</li>
              <li>You are solely responsible for securing your wallet private keys and approving on-chain transactions.</li>
              <li>Gas fees required for on-chain anchoring are determined by network validators and network congestion.</li>
            </ul>
          </section>

          <hr className="border-[var(--neo-outline)]/40" />

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-xl font-extrabold text-[var(--text-primary)] font-display flex items-center gap-2">
              <span className="text-[var(--brand-indigo)]">3.</span> Permissible Use & Prohibited Activities
            </h2>
            <p className="text-[var(--text-secondary)]">
              Users agree not to engage in any of the following prohibited behaviors:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-[var(--text-secondary)]">
              <li>Issuing fraudulent, forged, or unauthorized credentials misrepresenting affiliations with universities, enterprises, or government bodies.</li>
              <li>Attempting to attack, reverse-engineer, exploit vulnerabilities, or flood rate limits on verification APIs.</li>
              <li>Using credentials for deceptive hiring or illegal credential-lending schemes.</li>
            </ul>
          </section>

          <hr className="border-[var(--neo-outline)]/40" />

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-xl font-extrabold text-[var(--text-primary)] font-display flex items-center gap-2">
              <span className="text-[var(--brand-indigo)]">4.</span> Revocation & Cryptographic Auditing
            </h2>
            <p className="text-[var(--text-secondary)]">
              Issuers retain the right to revoke credentials in cases of academic integrity violations, credential fraud, or terms breach. Revocations are anchored transparently with a cryptographic reason digest visible on the Universal Verifier.
            </p>
          </section>

          <hr className="border-[var(--neo-outline)]/40" />

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-xl font-extrabold text-[var(--text-primary)] font-display flex items-center gap-2">
              <span className="text-[var(--brand-indigo)]">5.</span> PolyLance Protocol Collaboration
            </h2>
            <p className="text-[var(--text-secondary)]">
              PolyLance Milestone Attestations (<code className="font-mono text-xs font-bold text-[var(--text-primary)]">PL-SBT-*</code> and <code className="font-mono text-xs font-bold text-[var(--text-primary)]">PL-AUD-*</code>) are cryptographically validated against the PolyLance Sovereign Ledger (<code className="font-mono text-xs font-bold text-[var(--text-primary)]">polylance.codes</code>) and escrow settlement oracles. CertifiedPass acts as an independent cryptographic verification oracle.
            </p>
          </section>

          <hr className="border-[var(--neo-outline)]/40" />

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-xl font-extrabold text-[var(--text-primary)] font-display flex items-center gap-2">
              <span className="text-[var(--brand-indigo)]">6.</span> Limitation of Liability
            </h2>
            <p className="text-[var(--text-secondary)]">
              CertifiedPass is provided on an "as-is" and "as-available" basis. In no event shall CertifiedPass or its contributors be liable for any indirect, incidental, or consequential damages arising from smart contract interactions, network outages, or third-party credential representations.
            </p>
          </section>

          <hr className="border-[var(--neo-outline)]/40" />

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="text-xl font-extrabold text-[var(--text-primary)] font-display flex items-center gap-2">
              <span className="text-[var(--brand-indigo)]">7.</span> Contact & Inquiries
            </h2>
            <p className="text-[var(--text-secondary)]">
              For legal questions, licensing inquiries, or enterprise terms agreements, please contact:
            </p>
            <div className="flex items-center gap-3 p-4 rounded-2xl neo-inset-sm bg-[var(--surface-bg)] w-fit">
              <Mail className="h-5 w-5 text-[var(--brand-indigo)]" />
              <span className="font-mono text-xs sm:text-sm font-bold text-[var(--text-primary)]">
                legal@certifiedpass.polylance.codes
              </span>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}

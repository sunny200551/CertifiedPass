import React from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Lock,
  EyeOff,
  Database,
  Key,
  Cpu,
  FileCheck2,
  Scale,
  Sparkles,
  ArrowLeft,
  Mail,
  CheckCircle2,
  Layers,
} from "lucide-react";
import { Layout } from "../components/layout/Layout.js";

export default function PrivacyPage() {
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
            <ShieldCheck className="h-4 w-4" />
            <span>CRYPTOGRAPHIC PRIVACY FIRST</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[var(--text-primary)] font-display tracking-tight">
            CertifiedPass Privacy Policy
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-2xl mx-auto font-medium leading-relaxed">
            We believe verifiable achievements should never compromise personal privacy. Learn how CertifiedPass implements Zero-PII on-chain anchoring, canonical cryptographic hashing, and sovereign data self-custody.
          </p>
          <p className="text-xs font-mono font-bold text-[var(--text-secondary)]">
            Effective Date: {lastUpdated} | Version 2.0 (EIP-712 / ERC-5192)
          </p>
        </div>

        {/* Privacy Guarantees Highlight Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="neo-raised p-6 rounded-3xl bg-[var(--surface-bg)] border border-[var(--neo-outline)]/40 space-y-3">
            <div className="h-10 w-10 rounded-2xl neo-inset-sm bg-indigo-500/10 text-[var(--brand-indigo)] flex items-center justify-center font-bold">
              <EyeOff className="h-5 w-5" />
            </div>
            <h3 className="text-base font-extrabold font-display">Zero-PII On-Chain</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium">
              We never store cleartext Personally Identifiable Information (such as government IDs, phone numbers, or private emails) on public blockchains. Only SHA-256 integrity digests are anchored on-chain.
            </p>
          </div>

          <div className="neo-raised p-6 rounded-3xl bg-[var(--surface-bg)] border border-[var(--neo-outline)]/40 space-y-3">
            <div className="h-10 w-10 rounded-2xl neo-inset-sm bg-purple-500/10 text-[var(--accent-purple)] flex items-center justify-center font-bold">
              <Key className="h-5 w-5" />
            </div>
            <h3 className="text-base font-extrabold font-display">Self-Sovereign Identity</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium">
              Credential holders maintain complete ownership of their digital attestations. You decide which credentials to share, display on your profile, or export to Apple & Google Wallets.
            </p>
          </div>

          <div className="neo-raised p-6 rounded-3xl bg-[var(--surface-bg)] border border-[var(--neo-outline)]/40 space-y-3">
            <div className="h-10 w-10 rounded-2xl neo-inset-sm bg-emerald-500/10 text-[var(--accent-green)] flex items-center justify-center font-bold">
              <Lock className="h-5 w-5" />
            </div>
            <h3 className="text-base font-extrabold font-display">EIP-712 Signatures</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium">
              Issuance and verification utilize typed cryptographic signatures. The signature verifies authenticity directly from verified issuer wallets without requiring centralized intermediaries.
            </p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-8 bg-[var(--surface-bg)] neo-raised p-6 sm:p-10 rounded-3xl border border-[var(--neo-outline)]/50 text-sm leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-xl font-extrabold text-[var(--text-primary)] font-display flex items-center gap-2">
              <span className="text-[var(--brand-indigo)]">1.</span> Information We Collect and Process
            </h2>
            <p className="text-[var(--text-secondary)]">
              CertifiedPass provides decentralized verifiable credential infrastructure. The types of data we process depend on your interaction with the platform:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-[var(--text-secondary)]">
              <li>
                <strong className="text-[var(--text-primary)]">Public Web3 Wallet Addresses:</strong> When connecting MetaMask, Rainbow, or other Web3 wallets, we record your public Ethereum/Polygon address to associate issued credentials and sovereign badges.
              </li>
              <li>
                <strong className="text-[var(--text-primary)]">Credential Metadata:</strong> Information necessary to substantiate the achievement, including recipient name or pseudonym, issuing organization name, event/hackathon title, skills demonstrated, and date of issuance.
              </li>
              <li>
                <strong className="text-[var(--text-primary)]">Cryptographic Hashes & Signatures:</strong> Computed SHA-256 canonical representations and EIP-712 signatures submitted to the Polygon Amoy & Mainnet blockchain registry.
              </li>
              <li>
                <strong className="text-[var(--text-primary)]">PolyLance Settlement Attestations:</strong> For PolyLance collaborative milestones, cryptographic escrow audit hashes, milestone identifiers, and escrow contract references are stored for public verification.
              </li>
            </ul>
          </section>

          <hr className="border-[var(--neo-outline)]/40" />

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-xl font-extrabold text-[var(--text-primary)] font-display flex items-center gap-2">
              <span className="text-[var(--brand-indigo)]">2.</span> How Cryptographic Hashing Protects Your Data
            </h2>
            <p className="text-[var(--text-secondary)]">
              CertifiedPass converts credential metadata into a normalized Canonical JSON format and calculates a 256-bit cryptographic digest (<code className="font-mono px-1.5 py-0.5 rounded bg-[var(--surface-bg)] neo-inset-sm font-bold">SHA-256</code>).
            </p>
            <p className="text-[var(--text-secondary)]">
              This one-way mathematical function guarantees that anyone with the original certificate can verify its authenticity and tamper-free status against the on-chain anchor, while third parties observing the blockchain cannot reverse-engineer personal or sensitive cleartext data.
            </p>
          </section>

          <hr className="border-[var(--neo-outline)]/40" />

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-xl font-extrabold text-[var(--text-primary)] font-display flex items-center gap-2">
              <span className="text-[var(--brand-indigo)]">3.</span> IPFS & Decentralized Storage
            </h2>
            <p className="text-[var(--text-secondary)]">
              When decentralized IPFS pinning is enabled by the issuer, non-sensitive credential schemas and badge graphical assets are pinned to IPFS nodes. Personal contact details are excluded from publicly pinned IPFS schemas.
            </p>
          </section>

          <hr className="border-[var(--neo-outline)]/40" />

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-xl font-extrabold text-[var(--text-primary)] font-display flex items-center gap-2">
              <span className="text-[var(--brand-indigo)]">4.</span> Cookies & Local Storage
            </h2>
            <p className="text-[var(--text-secondary)]">
              CertifiedPass uses client-side <code className="font-mono px-1.5 py-0.5 rounded bg-[var(--surface-bg)] neo-inset-sm font-bold">localStorage</code> exclusively for:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-[var(--text-secondary)]">
              <li>Persisting your theme preference (Light / Dark mode).</li>
              <li>Maintaining active decentralized credential drafts in the Issuer Studio.</li>
              <li>Storing optional user profile display preferences.</li>
            </ul>
            <p className="text-[var(--text-secondary)]">
              We do not utilize invasive third-party cross-site advertising trackers or analytics cookies.
            </p>
          </section>

          <hr className="border-[var(--neo-outline)]/40" />

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-xl font-extrabold text-[var(--text-primary)] font-display flex items-center gap-2">
              <span className="text-[var(--brand-indigo)]">5.</span> Rights of Holders & GDPR / CCPA Compliance
            </h2>
            <p className="text-[var(--text-secondary)]">
              Under applicable privacy regulations (including GDPR and CCPA), you have the right to request access to, rectification of, or deletion of your off-chain server data. While blockchain transaction records are immutable by design, you may request unlinking or marking off-chain directory listings as private at any time.
            </p>
          </section>

          <hr className="border-[var(--neo-outline)]/40" />

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-xl font-extrabold text-[var(--text-primary)] font-display flex items-center gap-2">
              <span className="text-[var(--brand-indigo)]">6.</span> Contact Our Privacy Officer
            </h2>
            <p className="text-[var(--text-secondary)]">
              If you have any questions or data privacy inquiries regarding CertifiedPass, reach out to our team at:
            </p>
            <div className="flex items-center gap-3 p-4 rounded-2xl neo-inset-sm bg-[var(--surface-bg)] w-fit">
              <Mail className="h-5 w-5 text-[var(--brand-indigo)]" />
              <span className="font-mono text-xs sm:text-sm font-bold text-[var(--text-primary)]">
                privacy@certifiedpass.polylance.codes
              </span>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}

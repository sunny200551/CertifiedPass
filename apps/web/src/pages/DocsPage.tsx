import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Code2,
  Terminal,
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles,
  Search,
  ExternalLink,
  Copy,
  Check,
  ArrowRight,
  ArrowLeft,
  Key,
  FileCheck2,
  FileSpreadsheet,
  QrCode,
  Zap,
} from "lucide-react";
import { Layout } from "../components/layout/Layout.js";

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState<
    "overview" | "crypto" | "api" | "soulbound" | "batch" | "polylance" | "contracts"
  >("overview");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const navItems = [
    { id: "overview", label: "Protocol Overview", icon: BookOpen },
    { id: "crypto", label: "Cryptographic Architecture", icon: ShieldCheck },
    { id: "api", label: "REST & Verification APIs", icon: Terminal },
    { id: "soulbound", label: "ERC-5192 Soulbound Tokens", icon: Layers },
    { id: "batch", label: "Batch & AI Issuance Engine", icon: Sparkles },
    { id: "polylance", label: "PolyLance Cross-Verification", icon: FileCheck2 },
    { id: "contracts", label: "Polygon Smart Contracts", icon: Code2 },
  ];

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 text-[var(--text-primary)]">
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
            <Terminal className="h-4 w-4" />
            <span>DEVELOPER & PROTOCOL DOCUMENTATION</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[var(--text-primary)] font-display tracking-tight">
            CertifiedPass Protocol Docs
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-2xl mx-auto font-medium leading-relaxed">
            The developer handbook for verifiable credentials, cryptographic hashing, EIP-712 typing, and sovereign attestation APIs.
          </p>
        </div>

        {/* Documentation Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar Nav */}
          <aside className="lg:col-span-4 space-y-2 sticky top-24">
            <div className="p-3 bg-[var(--surface-bg)] neo-raised rounded-3xl border border-[var(--neo-outline)]/40 space-y-1">
              <span className="px-3 py-1.5 text-[11px] font-black uppercase tracking-wider text-[var(--text-secondary)] block">
                Table of Contents
              </span>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id as any)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all text-left ${
                      isActive
                        ? "neo-pill-active text-[var(--brand-indigo)] bg-[var(--surface-bg)] shadow-sm"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-bg)]/60"
                    }`}
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-[var(--brand-indigo)]" : ""}`} />
                    <span className="flex-1">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick API Stat Pill */}
            <div className="p-5 bg-[var(--surface-bg)] neo-raised rounded-3xl border border-[var(--neo-outline)]/40 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[var(--accent-green)]">
                <span className="h-2 w-2 rounded-full bg-[var(--accent-green)] animate-pulse-glow" />
                <span>API Gateway Live (v1)</span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Public verification endpoints require <strong>zero authentication</strong> and support full CORS for integration into employer portals and ATS pipelines.
              </p>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-8 bg-[var(--surface-bg)] neo-raised p-6 sm:p-10 rounded-3xl border border-[var(--neo-outline)]/50 space-y-8">
            {/* Section: Overview */}
            {activeSection === "overview" && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center gap-3 border-b border-[var(--neo-outline)]/40 pb-4">
                  <div className="h-10 w-10 rounded-2xl neo-inset-sm bg-indigo-500/10 text-[var(--brand-indigo)] flex items-center justify-center font-bold">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black font-display text-[var(--text-primary)]">
                      Protocol Overview
                    </h2>
                    <p className="text-xs text-[var(--text-secondary)] font-medium">
                      High-level architectural structure of CertifiedPass
                    </p>
                  </div>
                </div>

                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  CertifiedPass is an open cryptographic credentialing protocol built on the <strong>Polygon EVM</strong> network. It bridges off-chain digital achievements (hackathon wins, course completions, community bounties, and employment milestones) with on-chain verifiable trust anchors.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl neo-inset-sm bg-[var(--surface-bg)] space-y-2">
                    <span className="text-xs font-black text-[var(--brand-indigo)] font-display uppercase tracking-wider block">
                      1. Canonical Issuance
                    </span>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      Credentials are structured into deterministic Canonical JSON schemas and hashed with SHA-256 before anchoring.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl neo-inset-sm bg-[var(--surface-bg)] space-y-2">
                    <span className="text-xs font-black text-[var(--accent-purple)] font-display uppercase tracking-wider block">
                      2. On-Chain Registry
                    </span>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      Polygon Amoy & PoS smart contracts record the 32-byte credential digest, issuer address, and revocation bit.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl neo-inset-sm bg-[var(--surface-bg)] space-y-2">
                    <span className="text-xs font-black text-[var(--accent-green)] font-display uppercase tracking-wider block">
                      3. Zero-Knowledge Verifier
                    </span>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      Anyone can verify cryptographic validity via URL, QR scan, or API without exposing private recipient records.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl neo-inset-sm bg-[var(--surface-bg)] space-y-2">
                    <span className="text-xs font-black text-[var(--accent-cyan)] font-display uppercase tracking-wider block">
                      4. PolyLance Collaboration
                    </span>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      Native cross-verification of PolyLance escrow milestones, audit proofs, and settled payments.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Section: Cryptographic Architecture */}
            {activeSection === "crypto" && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center gap-3 border-b border-[var(--neo-outline)]/40 pb-4">
                  <div className="h-10 w-10 rounded-2xl neo-inset-sm bg-purple-500/10 text-[var(--accent-purple)] flex items-center justify-center font-bold">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black font-display text-[var(--text-primary)]">
                      Cryptographic Hashing & Integrity
                    </h2>
                    <p className="text-xs text-[var(--text-secondary)] font-medium">
                      Canonical JSON RFC 8785 & SHA-256 integrity verification
                    </p>
                  </div>
                </div>

                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  To eliminate key-ordering discrepancies across different languages (JavaScript, Python, Go, Solidity), CertifiedPass adheres to strict <strong>RFC 8785 JSON Canonicalization Scheme (JCS)</strong>.
                </p>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[var(--text-secondary)]">
                    <span>Canonical Credential Schema Structure</span>
                    <button
                      onClick={() => handleCopy(`{\n  "id": "cp-8f92a104-e1b9",\n  "credentialType": "hackathon",\n  "issuerAddress": "0x51E2a819bA4F5b6c891e4a3F12c6a4F69B88793B",\n  "holderAddress": "0xce1376c2272E5a56bB1A2bC0c3298a0F916b7D99",\n  "issuedAt": "2026-10-03T12:00:00.000Z",\n  "metadata": {\n    "title": "Polygon Global AI Hackathon",\n    "achievement": "1st Place Winner",\n    "skills": ["Solidity", "AI Agentic Workflows", "Polygon PoS"]\n  },\n  "schemaVersion": 1\n}`, "canonical_schema")}
                      className="flex items-center gap-1 text-[var(--brand-indigo)] hover:underline font-mono text-[11px]"
                    >
                      {copiedKey === "canonical_schema" ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedKey === "canonical_schema" ? "Copied" : "Copy JSON"}</span>
                    </button>
                  </div>
                  <pre className="p-4 rounded-2xl bg-[var(--surface-bg)] neo-inset-sm font-mono text-xs overflow-x-auto text-[var(--text-primary)]">
{`{
  "id": "cp-8f92a104-e1b9",
  "credentialType": "hackathon",
  "issuerAddress": "0x51E2a819bA4F5b6c891e4a3F12c6a4F69B88793B",
  "holderAddress": "0xce1376c2272E5a56bB1A2bC0c3298a0F916b7D99",
  "issuedAt": "2026-10-03T12:00:00.000Z",
  "metadata": {
    "title": "Polygon Global AI Hackathon",
    "achievement": "1st Place Winner",
    "skills": ["Solidity", "AI Agentic Workflows", "Polygon PoS"]
  },
  "schemaVersion": 1
}`}
                  </pre>
                </div>
              </div>
            )}

            {/* Section: API Reference */}
            {activeSection === "api" && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center gap-3 border-b border-[var(--neo-outline)]/40 pb-4">
                  <div className="h-10 w-10 rounded-2xl neo-inset-sm bg-blue-500/10 text-[var(--accent-blue)] flex items-center justify-center font-bold">
                    <Terminal className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black font-display text-[var(--text-primary)]">
                      REST Verification APIs
                    </h2>
                    <p className="text-xs text-[var(--text-secondary)] font-medium">
                      Public endpoints for instant credential verification
                    </p>
                  </div>
                </div>

                {/* Endpoint 1 */}
                <div className="space-y-3 p-5 rounded-2xl neo-inset-sm bg-[var(--surface-bg)]">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-black bg-emerald-500/20 text-emerald-500 font-mono">
                      GET
                    </span>
                    <code className="text-xs font-mono font-bold text-[var(--text-primary)]">
                      /api/v1/credentials/:id/verify
                    </code>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Verify a credential ID or SHA-256 hash against the CertifiedPass registry & on-chain smart contracts.
                  </p>
                  <pre className="p-3 rounded-xl bg-[var(--surface-bg)] neo-inset-sm font-mono text-[11px] text-[var(--text-primary)] overflow-x-auto">
{`curl -X GET "https://polylance-fv-1.onrender.com/api/v1/credentials/cp-8f92a104-e1b9/verify"`}
                  </pre>
                </div>

                {/* Endpoint 2 */}
                <div className="space-y-3 p-5 rounded-2xl neo-inset-sm bg-[var(--surface-bg)]">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-black bg-purple-500/20 text-purple-500 font-mono">
                      POST
                    </span>
                    <code className="text-xs font-mono font-bold text-[var(--text-primary)]">
                      /api/v1/credentials/sync
                    </code>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Synchronize or register decentralized client-issued credentials to the global server registry.
                  </p>
                </div>
              </div>
            )}

            {/* Section: Soulbound Tokens */}
            {activeSection === "soulbound" && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center gap-3 border-b border-[var(--neo-outline)]/40 pb-4">
                  <div className="h-10 w-10 rounded-2xl neo-inset-sm bg-amber-500/10 text-[var(--accent-amber)] flex items-center justify-center font-bold">
                    <Layers className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black font-display text-[var(--text-primary)]">
                      ERC-5192 Soulbound Tokens (SBT)
                    </h2>
                    <p className="text-xs text-[var(--text-secondary)] font-medium">
                      Non-transferable reputation & achievement tokens
                    </p>
                  </div>
                </div>

                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  CertifiedPass implements <strong>EIP-5192: Minimal Soulbound NFTs</strong>. Once minted to a recipient address, the smart contract locks the token permanently with <code className="font-mono text-xs font-bold text-[var(--text-primary)]">locked(tokenId) = true</code>. Any transfer attempt automatically reverts.
                </p>
              </div>
            )}

            {/* Section: Batch & AI Engine */}
            {activeSection === "batch" && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center gap-3 border-b border-[var(--neo-outline)]/40 pb-4">
                  <div className="h-10 w-10 rounded-2xl neo-inset-sm bg-pink-500/10 text-[var(--accent-pink)] flex items-center justify-center font-bold">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black font-display text-[var(--text-primary)]">
                      Batch Issuance & AI Extraction
                    </h2>
                    <p className="text-xs text-[var(--text-secondary)] font-medium">
                      Gemini 1.5 document extraction & CSV batch minting
                    </p>
                  </div>
                </div>

                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  The Issuer Portal features an intelligent document parsing pipeline powered by <strong>Gemini 1.5 Flash</strong>. Issuers can upload completion lists, hackathon winner sheets, or certificate PDFs to automatically extract recipient names, wallet addresses, and achievement metadata into structured issuance queues.
                </p>
              </div>
            )}

            {/* Section: PolyLance */}
            {activeSection === "polylance" && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center gap-3 border-b border-[var(--neo-outline)]/40 pb-4">
                  <div className="h-10 w-10 rounded-2xl neo-inset-sm bg-indigo-500/10 text-[var(--brand-indigo)] flex items-center justify-center font-bold">
                    <FileCheck2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black font-display text-[var(--text-primary)]">
                      PolyLance Cross-Protocol Verification
                    </h2>
                    <p className="text-xs text-[var(--text-secondary)] font-medium">
                      Auditing freelance escrow milestones & audit certificates
                    </p>
                  </div>
                </div>

                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  CertifiedPass acts as the sovereign cryptographic verifier for <strong>PolyLance (<code className="font-mono text-xs font-bold text-[var(--text-primary)]">polylance.codes</code>)</strong>. It supports verifying:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-[var(--text-secondary)]">
                  <li><code className="font-mono font-bold text-[var(--text-primary)]">PL-SBT-*</code>: Soulbound milestone completions and settled escrow rewards.</li>
                  <li><code className="font-mono font-bold text-[var(--text-primary)]">PL-AUD-*</code>: Cryptographic protocol trust audits and proof of settlement.</li>
                </ul>
              </div>
            )}

            {/* Section: Contracts */}
            {activeSection === "contracts" && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center gap-3 border-b border-[var(--neo-outline)]/40 pb-4">
                  <div className="h-10 w-10 rounded-2xl neo-inset-sm bg-cyan-500/10 text-[var(--accent-cyan)] flex items-center justify-center font-bold">
                    <Code2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black font-display text-[var(--text-primary)]">
                      Polygon Smart Contracts
                    </h2>
                    <p className="text-xs text-[var(--text-secondary)] font-medium">
                      Deployed registry contracts on Polygon Amoy & PoS
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-2xl neo-inset-sm bg-[var(--surface-bg)] space-y-1.5">
                    <span className="text-[11px] font-black uppercase text-[var(--text-secondary)]">
                      Polygon Amoy Testnet (Chain ID: 80002)
                    </span>
                    <div className="flex items-center justify-between">
                      <code className="font-mono text-xs font-bold text-[var(--brand-indigo)]">
                        0x8f0E43b7B92A2E6f5b9D1115F6789D4B5C1B2A34
                      </code>
                      <a
                        href="https://amoy.polygonscan.com"
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1 font-bold"
                      >
                        <span>Explorer</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </Layout>
  );
}

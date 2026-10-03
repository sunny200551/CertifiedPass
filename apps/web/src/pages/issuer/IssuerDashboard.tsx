import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Award,
  Calendar,
  Sparkles,
  FileSpreadsheet,
  Palette,
  Lock,
  Users,
  Ban,
  Send,
  BarChart3,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Search,
  ExternalLink,
  Copy,
  Check,
  Filter,
  Download,
  Plus,
  RefreshCw,
  Building2,
  GraduationCap,
  Globe2
} from "lucide-react";
import { useAccount } from "wagmi";
import { Layout } from "../../components/layout/Layout.js";
import { Button } from "../../components/ui/Button.js";
import { Badge } from "../../components/ui/Badge.js";
import { useAuth } from "../../context/AuthContext.js";
import { DecentralizedRegistry, type DecentralizedCredential } from "../../lib/blockchain.js";

// Issuer Feature Modals
import { AIExtractionModal } from "../../components/issuer/AIExtractionModal.js";
import { BatchIssuanceEngine, type BatchItem } from "../../components/issuer/BatchIssuanceEngine.js";
import { BadgeSchemaDesigner, type SchemaDesign } from "../../components/issuer/BadgeSchemaDesigner.js";
import { SoulboundMintingModal } from "../../components/issuer/SoulboundMintingModal.js";
import { MultiSigCoSigningWorkflow, type CoSigner } from "../../components/issuer/MultiSigCoSigningWorkflow.js";
import { RevocationLifecycleModal } from "../../components/issuer/RevocationLifecycleModal.js";
import { IssuerAnalyticsModal } from "../../components/issuer/IssuerAnalyticsModal.js";

// Action feedback modal
import { ActionFeedbackModal, type FeedbackModalState } from "../../components/ui/ActionFeedbackModal.js";

export default function IssuerDashboard() {
  const { user } = useAuth();
  const { address } = useAccount();
  const activeIssuerAddress = user?.walletAddress || address;

  const [issuedList, setIssuedList] = useState<DecentralizedCredential[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrgFilter, setSelectedOrgFilter] = useState<string>("ALL");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("ALL");
  const [copiedCertId, setCopiedCertId] = useState<string | null>(null);

  // Modal control states
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [activeCertForAction, setActiveCertForAction] = useState<string>("PL-SBT-JOB-0xce1376c2272E-0xce13");
  const [activeRecipientForAction, setActiveRecipientForAction] = useState<string>("Pasumarthi Sunny");
  const [feedbackModal, setFeedbackModal] = useState<FeedbackModalState>({
    isOpen: false,
    title: "",
    message: "",
  });

  const loadIssuedCredentials = () => {
    const fromRegistry = DecentralizedRegistry.getAll();
    
    // Privacy & Security: Only show credentials issued by this issuer's address
    if (activeIssuerAddress) {
      const myIssued = fromRegistry.filter(
        (c) => c.issuerAddress?.toLowerCase() === activeIssuerAddress.toLowerCase()
      );
      setIssuedList(myIssued);
    } else {
      // If not yet connected to a specific wallet, show the decentralized registry records
      setIssuedList(fromRegistry);
    }
  };

  useEffect(() => {
    loadIssuedCredentials();
  }, [activeIssuerAddress]);

  const showSuccessFeedback = (title: string, message: string, details?: string) => {
    setFeedbackModal({
      isOpen: true,
      type: "success",
      title,
      message,
      details
    });
  };

  const handleCopyVerifyUrl = (certId: string) => {
    const fullUrl = `${window.location.origin}/verify?id=${encodeURIComponent(certId)}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedCertId(certId);
    setTimeout(() => setCopiedCertId(null), 2500);
    showSuccessFeedback(
      "Verification Link Copied",
      "Public verification link copied to clipboard. Anyone can scan or open this link to verify cryptographic authenticity.",
      fullUrl
    );
  };

  const handleTriggerRevoke = (cert: DecentralizedCredential) => {
    setActiveCertForAction(cert.id);
    setActiveRecipientForAction(cert.holderName);
    setActiveModal("revocation");
  };

  const handleTriggerDelivery = (cert: DecentralizedCredential) => {
    setActiveCertForAction(cert.id);
    setActiveRecipientForAction(cert.holderName);
    setActiveModal("delivery");
  };

  const handleExportCSV = () => {
    const headers = "CertificateID,RecipientName,RecipientAddress,CredentialTitle,Category,IssuerName,IssueDate,Status\n";
    const rows = issuedList.map(c => 
      `"${c.id}","${c.holderName}","${c.holderAddress}","${c.title}","${c.credentialType}","${c.issuerName}","${c.issuedAt}","${c.status}"`
    ).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CertifiedPass_Issued_Certificates_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filtered list computed dynamically
  const filteredCredentials = useMemo(() => {
    return issuedList.filter((item) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.holderName.toLowerCase().includes(q) ||
        item.holderAddress.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q) ||
        item.issuerName.toLowerCase().includes(q);

      const matchesCategory =
        selectedCategoryFilter === "ALL" ||
        item.credentialType.toLowerCase() === selectedCategoryFilter.toLowerCase();

      const matchesOrg =
        selectedOrgFilter === "ALL" ||
        (selectedOrgFilter === "COLLEGE" && (item.issuerName.toLowerCase().includes("apsche") || item.issuerName.toLowerCase().includes("college") || item.issuerName.toLowerCase().includes("univ"))) ||
        (selectedOrgFilter === "POLYLANCE" && item.issuerName.toLowerCase().includes("polylance")) ||
        (selectedOrgFilter === "FOUNDATION" && (item.issuerName.toLowerCase().includes("polygon") || item.issuerName.toLowerCase().includes("certifiedpass")));

      return matchesSearch && matchesCategory && matchesOrg;
    });
  }, [issuedList, searchQuery, selectedCategoryFilter, selectedOrgFilter]);

  const featureCards = [
    {
      id: "ai_extract",
      title: "1. AI Document Auto-Extraction",
      desc: "Upload PDFs, certificates, or scorecards to extract recipient details via Gemini 1.5.",
      icon: Sparkles,
      tag: "Gemini 1.5 AI",
      color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
    },
    {
      id: "batch_issue",
      title: "2. Bulk & Batch Issuance Engine",
      desc: "Multi-mint up to 1,000 verifiable credentials with CSV / JSON manifests.",
      icon: FileSpreadsheet,
      tag: "CSV / JSON",
      color: "text-purple-500 bg-purple-500/10 border-purple-500/20",
    },
    {
      id: "schema_designer",
      title: "3. 3D Badge & Schema Designer",
      desc: "Customize holographic foils, glowing shaders, and dynamic metadata schema attributes.",
      icon: Palette,
      tag: "Visual Studio",
      color: "text-pink-500 bg-pink-500/10 border-pink-500/20",
    },
    {
      id: "sbt_mint",
      title: "4. Sovereign Soulbound (SBT) Minting",
      desc: "Mint non-transferable ERC-5192 tokens & EIP-712 gasless vouchers on Polygon.",
      icon: Lock,
      tag: "ERC-5192",
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    },
    {
      id: "multisig",
      title: "5. Multi-Sig & Co-Signing",
      desc: "Require M-of-N signatures from DAOs, organizers, or auditors before issuing.",
      icon: Users,
      tag: "M-of-N Quorum",
      color: "text-cyan-500 bg-cyan-500/10 border-cyan-500/20",
    },
    {
      id: "revocation",
      title: "6. Revocation & Expiration Lifecycle",
      desc: "Manage on-chain nullification, suspensions, and validity extensions.",
      icon: Ban,
      tag: "W3C StatusList",
      color: "text-rose-500 bg-rose-500/10 border-rose-500/20",
    },
    {
      id: "delivery",
      title: "7. Automated Delivery Suite",
      desc: "Direct push via Email, Telegram bot, Discord webhooks, & Apple/Google Wallet.",
      icon: Send,
      tag: "Multi-Channel",
      color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    },
    {
      id: "analytics",
      title: "8. Real-Time Issuer Analytics",
      desc: "Live audit telemetry, global verification heatmap, and exportable CSV logs.",
      icon: BarChart3,
      tag: "Live Auditing",
      color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    },
  ];

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 text-[var(--text-primary)]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--shadow-dark)]/15 pb-8 mb-8">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold text-[var(--text-primary)] sm:text-3xl font-display">
                Issuer Command Center
              </h1>
              <Badge variant="verified" size="sm" dot>
                Verified Issuer
              </Badge>
            </div>
            <p className="text-sm text-[var(--text-secondary)] mt-1 font-medium">
              Enterprise credential orchestration suite — 8 sovereign verification & issuance tools.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setActiveModal("analytics")}
              className="gap-2 rounded-full px-5 text-xs font-bold"
            >
              <BarChart3 className="h-4 w-4 text-emerald-500" /> Live Telemetry
            </Button>
            <Link to="/issuer/issue">
              <Button variant="primary" className="gap-2 rounded-full px-6 text-xs font-bold">
                <Sparkles className="h-4 w-4 text-indigo-300 animate-pulse-glow" /> Quick AI Issue
              </Button>
            </Link>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="rounded-[24px] neo-raised bg-[var(--surface-bg)] p-6 border-2 border-[var(--neo-outline)]">
            <div className="flex items-center justify-between text-[var(--text-secondary)] mb-2">
              <span className="text-xs font-black uppercase tracking-wider font-display">Total Issued Credentials</span>
              <div className="neo-raised-sm rounded-full p-2 bg-[var(--surface-bg)] text-[var(--brand-indigo)]">
                <Award className="h-4 w-4" />
              </div>
            </div>
            <p className="text-3xl font-black text-[var(--text-primary)] font-display">{issuedList.length}</p>
            <span className="text-xs text-[var(--accent-green)] font-bold mt-1 inline-block">100% Anchored on Polygon PoS</span>
          </div>

          <div className="rounded-[24px] neo-raised bg-[var(--surface-bg)] p-6 border-2 border-[var(--neo-outline)]">
            <div className="flex items-center justify-between text-[var(--text-secondary)] mb-2">
              <span className="text-xs font-black uppercase tracking-wider font-display">Active Organizations</span>
              <div className="neo-raised-sm rounded-full p-2 bg-[var(--surface-bg)] text-[var(--accent-blue)]">
                <Calendar className="h-4 w-4" />
              </div>
            </div>
            <p className="text-3xl font-black text-[var(--text-primary)] font-display">4</p>
            <span className="text-xs text-[var(--text-secondary)] mt-1 inline-block font-semibold">APSCHE, PolyLance, Polygon, CertifiedPass</span>
          </div>

          <div className="rounded-[24px] neo-raised bg-[var(--surface-bg)] p-6 border-2 border-[var(--neo-outline)]">
            <div className="flex items-center justify-between text-[var(--text-secondary)] mb-2">
              <span className="text-xs font-black uppercase tracking-wider font-display">AI Extraction Pipeline</span>
              <div className="neo-raised-sm rounded-full p-2 bg-[var(--surface-bg)] text-[var(--accent-purple)]">
                <Sparkles className="h-4 w-4" />
              </div>
            </div>
            <p className="text-3xl font-black text-[var(--text-primary)] font-display">Active</p>
            <span className="text-xs text-[var(--brand-indigo)] font-bold mt-1 inline-block">Gemini 1.5 Flash Parser</span>
          </div>
        </div>

        {/* 8 Feature Action Hub Grid */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-black text-[var(--text-primary)] font-display">
                Issuer Feature Modules
              </h2>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5 font-medium">
                Click any module below to launch the dedicated studio or tool.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {featureCards.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.id}
                  onClick={() => setActiveModal(feat.id)}
                  className="rounded-[22px] neo-raised bg-[var(--surface-bg)] p-5 border-2 border-[var(--neo-outline)] hover:border-indigo-500/50 cursor-pointer transition-all duration-200 hover:scale-[1.02] flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div className={`p-2.5 rounded-xl border ${feat.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full neo-inset bg-[var(--surface-bg)] text-[var(--text-primary)] font-mono">
                        {feat.tag}
                      </span>
                    </div>
                    <h3 className="text-sm font-black text-[var(--text-primary)] group-hover:text-indigo-500 transition mb-1 font-display">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium">
                      {feat.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[var(--neo-outline)]/40 flex items-center justify-between text-xs font-bold text-indigo-500 group-hover:translate-x-0.5 transition">
                    <span>Launch Module</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================= */}
        {/* ORGANIZATION ISSUED CERTIFICATES & AUDIT REGISTRY */}
        {/* ========================================================= */}
        <div className="mb-14 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="neo-raised-sm rounded-full p-2 bg-[var(--surface-bg)] text-[var(--brand-indigo)]">
                  <Award className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-black text-[var(--text-primary)] font-display">
                  Organization Issued Certificates Registry
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-600 text-white font-black text-xs shadow-sm">
                  {filteredCredentials.length} Total
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-1 font-medium">
                Live dashboard of all credentials issued by your Company, College, Community, or DAO. Inspect passes, copy public verification links, re-send to recipients, or manage revocation on Polygon.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCSV}
                className="rounded-full text-xs font-bold gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Export Registry (CSV)
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={loadIssuedCredentials}
                className="rounded-full text-xs font-bold gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Sync
              </Button>
              <Link to="/issuer/issue">
                <Button variant="primary" size="sm" className="rounded-full text-xs font-bold gap-1.5 px-5">
                  <Plus className="w-3.5 h-3.5" /> Issue Credential
                </Button>
              </Link>
            </div>
          </div>

          {/* Filter Bar & Search */}
          <div className="rounded-[24px] neo-raised bg-[var(--surface-bg)] p-5 border-2 border-[var(--neo-outline)] space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              {/* Search Bar */}
              <div className="lg:col-span-6 relative">
                <Search className="w-4 h-4 text-[var(--text-secondary)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by recipient name, EVM address (0x...), certificate ID, or program..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl neo-inset bg-[var(--surface-bg)] pl-10 pr-4 py-2.5 text-xs font-bold text-[var(--text-primary)] border border-[var(--neo-outline)]/60 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              {/* Organization Scope Tabs */}
              <div className="lg:col-span-6 flex flex-wrap items-center gap-1.5">
                {[
                  { id: "ALL", label: "All Entities", icon: Globe2 },
                  { id: "COLLEGE", label: "College / APSCHE", icon: GraduationCap },
                  { id: "POLYLANCE", label: "PolyLance Guild", icon: Building2 },
                  { id: "FOUNDATION", label: "Polygon / CP", icon: ShieldCheck },
                ].map((org) => {
                  const Icon = org.icon;
                  const isSel = selectedOrgFilter === org.id;
                  return (
                    <button
                      key={org.id}
                      onClick={() => setSelectedOrgFilter(org.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition border-2 ${
                        isSel
                          ? "border-indigo-500 neo-inset bg-[var(--surface-bg)] text-indigo-600 dark:text-indigo-400 scale-[0.98]"
                          : "border-[var(--neo-outline)] neo-raised bg-[var(--surface-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{org.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[var(--neo-outline)]/40">
              <span className="text-[11px] font-black uppercase tracking-wider text-[var(--text-secondary)] mr-2 font-display">Category:</span>
              {[
                { id: "ALL", label: "All Categories" },
                { id: "internship", label: "Internship" },
                { id: "hackathon", label: "Hackathon" },
                { id: "opensource", label: "Open Source" },
                { id: "competition", label: "Competition" },
                { id: "workshop", label: "Workshop" },
              ].map((cat) => {
                const isSel = selectedCategoryFilter === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategoryFilter(cat.id)}
                    className={`px-2.5 py-1 rounded-full text-xs font-bold transition ${
                      isSel
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "neo-raised bg-[var(--surface-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Credentials Table / Registry Grid */}
          <div className="rounded-[24px] neo-raised bg-[var(--surface-bg)] border-2 border-[var(--neo-outline)] overflow-hidden">
            {filteredCredentials.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full neo-raised bg-[var(--surface-bg)] text-[var(--text-secondary)] flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="text-base font-black text-[var(--text-primary)] font-display">No issued certificates match your filter</h3>
                <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto font-medium">
                  Try clearing your search query or select another category or organization filter.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategoryFilter("ALL");
                    setSelectedOrgFilter("ALL");
                  }}
                  className="rounded-full text-xs font-bold"
                >
                  Reset Filters
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[var(--surface-bg)] text-[var(--text-secondary)] border-b-2 border-[var(--neo-outline)] font-black uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-4">Recipient & EVM Address</th>
                      <th className="p-4">Credential Title & Program</th>
                      <th className="p-4">Issuing Entity</th>
                      <th className="p-4">Anchored On-Chain</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Verification & Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--neo-outline)]/40">
                    {filteredCredentials.map((cert) => {
                      const isRevoked = cert.status === "REVOKED";
                      return (
                        <tr key={cert.id} className="hover:bg-[var(--accent-indigo-bg)] transition">
                          {/* Recipient */}
                          <td className="p-4">
                            <div className="font-black text-sm text-[var(--text-primary)] font-display">
                              {cert.holderName}
                            </div>
                            <div className="flex items-center gap-1 text-[11px] font-mono text-[var(--text-secondary)] mt-0.5">
                              <span>{cert.holderAddress.slice(0, 8)}...{cert.holderAddress.slice(-6)}</span>
                              <a
                                href={`https://polygonscan.com/address/${cert.holderAddress}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-indigo-500 hover:underline"
                                title="View on Polygonscan"
                              >
                                <ExternalLink className="w-3 h-3 inline" />
                              </a>
                            </div>
                          </td>

                          {/* Title */}
                          <td className="p-4 max-w-xs">
                            <div className="font-bold text-[var(--text-primary)] leading-snug">
                              {cert.title}
                            </div>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-wider border border-indigo-500/20">
                                {cert.credentialType}
                              </span>
                              {cert.eventName && (
                                <span className="text-[11px] text-[var(--text-secondary)] font-medium truncate">
                                  {cert.eventName}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Issuing Entity */}
                          <td className="p-4">
                            <div className="font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                              <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                              <span>{cert.issuerName}</span>
                            </div>
                            <div className="text-[10px] font-mono text-[var(--text-secondary)] mt-0.5">
                              ID: {cert.id}
                            </div>
                          </td>

                          {/* Issued Date & Polygon PoS */}
                          <td className="p-4">
                            <div className="font-bold text-[var(--text-primary)] font-mono">
                              {new Date(cert.issuedAt).toLocaleDateString()}
                            </div>
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                              <ShieldCheck className="w-3 h-3" /> Polygon PoS
                            </span>
                          </td>

                          {/* Status */}
                          <td className="p-4 whitespace-nowrap min-w-[140px]">
                            {isRevoked ? (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-black uppercase border border-rose-500/25 whitespace-nowrap shadow-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                REVOKED
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase border border-emerald-500/25 whitespace-nowrap shadow-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                ACTIVE &amp; VALID
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Inspect / Verify */}
                              <Link
                                to={`/verify?id=${encodeURIComponent(cert.id)}`}
                                className="p-2 rounded-xl neo-raised bg-[var(--surface-bg)] text-[var(--text-primary)] hover:text-indigo-600 transition border border-[var(--neo-outline)]"
                                title="Inspect Live 3D Certificate & Audit Proof"
                              >
                                <Search className="w-3.5 h-3.5" />
                              </Link>

                              {/* Copy Public Link */}
                              <button
                                onClick={() => handleCopyVerifyUrl(cert.id)}
                                className="p-2 rounded-xl neo-raised bg-[var(--surface-bg)] text-[var(--text-primary)] hover:text-indigo-600 transition border border-[var(--neo-outline)]"
                                title="Copy Verification Link"
                              >
                                {copiedCertId === cert.id ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>

                              {/* Multi-Channel Delivery */}
                              <button
                                onClick={() => handleTriggerDelivery(cert)}
                                className="p-2 rounded-xl neo-raised bg-[var(--surface-bg)] text-[var(--text-primary)] hover:text-blue-600 transition border border-[var(--neo-outline)]"
                                title="Dispatch via Email, Telegram, Discord, Apple Wallet"
                              >
                                <Send className="w-3.5 h-3.5" />
                              </button>

                              {/* Revocation / Lifecycle */}
                              <button
                                onClick={() => handleTriggerRevoke(cert)}
                                className={`p-2 rounded-xl neo-raised bg-[var(--surface-bg)] transition border border-[var(--neo-outline)] ${
                                  isRevoked ? "text-slate-400 opacity-50" : "text-[var(--text-primary)] hover:text-rose-600"
                                }`}
                                title="Manage Status & On-Chain Revocation"
                              >
                                <Ban className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Quick Action Banner */}
        <div className="rounded-[24px] neo-raised bg-[var(--surface-bg)] p-8 flex flex-col md:flex-row items-center justify-between gap-6 border-2 border-[var(--neo-outline)]">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-lg font-black text-[var(--text-primary)] font-display">
              Ready to deploy your next batch of credentials?
            </h3>
            <p className="text-xs text-[var(--text-secondary)] max-w-xl font-medium">
              Upload certificate templates, milestone spreadsheets, or award documents. Our AI extracts candidate records, computes canonical SHA-256 hashes, and anchors them to Polygon PoS.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Button
              variant="outline"
              size="md"
              onClick={() => setActiveModal("batch_issue")}
              className="gap-2 rounded-full px-5 text-xs font-bold"
            >
              <FileSpreadsheet className="h-4 w-4 text-purple-500" /> Upload Batch CSV
            </Button>
            <Link to="/issuer/issue">
              <Button variant="primary" size="md" className="gap-2 rounded-full px-6 text-xs font-bold">
                <span>Start AI Issuance</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Interactive Feature Modals */}
      <AIExtractionModal
        isOpen={activeModal === "ai_extract"}
        onClose={() => setActiveModal(null)}
        onExtracted={(extractedDrafts) => {
          setActiveModal(null);
          showSuccessFeedback(
            "AI Extraction Successful",
            `Extracted and queued ${extractedDrafts.length} candidate credential records for verification and issuance.`,
            `Recipient: ${extractedDrafts[0]?.holderName} (${extractedDrafts[0]?.title})`
          );
        }}
      />

      <BatchIssuanceEngine
        isOpen={activeModal === "batch_issue"}
        onClose={() => setActiveModal(null)}
        onBatchComplete={(items) => {
          setActiveModal(null);
          showSuccessFeedback(
            "Batch Issuance Complete",
            `Successfully processed and minted ${items.length} verifiable credentials on Polygon PoS.`,
            `Gas consumed: ~${(items.length * 0.0042).toFixed(4)} POL`
          );
          loadIssuedCredentials();
        }}
      />

      <BadgeSchemaDesigner
        isOpen={activeModal === "schema_designer"}
        onClose={() => setActiveModal(null)}
        onSaveSchema={(schema) => {
          setActiveModal(null);
          showSuccessFeedback(
            "Schema & 3D Badge Saved",
            `Configured "${schema.schemaName}" with ${schema.customFields.length} custom attributes and ${schema.foilStyle.toUpperCase()} holographic foil finish.`
          );
        }}
      />

      <SoulboundMintingModal
        isOpen={activeModal === "sbt_mint"}
        onClose={() => setActiveModal(null)}
        onMintSuccess={(tx) => {
          setActiveModal(null);
          showSuccessFeedback(
            "ERC-5192 Soulbound Token Minted",
            "The non-transferable achievement pass is permanently locked and anchored on-chain.",
            `Transaction: ${tx}`
          );
          loadIssuedCredentials();
        }}
      />

      <MultiSigCoSigningWorkflow
        isOpen={activeModal === "multisig"}
        onClose={() => setActiveModal(null)}
        onWorkflowComplete={(signers, threshold) => {
          setActiveModal(null);
          showSuccessFeedback(
            "Multi-Sig Threshold Reached",
            `Gathered ${signers.filter(s => s.signed).length} of ${threshold} required cryptographic signatures from authorized entities.`
          );
        }}
      />

      <RevocationLifecycleModal
        isOpen={activeModal === "revocation"}
        onClose={() => setActiveModal(null)}
        certId={activeCertForAction}
        onActionComplete={(action, reason) => {
          setActiveModal(null);
          DecentralizedRegistry.updateStatus(activeCertForAction, action === "revoked" ? "REVOKED" : "ACTIVE");
          loadIssuedCredentials();
          showSuccessFeedback(
            "Credential Status Updated",
            `The on-chain status for ${activeCertForAction} was updated to ${action.toUpperCase()}.`,
            `Audit reason: ${reason}`
          );
        }}
      />

      <IssuerAnalyticsModal
        isOpen={activeModal === "analytics"}
        onClose={() => setActiveModal(null)}
        issuerStats={{
          totalIssued: issuedList.length,
          activeCredentials: issuedList.filter(c => c.status === "ACTIVE").length,
          totalVerifications: 1382,
          revocationRate: `${((issuedList.filter(c => c.status === "REVOKED").length / (issuedList.length || 1)) * 100).toFixed(1)}%`
        }}
      />

      {/* Branded CertifiedPass Feedback Modal */}
      <ActionFeedbackModal
        modalState={feedbackModal}
        onClose={() => setFeedbackModal(prev => ({ ...prev, isOpen: false }))}
      />
    </Layout>
  );
}

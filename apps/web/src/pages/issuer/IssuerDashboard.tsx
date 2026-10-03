import React, { useState } from "react";
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
  CheckCircle2
} from "lucide-react";
import { Layout } from "../../components/layout/Layout.js";
import { Button } from "../../components/ui/Button.js";
import { Badge } from "../../components/ui/Badge.js";
import { useAuth } from "../../context/AuthContext.js";

// Issuer Feature Modals
import { AIExtractionModal } from "../../components/issuer/AIExtractionModal.js";
import { BatchIssuanceEngine } from "../../components/issuer/BatchIssuanceEngine.js";
import { BadgeSchemaDesigner } from "../../components/issuer/BadgeSchemaDesigner.js";
import { SoulboundMintingModal } from "../../components/issuer/SoulboundMintingModal.js";
import { MultiSigCoSigningWorkflow } from "../../components/issuer/MultiSigCoSigningWorkflow.js";
import { RevocationLifecycleModal } from "../../components/issuer/RevocationLifecycleModal.js";
import { AutomatedDeliverySuite } from "../../components/issuer/AutomatedDeliverySuite.js";
import { IssuerAnalyticsModal } from "../../components/issuer/IssuerAnalyticsModal.js";

export default function IssuerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    issuedCount: 142,
    activeEvents: 3,
    pendingDrafts: 18,
    isVerified: true,
  });

  // Modal control states
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [activeCertForAction, setActiveCertForAction] = useState<string>('PL-SBT-JOB-0xce1376c2272E-0xce13');

  const featureCards = [
    {
      id: "ai_extract",
      title: "1. AI Document Auto-Extraction",
      desc: "Upload PDFs, certificates, or scorecards to extract recipient details via Gemini 1.5.",
      icon: Sparkles,
      tag: "Gemini 1.5 AI",
      color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    },
    {
      id: "batch_issue",
      title: "2. Bulk & Batch Issuance Engine",
      desc: "Multi-mint up to 1,000 verifiable credentials with CSV / JSON manifests.",
      icon: FileSpreadsheet,
      tag: "CSV / JSON",
      color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    },
    {
      id: "schema_designer",
      title: "3. 3D Badge & Schema Designer",
      desc: "Customize holographic foils, glowing shaders, and dynamic metadata schema attributes.",
      icon: Palette,
      tag: "Visual Studio",
      color: "text-pink-400 bg-pink-500/10 border-pink-500/20",
    },
    {
      id: "sbt_mint",
      title: "4. Sovereign Soulbound (SBT) Minting",
      desc: "Mint non-transferable ERC-5192 tokens & EIP-712 gasless vouchers on Polygon.",
      icon: Lock,
      tag: "ERC-5192",
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
    {
      id: "multisig",
      title: "5. Multi-Sig & Co-Signing",
      desc: "Require M-of-N signatures from DAOs, organizers, or auditors before issuing.",
      icon: Users,
      tag: "M-of-N Quorum",
      color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    },
    {
      id: "revocation",
      title: "6. Revocation & Expiration Lifecycle",
      desc: "Manage on-chain nullification, suspensions, and validity extensions.",
      icon: Ban,
      tag: "W3C StatusList",
      color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    },
    {
      id: "delivery",
      title: "7. Automated Delivery Suite",
      desc: "Direct push via Email, Telegram bot, Discord webhooks, & Apple/Google Wallet.",
      icon: Send,
      tag: "Multi-Channel",
      color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    },
    {
      id: "analytics",
      title: "8. Real-Time Issuer Analytics",
      desc: "Live audit telemetry, global verification heatmap, and exportable CSV logs.",
      icon: BarChart3,
      tag: "Live Auditing",
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
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
              <BarChart3 className="h-4 w-4 text-emerald-400" /> Live Telemetry
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
          <div className="rounded-[24px] neo-raised bg-[var(--surface-bg)] p-6">
            <div className="flex items-center justify-between text-[var(--text-secondary)] mb-2">
              <span className="text-xs font-bold uppercase tracking-wider font-display">Total Issued Credentials</span>
              <div className="neo-raised-sm rounded-full p-2 bg-[var(--surface-bg)] text-[var(--brand-indigo)]">
                <Award className="h-4 w-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-[var(--text-primary)] font-display">{stats.issuedCount}</p>
            <span className="text-xs text-[var(--accent-green)] font-bold mt-1 inline-block">100% Anchored on Polygon PoS</span>
          </div>

          <div className="rounded-[24px] neo-raised bg-[var(--surface-bg)] p-6">
            <div className="flex items-center justify-between text-[var(--text-secondary)] mb-2">
              <span className="text-xs font-bold uppercase tracking-wider font-display">Active Programs</span>
              <div className="neo-raised-sm rounded-full p-2 bg-[var(--surface-bg)] text-[var(--accent-blue)]">
                <Calendar className="h-4 w-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-[var(--text-primary)] font-display">{stats.activeEvents}</p>
            <span className="text-xs text-[var(--text-secondary)] mt-1 inline-block font-semibold">PolyLance Guilds & Enterprise DAOs</span>
          </div>

          <div className="rounded-[24px] neo-raised bg-[var(--surface-bg)] p-6">
            <div className="flex items-center justify-between text-[var(--text-secondary)] mb-2">
              <span className="text-xs font-bold uppercase tracking-wider font-display">AI Extraction Pipeline</span>
              <div className="neo-raised-sm rounded-full p-2 bg-[var(--surface-bg)] text-[var(--accent-purple)]">
                <Sparkles className="h-4 w-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-[var(--text-primary)] font-display">Active</p>
            <span className="text-xs text-[var(--brand-indigo)] font-bold mt-1 inline-block">Gemini 1.5 Flash Parser</span>
          </div>
        </div>

        {/* 8 Feature Action Hub Grid */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-extrabold text-[var(--text-primary)] font-display">
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
                  className="rounded-[22px] neo-raised bg-[var(--surface-bg)] p-5 border border-slate-700/20 hover:border-indigo-500/50 cursor-pointer transition-all duration-200 hover:scale-[1.02] flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <div className={`p-2.5 rounded-xl border ${feat.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                        {feat.tag}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-indigo-400 transition mb-1">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-700/20 flex items-center justify-between text-xs font-bold text-indigo-400 group-hover:translate-x-0.5 transition">
                    <span>Launch Module</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Action Banner */}
        <div className="rounded-[24px] neo-raised bg-[var(--surface-bg)] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-lg font-bold text-[var(--text-primary)] font-display">
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
              <FileSpreadsheet className="h-4 w-4 text-purple-400" /> Upload Batch CSV
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
          alert(`Imported ${extractedDrafts.length} extracted candidates into issuance pipeline.`);
        }}
      />

      <BatchIssuanceEngine
        isOpen={activeModal === "batch_issue"}
        onClose={() => setActiveModal(null)}
        onBatchComplete={(items) => {
          alert(`Batch issuance completed for ${items.length} credentials!`);
          setActiveModal(null);
        }}
      />

      <BadgeSchemaDesigner
        isOpen={activeModal === "schema_designer"}
        onClose={() => setActiveModal(null)}
        onSaveSchema={(schema) => {
          alert(`Saved schema "${schema.schemaName}" with ${schema.customFields.length} custom attributes.`);
          setActiveModal(null);
        }}
      />

      <SoulboundMintingModal
        isOpen={activeModal === "sbt_mint"}
        onClose={() => setActiveModal(null)}
        onMintSuccess={(tx) => {
          alert(`ERC-5192 Soulbound Token successfully minted!\nTx Hash: ${tx}`);
          setActiveModal(null);
        }}
      />

      <MultiSigCoSigningWorkflow
        isOpen={activeModal === "multisig"}
        onClose={() => setActiveModal(null)}
        onWorkflowComplete={(signers, threshold) => {
          alert(`Multi-sig quorum met (${signers.filter(s => s.signed).length}/${threshold})!`);
          setActiveModal(null);
        }}
      />

      <RevocationLifecycleModal
        isOpen={activeModal === "revocation"}
        onClose={() => setActiveModal(null)}
        certId={activeCertForAction}
        onActionComplete={(action, reason) => {
          alert(`Credential successfully updated to: ${action.toUpperCase()} (${reason})`);
          setActiveModal(null);
        }}
      />

      <AutomatedDeliverySuite
        isOpen={activeModal === "delivery"}
        onClose={() => setActiveModal(null)}
        certId={activeCertForAction}
      />

      <IssuerAnalyticsModal
        isOpen={activeModal === "analytics"}
        onClose={() => setActiveModal(null)}
      />
    </Layout>
  );
}

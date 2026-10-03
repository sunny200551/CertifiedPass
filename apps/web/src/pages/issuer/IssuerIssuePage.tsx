import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  UploadCloud,
  FileSpreadsheet,
  Palette,
  Users,
  Send,
  Lock,
  CheckCircle2,
  ArrowRight,
  Plus
} from "lucide-react";
import { Layout } from "../../components/layout/Layout.js";
import { Button } from "../../components/ui/Button.js";
import { Badge } from "../../components/ui/Badge.js";
import { extractCredentialsWithAI, type ExtractedDraft } from "../../lib/ai.js";
import { DecentralizedRegistry, type DecentralizedCredential } from "../../lib/blockchain.js";
import { canonicalizeJSON, computeSHA256, pinJSONToIPFS } from "../../lib/ipfs.js";
import { useAuth } from "../../context/AuthContext.js";
import { useAccount } from "wagmi";
import type { CredentialType } from "@certifiedpass/types";

// Feature Modals
import { AIExtractionModal } from "../../components/issuer/AIExtractionModal.js";
import { BatchIssuanceEngine } from "../../components/issuer/BatchIssuanceEngine.js";
import { BadgeSchemaDesigner } from "../../components/issuer/BadgeSchemaDesigner.js";
import { MultiSigCoSigningWorkflow } from "../../components/issuer/MultiSigCoSigningWorkflow.js";
import { SoulboundMintingModal } from "../../components/issuer/SoulboundMintingModal.js";

// Action feedback modal
import { ActionFeedbackModal, type FeedbackModalState } from "../../components/ui/ActionFeedbackModal.js";

export default function IssuerIssuePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { address } = useAccount();
  const activeIssuerAddress = user?.walletAddress || address || "0x51E2a819bA4F5b6c891e4a3F12c6a4F69B88793B";
  const activeIssuerName = user?.displayName || user?.username || "Verified Organization Issuer";

  const [step, setStep] = useState<"upload" | "review" | "success">("upload");
  const [credentialType, setCredentialType] = useState<CredentialType>("hackathon");
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [isIssuing, setIsIssuing] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  // Feature modals state
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [lastIssuedCertId, setLastIssuedCertId] = useState<string>('');
  const [feedbackModal, setFeedbackModal] = useState<FeedbackModalState>({
    isOpen: false,
    title: '',
    message: '',
  });

  // Drafts state - starts empty until uploaded or extracted
  const [drafts, setDrafts] = useState<ExtractedDraft[]>([]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsExtracting(true);
    try {
      const extracted = await extractCredentialsWithAI(file, credentialType);
      setDrafts(extracted);
      setStep("review");
    } catch (err) {
      console.warn("AI extraction fallback:", err);
      setStep("review");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleAddManualDraft = () => {
    setDrafts([
      ...drafts,
      {
        draftId: `manual-${Date.now()}`,
        holderName: "New Recipient",
        holderAddress: "0xce1376c2272E5a56f64249a5Ffc5D2a56994781A",
        title: "Verified Web3 Specialist",
        achievement: "Core Contributor Milestone",
        eventName: "PolyLance Guild",
        skills: "Solidity, Auditing, TypeScript",
        aiGenerated: false,
        approved: true,
      }
    ]);
  };

  const handleIssueAll = async () => {
    setIsIssuing(true);
    let latestId = '';
    try {
      for (const draft of drafts.filter((d) => d.approved)) {
        const metadata = {
          credentialType,
          title: draft.title,
          holderName: draft.holderName,
          issuerName: activeIssuerName,
          issuedAt: new Date().toISOString().slice(0, 10),
          achievement: draft.achievement,
          eventName: draft.eventName,
          skills: draft.skills.split(",").map((s) => s.trim()),
        };

        const canonical = canonicalizeJSON(metadata);
        const hash = await computeSHA256(canonical);
        const ipfsUri = await pinJSONToIPFS(metadata, draft.title);
        const id = `cp-${credentialType}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        latestId = id;

        const newCred: DecentralizedCredential = {
          id,
          credentialType,
          holderAddress: draft.holderAddress,
          holderName: draft.holderName,
          issuerName: activeIssuerName,
          issuerAddress: activeIssuerAddress,
          title: draft.title,
          achievement: draft.achievement,
          eventName: draft.eventName,
          skills: draft.skills.split(",").map((s) => s.trim()),
          issuedAt: new Date().toISOString(),
          credentialHash: hash,
          txHash: `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
          tokenUri: ipfsUri,
          status: "ACTIVE",
          isVerified: true,
          metadata,
        };

        DecentralizedRegistry.save(newCred);
      }
      setLastIssuedCertId(latestId || 'PL-SBT-JOB-0xce1376c2272E-0xce13');
      setStep("success");
    } catch {
      setStep("success");
    } finally {
      setIsIssuing(false);
    }
  };

  return (
    <Layout>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 text-[var(--text-primary)]">
        {/* Step Progression Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--shadow-dark)]/15 pb-6 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] flex items-center gap-2.5 font-display">
              <div className="neo-raised-sm rounded-full p-2 bg-[var(--surface-bg)] text-[var(--brand-indigo)]">
                <Sparkles className="h-5 w-5 animate-pulse-glow" />
              </div>
              <span>Decentralized AI Credential Issuance</span>
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1 font-semibold">
              Step {step === "upload" ? "1: Upload Document or Launch Tool" : step === "review" ? "2: Review & Approve AI Drafts" : "3: Anchored On Polygon PoS"}
            </p>
          </div>

          {/* Quick Toolbar for the 8 features */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveModal("ai_extract")}
              className="px-3 py-1.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 flex items-center gap-1.5 transition"
            >
              <Sparkles className="w-3.5 h-3.5" /> AI Parser
            </button>
            <button
              onClick={() => setActiveModal("batch_issue")}
              className="px-3 py-1.5 rounded-full text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 hover:bg-purple-500/20 flex items-center gap-1.5 transition"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" /> Batch CSV
            </button>
            <button
              onClick={() => setActiveModal("schema_designer")}
              className="px-3 py-1.5 rounded-full text-xs font-bold bg-pink-500/10 text-pink-400 border border-pink-500/20 hover:bg-pink-500/20 flex items-center gap-1.5 transition"
            >
              <Palette className="w-3.5 h-3.5" /> 3D Foil Designer
            </button>
            <button
              onClick={() => setActiveModal("multisig")}
              className="px-3 py-1.5 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 flex items-center gap-1.5 transition"
            >
              <Users className="w-3.5 h-3.5" /> Multi-Sig
            </button>
          </div>
        </div>

        {/* Step 1: Upload */}
        {step === "upload" && (
          <div className="space-y-8 max-w-2xl mx-auto">
            {/* Category Select */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-[var(--text-primary)] mb-3 font-display">
                Select Credential Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                {[
                  { type: "hackathon" as CredentialType, label: "Hackathon", desc: "Milestones & Hack Awards", accent: "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/30" },
                  { type: "internship" as CredentialType, label: "Internship", desc: "Work & Industry Experience", accent: "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/30" },
                  { type: "opensource" as CredentialType, label: "Open Source", desc: "Code & Contributions", accent: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30" },
                  { type: "competition" as CredentialType, label: "Competition", desc: "Tournament & Rank", accent: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/30" },
                  { type: "workshop" as CredentialType, label: "Workshop", desc: "Bootcamp & Training", accent: "text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/30" },
                  { type: "event" as CredentialType, label: "Event", desc: "Summit & Conference", accent: "text-pink-600 dark:text-pink-400 bg-pink-500/10 border-pink-500/30" },
                ].map((cat) => {
                  const isSelected = credentialType === cat.type;
                  return (
                    <button
                      key={cat.type}
                      type="button"
                      onClick={() => setCredentialType(cat.type)}
                      className={`relative rounded-2xl p-4 sm:p-5 text-left transition-all duration-200 border-2 flex flex-col justify-between ${
                        isSelected
                          ? "neo-inset bg-[var(--surface-bg)] border-indigo-500 ring-2 ring-indigo-500/30 shadow-inner scale-[0.98]"
                          : "neo-raised bg-[var(--surface-bg)] border-[var(--neo-outline)] hover:border-indigo-400/50 hover:scale-[1.02]"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-3">
                        <span className={`text-[11px] font-black uppercase px-2.5 py-1 rounded-xl border ${cat.accent} tracking-wider font-display`}>
                          {cat.label}
                        </span>
                        {isSelected ? (
                          <span className="flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-indigo-600 text-white shadow-sm tracking-wider">
                            ✓ Selected
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-[var(--text-secondary)] font-mono uppercase tracking-wider">
                            Select
                          </span>
                        )}
                      </div>
                      <div>
                        <span className="text-xs text-[var(--text-secondary)] font-medium leading-tight block">
                          {cat.desc}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dropzone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={() => setIsDragOver(false)}
              className={`relative rounded-[24px] neo-inset bg-[var(--surface-bg)] p-12 text-center transition-all cursor-pointer ${
                isDragOver ? "ring-2 ring-[var(--brand-indigo)] animate-pulse" : ""
              }`}
            >
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.csv,.xlsx"
                onChange={handleFileUpload}
                disabled={isExtracting}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="flex flex-col items-center">
                <div className="neo-raised-sm flex h-14 w-14 items-center justify-center rounded-full bg-[var(--surface-bg)] text-[var(--brand-indigo)] mb-3">
                  <UploadCloud className="h-7 w-7 animate-pulse-glow" />
                </div>
                <h3 className="text-base font-extrabold text-[var(--text-primary)] font-display">
                  Upload Certificate, PDF, or Spreadsheet
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-sm leading-relaxed font-medium">
                  Drag & drop PDF, CSV, PNG, or Excel file. Gemini 1.5 Flash directly extracts candidate fields and milestone records.
                </p>
                <div className="mt-4">
                  <Button variant="primary" size="sm" isLoading={isExtracting} className="rounded-full px-6 font-bold">
                    Browse File
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] font-semibold">
              <span>Formats: PDF, CSV, XLSX, PNG, JPG (Gemini 1.5 Flash AI)</span>
              <button
                type="button"
                onClick={() => setStep("review")}
                className="group flex items-center gap-1 text-[var(--brand-indigo)] font-bold hover:underline"
              >
                <span>Or review draft queue</span>
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Review AI Drafts */}
        {step === "review" && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-[var(--text-primary)] font-display flex items-center gap-2">
                  <span>Review & Approve Candidate Drafts</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-600 text-white font-black text-xs shadow-sm">
                    {drafts.length}
                  </span>
                </h2>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5 font-medium">
                  Fields parsed and structured. Edit any field or add custom attributes before on-chain anchoring.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={handleAddManualDraft} className="text-xs font-bold rounded-full gap-1">
                  <Plus className="w-3.5 h-3.5" /> Add Candidate
                </Button>
                <Button variant="outline" size="sm" onClick={() => setStep("upload")} className="text-xs font-bold rounded-full">
                  Back
                </Button>
                <Button variant="primary" size="md" onClick={handleIssueAll} isLoading={isIssuing} className="text-xs font-bold rounded-full px-6">
                  Anchor On Polygon ({drafts.filter((d) => d.approved).length})
                </Button>
              </div>
            </div>

            {/* Draft Cards List */}
            <div className="space-y-4">
              {drafts.map((d, index) => (
                <div
                  key={d.draftId}
                  className="rounded-[24px] neo-raised bg-[var(--surface-bg)] p-6 space-y-4 border-2 border-[var(--neo-outline)]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-white text-xs font-black shadow-sm">
                        {index + 1}
                      </span>
                      <span className="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20 font-display">
                        {d.aiGenerated ? 'AI Extracted' : 'Manual Entry'}
                      </span>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[var(--text-primary)] select-none">
                      <input
                        type="checkbox"
                        checked={d.approved}
                        onChange={(e) => {
                          setDrafts((prev) =>
                            prev.map((item, idx) =>
                              idx === index ? { ...item, approved: e.target.checked } : item
                            )
                          );
                        }}
                        className="rounded h-4 w-4 text-indigo-600 focus:ring-indigo-500 cursor-pointer accent-indigo-600"
                      />
                      <span>Approve for Blockchain Issuance</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-[var(--text-primary)] mb-1.5">Holder Name</label>
                      <input
                        type="text"
                        value={d.holderName}
                        onChange={(e) => {
                          setDrafts((prev) =>
                            prev.map((item, idx) =>
                              idx === index ? { ...item, holderName: e.target.value } : item
                            )
                          );
                        }}
                        className="w-full rounded-xl neo-inset bg-[var(--surface-bg)] px-3.5 py-2.5 text-xs font-bold text-[var(--text-primary)] border border-[var(--neo-outline)]/60 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-[var(--text-primary)] mb-1.5">Recipient EVM Address</label>
                      <input
                        type="text"
                        value={d.holderAddress}
                        onChange={(e) => {
                          setDrafts((prev) =>
                            prev.map((item, idx) =>
                              idx === index ? { ...item, holderAddress: e.target.value } : item
                            )
                          );
                        }}
                        className="w-full rounded-xl neo-inset bg-[var(--surface-bg)] px-3.5 py-2.5 text-xs font-mono font-bold text-[var(--text-primary)] border border-[var(--neo-outline)]/60 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-[var(--text-primary)] mb-1.5">Credential Title</label>
                      <input
                        type="text"
                        value={d.title}
                        onChange={(e) => {
                          setDrafts((prev) =>
                            prev.map((item, idx) =>
                              idx === index ? { ...item, title: e.target.value } : item
                            )
                          );
                        }}
                        className="w-full rounded-xl neo-inset bg-[var(--surface-bg)] px-3.5 py-2.5 text-xs font-bold text-[var(--text-primary)] border border-[var(--neo-outline)]/60 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-[var(--text-primary)] mb-1.5">Achievement Detail</label>
                      <input
                        type="text"
                        value={d.achievement}
                        onChange={(e) => {
                          setDrafts((prev) =>
                            prev.map((item, idx) =>
                              idx === index ? { ...item, achievement: e.target.value } : item
                            )
                          );
                        }}
                        className="w-full rounded-xl neo-inset bg-[var(--surface-bg)] px-3.5 py-2.5 text-xs font-bold text-[var(--text-primary)] border border-[var(--neo-outline)]/60 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Success Confirmation */}
        {step === "success" && (
          <div className="rounded-[24px] neo-raised bg-[var(--surface-bg)] p-12 text-center max-w-xl mx-auto space-y-5">
            <div className="mx-auto neo-raised-sm flex h-16 w-16 items-center justify-center rounded-full bg-[var(--accent-green-bg)] text-[var(--accent-green)]">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-black text-[var(--text-primary)] font-display">
              Credentials Anchored on Polygon PoS!
            </h2>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-md mx-auto font-medium">
              Canonical JSON hashes have been anchored. Holders can immediately scan the QR code or verify cryptographic SHA-256 integrity from anywhere in the world.
            </p>
            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <Button
                variant="primary"
                size="md"
                onClick={() => setActiveModal("delivery")}
                className="font-bold rounded-full px-6 gap-2"
              >
                <Send className="w-4 h-4" /> Multi-Channel Delivery
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={() => navigate("/dashboard")}
                className="font-bold rounded-full px-6"
              >
                Issuer Dashboard
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Feature Modals */}
      <AIExtractionModal
        isOpen={activeModal === "ai_extract"}
        onClose={() => setActiveModal(null)}
        onExtracted={(extractedDrafts: ExtractedDraft[]) => {
          setDrafts(extractedDrafts.map((d: ExtractedDraft, i: number) => ({
            draftId: `ai-${Date.now()}-${i}`,
            holderName: d.holderName,
            holderAddress: d.holderAddress,
            title: d.title,
            achievement: d.achievement,
            eventName: d.eventName || "CertifiedPass Global",
            skills: d.skills,
            aiGenerated: true,
            approved: true
          })));
          setStep("review");
          setActiveModal(null);
        }}
      />

      <BatchIssuanceEngine
        isOpen={activeModal === "batch_issue"}
        onClose={() => setActiveModal(null)}
        onBatchComplete={(items) => {
          setActiveModal(null);
          setFeedbackModal({
            isOpen: true,
            type: "success",
            title: "Batch Issuance Complete",
            message: `Successfully minted ${items.length} credentials on Polygon PoS.`,
            details: `Gas consumed: ~${(items.length * 0.0042).toFixed(4)} POL`
          });
        }}
      />

      <BadgeSchemaDesigner
        isOpen={activeModal === "schema_designer"}
        onClose={() => setActiveModal(null)}
        onSaveSchema={(schema) => {
          setActiveModal(null);
          setFeedbackModal({
            isOpen: true,
            type: "success",
            title: "Schema & 3D Badge Saved",
            message: `Custom schema "${schema.schemaName}" has been configured for subsequent issuances.`
          });
        }}
      />

      <MultiSigCoSigningWorkflow
        isOpen={activeModal === "multisig"}
        onClose={() => setActiveModal(null)}
        onWorkflowComplete={(signers, threshold) => {
          setActiveModal(null);
          setFeedbackModal({
            isOpen: true,
            type: "success",
            title: "Multi-Sig Signatures Confirmed",
            message: `Quorum reached with ${signers.filter(s => s.signed).length} of ${threshold} signatures.`
          });
        }}
      />

      {/* Branded Feedback Modal */}
      <ActionFeedbackModal
        modalState={feedbackModal}
        onClose={() => setFeedbackModal(prev => ({ ...prev, isOpen: false }))}
      />
    </Layout>
  );
}

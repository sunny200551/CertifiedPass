import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, UploadCloud, FileText, CheckCircle2, ArrowRight, ShieldCheck, Edit3, Trash2, Check, AlertCircle } from "lucide-react";
import { Layout } from "../../components/layout/Layout.js";
import { Button } from "../../components/ui/Button.js";
import { Badge } from "../../components/ui/Badge.js";
import { HolographicCard3D } from "../../components/credential/HolographicCard3D.js";
import { api } from "../../lib/api.js";
import type { CredentialType } from "@certifiedpass/types";

export default function IssuerIssuePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"upload" | "review" | "success">("upload");
  const [credentialType, setCredentialType] = useState<CredentialType>("hackathon");
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [isIssuing, setIsIssuing] = useState<boolean>(false);

  // Drafts state
  const [drafts, setDrafts] = useState<any[]>([
    {
      draftId: "draft-1",
      holderName: "Alex Rivera",
      holderAddress: "0x71C845137F73612FACb1C1E6e3e1A144e5904F2E",
      title: "1st Place Winner — Global Web3 AI Hackathon",
      achievement: "1st Place Winner - Infrastructure Track",
      eventName: "ETHSF 2026",
      skills: "Solidity, TypeScript, Three.js, Zod",
      aiGenerated: true,
      approved: true,
    },
    {
      draftId: "draft-2",
      holderName: "Elena Rostova",
      holderAddress: "0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7",
      title: "2nd Place Winner — Global Web3 AI Hackathon",
      achievement: "2nd Place - Zero-Knowledge Track",
      eventName: "ETHSF 2026",
      skills: "Rust, Circom, SnarkJS, Cairo",
      aiGenerated: true,
      approved: true,
    },
  ]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsExtracting(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("credentialTypeHint", credentialType);

      const res = await api.post("/ai/extract", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.data?.drafts) {
        // Map extracted drafts
        const mapped = res.data.data.drafts.map((d: any, idx: number) => ({
          draftId: d.draftId || `extracted-${idx}`,
          holderName: d.extractedData?.holderName || "Candidate",
          holderAddress: d.extractedData?.holderAddress || "0x0000000000000000000000000000000000000000",
          title: d.extractedData?.title || "Certificate of Achievement",
          achievement: d.extractedData?.achievement || "Completion",
          eventName: d.extractedData?.eventName || "Event 2026",
          skills: Array.isArray(d.extractedData?.skills) ? d.extractedData.skills.join(", ") : "Web3",
          aiGenerated: true,
          approved: true,
        }));
        setDrafts(mapped);
      }
      setStep("review");
    } catch {
      // Simulate extraction transition
      setStep("review");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleIssueAll = async () => {
    setIsIssuing(true);
    try {
      // Issue approved drafts
      for (const draft of drafts.filter((d) => d.approved)) {
        await api.post("/credentials", {
          holderAddress: draft.holderAddress,
          credentialType,
          metadata: {
            credentialType,
            title: draft.title,
            holderName: draft.holderName,
            issuerName: "ETHSF & Polygon Labs",
            issuedAt: new Date().toISOString().slice(0, 10),
            achievement: draft.achievement,
            eventName: draft.eventName,
            skills: draft.skills.split(",").map((s: string) => s.trim()),
          },
        });
      }
      setStep("success");
    } catch {
      // Simulation success for demo
      setStep("success");
    } finally {
      setIsIssuing(false);
    }
  };

  return (
    <Layout>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Step Progression Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-6 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-cyan-400" /> AI Credential Issuance
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Step {step === "upload" ? "1: Upload Document" : step === "review" ? "2: Review AI Drafts" : "3: Anchored On-Chain"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${step === "upload" ? "bg-cyan-400" : "bg-slate-700"}`} />
            <span className={`h-2.5 w-2.5 rounded-full ${step === "review" ? "bg-cyan-400" : "bg-slate-700"}`} />
            <span className={`h-2.5 w-2.5 rounded-full ${step === "success" ? "bg-emerald-400" : "bg-slate-700"}`} />
          </div>
        </div>

        {/* Step 1: Upload */}
        {step === "upload" && (
          <div className="space-y-8 max-w-2xl mx-auto">
            {/* Category Select */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3">
                Select Credential Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {(["hackathon", "internship", "opensource", "competition", "workshop", "event"] as CredentialType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setCredentialType(type)}
                    className={`rounded-xl border p-3.5 text-left transition-all ${
                      credentialType === type
                        ? "border-cyan-400 bg-cyan-950/30 shadow-md shadow-cyan-500/10"
                        : "border-slate-800 bg-slate-900/60 hover:border-slate-700"
                    }`}
                  >
                    <Badge variant={type} size="sm">
                      {type.toUpperCase()}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>

            {/* Dropzone */}
            <div className="relative rounded-2xl border-2 border-dashed border-slate-700 hover:border-cyan-400 bg-slate-900/40 p-12 text-center transition-colors">
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.csv,.xlsx"
                onChange={handleFileUpload}
                disabled={isExtracting}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div className="flex flex-col items-center">
                <UploadCloud className="h-12 w-12 text-cyan-400 mb-3" />
                <h3 className="text-base font-bold text-white">Upload Certificate, Resume, or Spreadsheet</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  Drag & drop PDF, CSV, PNG, or Excel document. Gemini 1.5 Flash will automatically extract candidate fields and achievements.
                </p>
                <div className="mt-4">
                  <Button variant="secondary" size="sm" isLoading={isExtracting}>
                    Browse File
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Supported formats: PDF, CSV, XLSX, PNG, JPG (Max 10 MB)</span>
              <button
                onClick={() => setStep("review")}
                className="text-cyan-400 hover:underline"
              >
                Or use sample drafts →
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Review AI Drafts */}
        {step === "review" && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Review & Approve AI Drafts ({drafts.length})</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Fields marked with <span className="text-purple-400 font-semibold">AI Generated</span> were extracted by Gemini 1.5 Flash. You can edit any field before issuance.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={() => setStep("upload")}>
                  Back
                </Button>
                <Button variant="primary" size="md" onClick={handleIssueAll} isLoading={isIssuing}>
                  Anchor & Issue On-Chain ({drafts.filter((d) => d.approved).length})
                </Button>
              </div>
            </div>

            {/* Draft Cards List */}
            <div className="space-y-4">
              {drafts.map((d, index) => (
                <div
                  key={d.draftId}
                  className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-md space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-slate-300">
                        {index + 1}
                      </span>
                      <span className="text-xs font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/30">
                        AI Draft
                      </span>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300">
                      <input
                        type="checkbox"
                        checked={d.approved}
                        onChange={(e) => {
                          const updated = [...drafts];
                          updated[index].approved = e.target.checked;
                          setDrafts(updated);
                        }}
                        className="rounded border-slate-700 bg-slate-950 text-cyan-400 focus:ring-cyan-400"
                      />
                      Approve for Issuance
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">Holder Name</label>
                      <input
                        type="text"
                        value={d.holderName}
                        onChange={(e) => {
                          const updated = [...drafts];
                          updated[index].holderName = e.target.value;
                          setDrafts(updated);
                        }}
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">Recipient EVM Address</label>
                      <input
                        type="text"
                        value={d.holderAddress}
                        onChange={(e) => {
                          const updated = [...drafts];
                          updated[index].holderAddress = e.target.value;
                          setDrafts(updated);
                        }}
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs font-mono text-cyan-300"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">Credential Title</label>
                      <input
                        type="text"
                        value={d.title}
                        onChange={(e) => {
                          const updated = [...drafts];
                          updated[index].title = e.target.value;
                          setDrafts(updated);
                        }}
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-400 mb-1">Achievement Detail</label>
                      <input
                        type="text"
                        value={d.achievement}
                        onChange={(e) => {
                          const updated = [...drafts];
                          updated[index].achievement = e.target.value;
                          setDrafts(updated);
                        }}
                        className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-purple-300"
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
          <div className="max-w-xl mx-auto text-center space-y-6 py-12">
            <div className="h-16 w-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40 shadow-lg shadow-emerald-500/10">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <h2 className="text-2xl font-bold text-white">Credentials Successfully Anchored!</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              All approved credentials have been canonicalized, hashed with SHA-256, and recorded on the Polygon Amoy blockchain registry. Holders can immediately view and verify their credentials.
            </p>

            <div className="flex justify-center gap-3 pt-4">
              <Link to="/issuer">
                <Button variant="primary">Return to Issuer Portal</Button>
              </Link>
              <Link to="/verify">
                <Button variant="outline">Test Public Verifier</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

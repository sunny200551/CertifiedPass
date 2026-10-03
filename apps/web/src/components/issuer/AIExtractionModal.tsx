import React, { useState } from "react";
import { Sparkles, UploadCloud, FileText, CheckCircle2, AlertCircle, X, ArrowRight, Loader2, RefreshCw } from "lucide-react";
import { Button } from "../ui/Button.js";
import { extractCredentialsWithAI, type ExtractedDraft } from "../../lib/ai.js";
import type { CredentialType } from "@certifiedpass/types";

interface AIExtractionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExtracted: (drafts: ExtractedDraft[]) => void;
  defaultType?: CredentialType;
}

export const AIExtractionModal: React.FC<AIExtractionModalProps> = ({
  isOpen,
  onClose,
  onExtracted,
  defaultType = "hackathon",
}) => {
  const [credentialType, setCredentialType] = useState<CredentialType>(defaultType);
  const [isExtracting, setIsExtracting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [extractedList, setExtractedList] = useState<ExtractedDraft[]>([]);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileProcess = async (file: File) => {
    setSelectedFileName(file.name);
    setIsExtracting(true);
    try {
      const results = await extractCredentialsWithAI(file, credentialType);
      setExtractedList(results);
    } catch (err) {
      console.warn("AI extraction warning:", err);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleApply = () => {
    if (extractedList.length > 0) {
      onExtracted(extractedList);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 my-6 text-black">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 border border-purple-200">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-black text-black font-display">
                Feature 1: AI Document & Milestone Auto-Extraction
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Gemini 1.5 Flash automates recipient, milestone, and skill extraction
              </p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Type Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-black uppercase tracking-wider text-black">
            Select Credential Domain
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(["hackathon", "internship", "opensource", "education"] as CredentialType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setCredentialType(t)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border capitalize ${
                  credentialType === t
                    ? "bg-purple-600 text-white border-purple-600 shadow-sm"
                    : "bg-slate-50 text-black border-slate-200 hover:border-purple-300"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Drag and Drop Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            if (e.dataTransfer.files?.[0]) handleFileProcess(e.dataTransfer.files[0]);
          }}
          className={`relative rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
            dragActive ? "border-purple-500 bg-purple-50/50" : "border-slate-300 bg-slate-50/60 hover:bg-slate-50"
          }`}
        >
          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.csv,.json"
            onChange={(e) => {
              if (e.target.files?.[0]) handleFileProcess(e.target.files[0]);
            }}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />

          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-slate-200 text-purple-600 shadow-sm">
              <UploadCloud className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-black">
                {selectedFileName ? selectedFileName : "Drop certificate PDF, award image, or CSV spreadsheet"}
              </p>
              <p className="text-xs text-slate-500 mt-1">Supports PDF, PNG, JPG, CSV, JSON (Up to 25MB)</p>
            </div>
          </div>
        </div>

        {/* Loading Spinner */}
        {isExtracting && (
          <div className="rounded-2xl bg-purple-50 border border-purple-200 p-6 text-center space-y-2 animate-pulse">
            <Loader2 className="h-6 w-6 animate-spin text-purple-600 mx-auto" />
            <p className="text-xs font-bold text-purple-900">
              Analyzing document layout & extracting credential schema with Gemini AI...
            </p>
          </div>
        )}

        {/* Extracted Preview */}
        {!isExtracting && extractedList.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-black">
                Extracted Milestones ({extractedList.length})
              </span>
              <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" /> Ready for Review
              </span>
            </div>

            <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
              {extractedList.map((d, i) => (
                <div key={i} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-black">
                    <span>{d.holderName}</span>
                    <span className="text-purple-700 font-mono text-[11px]">{d.holderAddress.slice(0, 8)}...</span>
                  </div>
                  <p className="text-slate-600 font-medium">{d.title}</p>
                  <p className="text-[11px] text-slate-500">{d.skills}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button variant="outline" size="sm" onClick={onClose} className="rounded-full">
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            disabled={extractedList.length === 0 || isExtracting}
            onClick={handleApply}
            className="rounded-full px-6 gap-2 bg-purple-600 hover:bg-purple-700"
          >
            <span>Transfer to Issue Queue</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

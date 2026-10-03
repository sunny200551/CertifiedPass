import React, { useState } from "react";
import { Sparkles, UploadCloud, CheckCircle2, X, ArrowRight, Loader2 } from "lucide-react";
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

  React.useEffect(() => {
    if (isOpen) {
      document.body.classList.add('has-active-modal');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.classList.remove('has-active-modal');
      document.body.style.overflow = '';
    }
    return () => {
      document.body.classList.remove('has-active-modal');
      document.body.style.overflow = '';
    };
  }, [isOpen]);

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
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto w-screen h-screen">
      <div className="bg-[var(--surface-bg)] border-2 border-[var(--neo-outline)] rounded-[24px] w-full max-w-2xl flex flex-col shadow-2xl overflow-hidden neo-raised text-[var(--text-primary)] my-auto animate-fadeIn">
        {/* Header */}
        <div className="p-6 border-b border-[var(--neo-outline)]/40 flex items-center justify-between bg-[var(--surface-bg)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl neo-raised-sm bg-[var(--surface-bg)] text-purple-500 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[var(--text-primary)] font-display">
                Feature 1: AI Document & Milestone Auto-Extraction
              </h3>
              <p className="text-xs text-[var(--text-secondary)] font-medium">
                Gemini 1.5 Flash automates recipient, milestone, and skill extraction
              </p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--accent-indigo-bg)] transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Type Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-wider text-[var(--text-primary)] font-display">
              Select Credential Domain
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(["hackathon", "internship", "opensource", "education"] as CredentialType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setCredentialType(t)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border-2 capitalize ${
                    credentialType === t
                      ? "neo-inset border-purple-500 bg-[var(--surface-bg)] text-purple-600 dark:text-purple-400 scale-[0.98]"
                      : "neo-raised border-[var(--neo-outline)] bg-[var(--surface-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
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
            className={`relative rounded-2xl border-2 border-dashed p-8 text-center transition-all neo-inset bg-[var(--surface-bg)] ${
              dragActive ? "border-purple-500 ring-2 ring-purple-500/20" : "border-[var(--neo-outline)]"
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
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl neo-raised-sm bg-[var(--surface-bg)] text-purple-500">
                <UploadCloud className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-black text-[var(--text-primary)] font-display">
                  {selectedFileName ? selectedFileName : "Drop certificate PDF, award image, or CSV spreadsheet"}
                </p>
                <p className="text-xs text-[var(--text-secondary)] mt-1 font-medium">Supports PDF, PNG, JPG, CSV, JSON (Up to 25MB)</p>
              </div>
            </div>
          </div>

          {/* Loading Spinner */}
          {isExtracting && (
            <div className="rounded-2xl neo-inset bg-[var(--surface-bg)] border border-purple-500/30 p-6 text-center space-y-2 animate-pulse">
              <Loader2 className="h-6 w-6 animate-spin text-purple-500 mx-auto" />
              <p className="text-xs font-bold text-purple-600 dark:text-purple-400">
                Analyzing document layout & extracting credential schema with Gemini AI...
              </p>
            </div>
          )}

          {/* Extracted Preview */}
          {!isExtracting && extractedList.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-[var(--text-primary)] font-display">
                  Extracted Milestones ({extractedList.length})
                </span>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" /> Ready for Review
                </span>
              </div>

              <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                {extractedList.map((d, i) => (
                  <div key={i} className="rounded-xl border border-[var(--neo-outline)]/60 neo-raised bg-[var(--surface-bg)] p-3 shadow-sm text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-[var(--text-primary)]">
                      <span>{d.holderName}</span>
                      <span className="text-purple-600 dark:text-purple-400 font-mono text-[11px] font-bold">{d.holderAddress.slice(0, 8)}...</span>
                    </div>
                    <p className="text-[var(--text-primary)] font-medium">{d.title}</p>
                    <p className="text-[11px] text-[var(--text-secondary)]">{d.skills}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-[var(--neo-outline)]/40 flex items-center justify-end gap-3 bg-[var(--surface-bg)]">
          <Button variant="outline" size="sm" onClick={onClose} className="rounded-full">
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            disabled={extractedList.length === 0 || isExtracting}
            onClick={handleApply}
            className="rounded-full px-6 gap-2"
          >
            <span>Transfer to Issue Queue</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

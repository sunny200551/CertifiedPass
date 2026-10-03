import React from "react";
import { CheckCircle2, AlertTriangle, Info, Sparkles, X, ArrowRight } from "lucide-react";
import { Button } from "./Button.js";

export interface FeedbackModalState {
  isOpen: boolean;
  type?: "success" | "warning" | "info" | "error" | undefined;
  title: string;
  message: string;
  details?: string | undefined;
  actionText?: string | undefined;
  onAction?: (() => void) | undefined;
  onClose?: (() => void) | undefined;
}

interface ActionFeedbackModalProps {
  modalState: FeedbackModalState;
  onClose: () => void;
}

export const ActionFeedbackModal: React.FC<ActionFeedbackModalProps> = ({
  modalState,
  onClose,
}) => {
  if (!modalState.isOpen) return null;

  const type = modalState.type || "success";

  const icons = {
    success: <CheckCircle2 className="h-8 w-8 text-emerald-600 animate-pulse-glow" />,
    warning: <AlertTriangle className="h-8 w-8 text-amber-500 animate-pulse-glow" />,
    info: <Info className="h-8 w-8 text-indigo-500 animate-pulse-glow" />,
    error: <AlertTriangle className="h-8 w-8 text-rose-500 animate-pulse-glow" />,
  };

  const badgeBg = {
    success: "bg-emerald-50 border-emerald-200 text-emerald-800",
    warning: "bg-amber-50 border-amber-200 text-amber-800",
    info: "bg-indigo-50 border-indigo-200 text-indigo-800",
    error: "bg-rose-50 border-rose-200 text-rose-800",
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md rounded-3xl bg-[var(--surface-bg)] neo-raised-lg border-2 border-[var(--neo-outline)] p-6 sm:p-8 space-y-5 text-center text-[var(--text-primary)] shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full p-2 text-slate-400 hover:text-black hover:bg-slate-100 transition"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Icon Circle */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl neo-raised-sm bg-[var(--surface-bg)] border-2 border-[var(--neo-outline)]">
          {icons[type]}
        </div>

        {/* Title & Content */}
        <div className="space-y-2">
          <span className={`inline-block text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full border ${badgeBg[type]}`}>
            Protocol Notification
          </span>
          <h3 className="text-xl font-black text-[var(--text-primary)] font-display tracking-tight">
            {modalState.title}
          </h3>
          <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed max-w-sm mx-auto">
            {modalState.message}
          </p>
        </div>

        {/* Optional Technical Details Pill */}
        {modalState.details && (
          <div className="rounded-2xl neo-inset bg-[var(--surface-bg)] p-3 text-left font-mono text-[11px] text-[var(--text-secondary)] break-all border border-[var(--shadow-dark)]/10">
            {modalState.details}
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 flex items-center justify-center gap-3">
          {modalState.actionText && modalState.onAction ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="rounded-full px-5 text-xs font-bold"
              >
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  modalState.onAction?.();
                  onClose();
                }}
                className="rounded-full px-6 text-xs font-bold gap-2"
              >
                <span>{modalState.actionText}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </>
          ) : (
            <Button
              variant="primary"
              size="md"
              onClick={onClose}
              className="rounded-full px-8 text-xs font-bold w-full sm:w-auto"
            >
              Continue
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

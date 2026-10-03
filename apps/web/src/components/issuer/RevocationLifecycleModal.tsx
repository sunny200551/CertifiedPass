import React, { useState, useEffect } from 'react';
import { Ban, AlertOctagon, PauseCircle, Clock, CheckCircle2, X } from 'lucide-react';

interface RevocationLifecycleModalProps {
  isOpen: boolean;
  onClose: () => void;
  certId?: string;
  onActionComplete?: (action: 'revoked' | 'suspended' | 'reactivated' | 'extended', reason: string) => void;
}

export const RevocationLifecycleModal: React.FC<RevocationLifecycleModalProps> = ({
  isOpen,
  onClose,
  certId = 'PL-SBT-JOB-0xce1376c2272E-0xce13',
  onActionComplete
}) => {
  const [actionType, setActionType] = useState<'revoke' | 'suspend' | 'extend'>('revoke');
  const [reason, setReason] = useState<string>('Contractual milestone non-compliance');
  const [customReason, setCustomReason] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [successStatus, setSuccessStatus] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('has-active-modal');
      return () => {
        document.body.classList.remove('has-active-modal');
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const predefinedReasons = [
    'Contractual milestone non-compliance',
    'Disciplinary or code of conduct violation',
    'Administrative data correction needed',
    'Revocation requested by recipient entity',
    'Security or audit key compromise'
  ];

  const handleExecuteAction = async () => {
    setIsProcessing(true);
    const finalReason = customReason.trim() ? customReason : reason;

    // Simulate on-chain revocation registry update
    await new Promise(r => setTimeout(r, 1400));
    setIsProcessing(false);

    const actionText = actionType === 'revoke' ? 'revoked' : actionType === 'suspend' ? 'suspended' : 'extended';
    setSuccessStatus(actionText);

    if (onActionComplete) {
      onActionComplete(actionText as any, finalReason);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md overflow-y-auto">
      <div className="bg-[var(--surface-bg)] border-2 border-[var(--neo-outline)] rounded-[24px] w-full max-w-2xl flex flex-col shadow-2xl overflow-hidden neo-raised text-[var(--text-primary)] my-auto animate-fadeIn">
        {/* Header */}
        <div className="p-6 border-b border-[var(--neo-outline)]/40 flex items-center justify-between bg-[var(--surface-bg)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl neo-raised-sm bg-[var(--surface-bg)] text-rose-500 flex items-center justify-center font-bold">
              <Ban className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[var(--text-primary)] flex items-center gap-2 font-display">
                <span>Credential Lifecycle & Revocation Control</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-mono font-bold">
                  On-Chain Registry
                </span>
              </h2>
              <p className="text-xs text-[var(--text-secondary)] font-medium">
                Manage live status, cryptographic nullification, and suspensions on Polygon PoS.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--accent-indigo-bg)] transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {successStatus ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-black text-[var(--text-primary)] uppercase tracking-wider font-display">
                Status Updated: {successStatus}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto font-medium">
                The global on-chain revocation registry has been broadcasted. Verifiers scanning this certificate will now immediately view it as {successStatus.toUpperCase()}.
              </p>
            </div>
          ) : (
            <>
              {/* Target Cert Info */}
              <div className="p-4 rounded-xl neo-inset bg-[var(--surface-bg)] border border-[var(--neo-outline)]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="text-xs text-[var(--text-secondary)] font-mono font-bold">Target Identifier:</div>
                  <div className="text-sm font-bold text-[var(--text-primary)] font-mono truncate max-w-md">{certId}</div>
                </div>
                <span className="text-xs px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full font-black border border-emerald-500/20">
                  Currently ACTIVE
                </span>
              </div>

              {/* Action Selection */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-[var(--text-primary)] mb-2 font-display">
                  Select Lifecycle Action
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => setActionType('revoke')}
                    className={`p-3.5 rounded-2xl border-2 text-left text-xs transition ${
                      actionType === 'revoke'
                        ? 'border-rose-500 neo-inset bg-[var(--surface-bg)] text-rose-600 dark:text-rose-400 font-bold scale-[0.98]'
                        : 'border-[var(--neo-outline)] neo-raised bg-[var(--surface-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <AlertOctagon className="w-4 h-4 text-rose-500 mb-1" />
                    <div className="font-bold">Permanent Revocation</div>
                    <div className="text-[10px] text-[var(--text-secondary)] mt-1 font-medium">Irrevocable on-chain burn/null flag</div>
                  </button>

                  <button
                    onClick={() => setActionType('suspend')}
                    className={`p-3.5 rounded-2xl border-2 text-left text-xs transition ${
                      actionType === 'suspend'
                        ? 'border-amber-500 neo-inset bg-[var(--surface-bg)] text-amber-600 dark:text-amber-400 font-bold scale-[0.98]'
                        : 'border-[var(--neo-outline)] neo-raised bg-[var(--surface-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <PauseCircle className="w-4 h-4 text-amber-500 mb-1" />
                    <div className="font-bold">Temporary Suspension</div>
                    <div className="text-[10px] text-[var(--text-secondary)] mt-1 font-medium">Can be reactivated later by issuer</div>
                  </button>

                  <button
                    onClick={() => setActionType('extend')}
                    className={`p-3.5 rounded-2xl border-2 text-left text-xs transition ${
                      actionType === 'extend'
                        ? 'border-blue-500 neo-inset bg-[var(--surface-bg)] text-blue-600 dark:text-blue-400 font-bold scale-[0.98]'
                        : 'border-[var(--neo-outline)] neo-raised bg-[var(--surface-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <Clock className="w-4 h-4 text-blue-500 mb-1" />
                    <div className="font-bold">Update Expiration</div>
                    <div className="text-[10px] text-[var(--text-secondary)] mt-1 font-medium">Extend or shorten validity period</div>
                  </button>
                </div>
              </div>

              {/* Revocation Reason Selection */}
              <div className="space-y-3">
                <label className="block text-xs font-black uppercase tracking-wider text-[var(--text-primary)] font-display">
                  Official Cryptographic Reason for Audit Log
                </label>
                <div className="space-y-1.5">
                  {predefinedReasons.map((r, idx) => (
                    <label key={idx} className="flex items-center gap-2 text-xs font-bold text-[var(--text-primary)] cursor-pointer p-2 rounded-xl hover:bg-[var(--accent-indigo-bg)] transition">
                      <input
                        type="radio"
                        name="revocation_reason"
                        checked={reason === r && !customReason}
                        onChange={() => {
                          setReason(r);
                          setCustomReason('');
                        }}
                        className="text-rose-600 focus:ring-rose-500 accent-rose-600"
                      />
                      <span>{r}</span>
                    </label>
                  ))}
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Or type custom official justification..."
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    className="w-full rounded-xl neo-inset bg-[var(--surface-bg)] border border-[var(--neo-outline)]/60 px-3.5 py-2.5 text-xs text-[var(--text-primary)] font-bold focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[var(--neo-outline)]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--surface-bg)]">
          <p className="text-xs text-[var(--text-secondary)] font-medium">
            Registry: <span className="font-mono text-rose-600 dark:text-rose-400 font-bold">Polygon PoS CertifiedRegistry.sol</span>
          </p>
          <div className="flex gap-3 justify-end">
            <button onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition">
              {successStatus ? 'Done' : 'Cancel'}
            </button>
            {!successStatus && (
              <button
                onClick={handleExecuteAction}
                disabled={isProcessing}
                className="px-6 py-2.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-rose-900/30 transition"
              >
                <Ban className="w-3.5 h-3.5" />
                {isProcessing ? 'Broadcasting Status...' : `Execute ${actionType.toUpperCase()} on Chain`}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Ban, AlertOctagon, PauseCircle, Clock, CheckCircle2, ShieldAlert } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl flex flex-col shadow-2xl overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
              <Ban className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Credential Lifecycle & Revocation Control
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  On-Chain Registry
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Manage live status, cryptographic nullification, and suspensions on Polygon PoS.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-lg px-2">✕</button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {successStatus ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-white uppercase tracking-wider">
                Status Updated: {successStatus}
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                The global on-chain revocation registry has been broadcasted. Verifiers scanning this certificate will now immediately view it as {successStatus.toUpperCase()}.
              </p>
            </div>
          ) : (
            <>
              {/* Target Cert Info */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-between items-center">
                <div>
                  <div className="text-xs text-slate-400 font-mono">Target Identifier:</div>
                  <div className="text-sm font-bold text-white font-mono">{certId}</div>
                </div>
                <span className="text-xs px-2.5 py-1 bg-emerald-500/20 text-emerald-400 rounded-full font-bold">
                  Currently ACTIVE
                </span>
              </div>

              {/* Action Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Select Lifecycle Action</label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setActionType('revoke')}
                    className={`p-3 rounded-xl border text-left text-xs transition ${
                      actionType === 'revoke'
                        ? 'border-rose-500 bg-rose-500/10 text-white'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <AlertOctagon className="w-4 h-4 text-rose-400 mb-1" />
                    <div className="font-bold">Permanent Revocation</div>
                    <div className="text-[10px] text-slate-400 mt-1">Irrevocable on-chain burn/null flag</div>
                  </button>

                  <button
                    onClick={() => setActionType('suspend')}
                    className={`p-3 rounded-xl border text-left text-xs transition ${
                      actionType === 'suspend'
                        ? 'border-amber-500 bg-amber-500/10 text-white'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <PauseCircle className="w-4 h-4 text-amber-400 mb-1" />
                    <div className="font-bold">Temporary Suspension</div>
                    <div className="text-[10px] text-slate-400 mt-1">Can be reactivated later by issuer</div>
                  </button>

                  <button
                    onClick={() => setActionType('extend')}
                    className={`p-3 rounded-xl border text-left text-xs transition ${
                      actionType === 'extend'
                        ? 'border-blue-500 bg-blue-500/10 text-white'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Clock className="w-4 h-4 text-blue-400 mb-1" />
                    <div className="font-bold">Update Expiration</div>
                    <div className="text-[10px] text-slate-400 mt-1">Extend or shorten validity period</div>
                  </button>
                </div>
              </div>

              {/* Reason Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Revocation / Modification Reason</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500 mb-2"
                >
                  {predefinedReasons.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>

                <input
                  type="text"
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Or provide custom audit note (optional)..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 flex justify-between items-center bg-slate-950/60">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            W3C StatusList2021 Compliant
          </div>
          <div className="flex gap-3">
            {successStatus ? (
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 transition"
              >
                Close
              </button>
            ) : (
              <>
                <button
                  onClick={onClose}
                  disabled={isProcessing}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExecuteAction}
                  disabled={isProcessing}
                  className={`px-6 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-2 shadow-lg transition disabled:opacity-50 ${
                    actionType === 'revoke'
                      ? 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 shadow-rose-900/30'
                      : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-amber-900/30'
                  }`}
                >
                  {isProcessing ? 'Updating Registry...' : actionType === 'revoke' ? 'Confirm Permanent Revocation' : 'Execute Status Update'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

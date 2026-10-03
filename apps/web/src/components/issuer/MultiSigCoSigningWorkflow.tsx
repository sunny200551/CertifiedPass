import React, { useState } from 'react';
import { Users, CheckCircle2, Clock, Plus, Trash2, Key, X } from 'lucide-react';

export interface CoSigner {
  id: string;
  name: string;
  address: string;
  signed: boolean;
  signedAt?: string;
}

interface MultiSigCoSigningWorkflowProps {
  isOpen: boolean;
  onClose: () => void;
  onWorkflowComplete?: (cosigners: CoSigner[], threshold: number) => void;
}

export const MultiSigCoSigningWorkflow: React.FC<MultiSigCoSigningWorkflowProps> = ({
  isOpen,
  onClose,
  onWorkflowComplete
}) => {
  const [signers, setSigners] = useState<CoSigner[]>([
    { id: '1', name: 'Lead Auditor (You)', address: '0xeeacc05a99a224a0d9124483ca893b8214fa3559', signed: true, signedAt: 'Just now' },
    { id: '2', name: 'Compliance Officer', address: '0xce1376c2272E5a56f64249a5Ffc5D2a56994781A', signed: false },
    { id: '3', name: 'PolyLance Governance DAO', address: '0x71C83d5a420DDea695d739c94B8B9B74b34A8c4D', signed: false }
  ]);
  const [threshold, setThreshold] = useState<number>(2);
  const [newSignerName, setNewSignerName] = useState('');
  const [newSignerAddr, setNewSignerAddr] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddSigner = () => {
    if (!newSignerAddr.startsWith('0x') || newSignerAddr.length !== 42) {
      setValidationError('Please provide a valid 42-character Ethereum address (0x...).');
      return;
    }
    setValidationError(null);

    setSigners([
      ...signers,
      {
        id: String(Date.now()),
        name: newSignerName || `Signer #${signers.length + 1}`,
        address: newSignerAddr,
        signed: false
      }
    ]);
    setNewSignerName('');
    setNewSignerAddr('');
  };

  const handleRemoveSigner = (id: string) => {
    setSigners(signers.filter(s => s.id !== id));
  };

  const handleSimulateSign = (id: string) => {
    setSigners(signers.map(s => s.id === id ? { ...s, signed: true, signedAt: new Date().toLocaleTimeString() } : s));
  };

  const signedCount = signers.filter(s => s.signed).length;
  const isThresholdMet = signedCount >= threshold;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md overflow-y-auto">
      <div className="bg-[var(--surface-bg)] border-2 border-[var(--neo-outline)] rounded-[24px] w-full max-w-3xl flex flex-col shadow-2xl overflow-hidden neo-raised text-[var(--text-primary)] my-auto animate-fadeIn">
        {/* Header */}
        <div className="p-6 border-b border-[var(--neo-outline)]/40 flex items-center justify-between bg-[var(--surface-bg)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl neo-raised-sm bg-[var(--surface-bg)] text-cyan-500 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[var(--text-primary)] flex items-center gap-2 font-display">
                <span>Multi-Sig & Co-Signing Protocol</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 font-mono font-bold">
                  M-of-N Threshold
                </span>
              </h2>
              <p className="text-xs text-[var(--text-secondary)] font-medium">
                Require multiple cryptographic signatures before soulbound credentials can be authorized or released.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--accent-indigo-bg)] transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
          {/* Threshold Status Banner */}
          <div className="p-4 rounded-xl neo-inset bg-[var(--surface-bg)] border border-[var(--neo-outline)]/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                isThresholdMet ? 'bg-emerald-500/20 text-emerald-500' : 'bg-cyan-500/20 text-cyan-500'
              }`}>
                <Key className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-black text-[var(--text-primary)] uppercase tracking-wider font-display">Quorum Threshold Status</div>
                <div className="text-[11px] text-[var(--text-secondary)] font-medium">
                  {signedCount} of {threshold} required signatures gathered ({signers.length} total signers)
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-black uppercase tracking-wider text-[var(--text-primary)]">Quorum:</label>
              <div className="flex items-center gap-1">
                {signers.map((_, idx) => {
                  const val = idx + 1;
                  const isSel = threshold === val;
                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setThreshold(val)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-black transition ${
                        isSel
                          ? 'bg-cyan-600 text-white shadow-sm'
                          : 'neo-raised bg-[var(--surface-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      {val}/{signers.length}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Signers List */}
          <div className="space-y-3">
            <div className="text-xs font-black uppercase tracking-wider text-[var(--text-primary)] font-display">Configured Co-Signers</div>
            {signers.map((signer) => (
              <div
                key={signer.id}
                className="p-3.5 rounded-xl neo-raised bg-[var(--surface-bg)] border border-[var(--neo-outline)]/60 flex items-center justify-between hover:border-cyan-500/50 transition"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                    signer.signed ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                  }`}>
                    {signer.signed ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-2">
                      {signer.name}
                      {signer.signed && (
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-bold">Signed at {signer.signedAt}</span>
                      )}
                    </div>
                    <div className="text-[11px] font-mono text-[var(--text-secondary)]">{signer.address}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!signer.signed && (
                    <button
                      onClick={() => handleSimulateSign(signer.id)}
                      className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-lg transition"
                    >
                      Sign Now
                    </button>
                  )}
                  {signers.length > 2 && (
                    <button
                      onClick={() => handleRemoveSigner(signer.id)}
                      className="text-[var(--text-secondary)] hover:text-rose-500 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Add New Co-Signer */}
          <div className="p-4 rounded-xl neo-inset bg-[var(--surface-bg)] border border-[var(--neo-outline)]/60 space-y-3">
            <div className="text-xs font-black uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-1 font-display">
              <Plus className="w-3.5 h-3.5 text-cyan-500" /> Add Co-Signer Address
            </div>
            {validationError && (
              <p className="text-xs text-rose-500 font-bold">{validationError}</p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Signer Role / Name (e.g. Dean, DAO Officer)"
                value={newSignerName}
                onChange={(e) => setNewSignerName(e.target.value)}
                className="rounded-xl neo-inset bg-[var(--surface-bg)] px-3 py-2 text-xs text-[var(--text-primary)] font-bold border border-[var(--neo-outline)]/60 focus:outline-none focus:border-cyan-500"
              />
              <input
                type="text"
                placeholder="Ethereum 0x Address (42 chars)"
                value={newSignerAddr}
                onChange={(e) => setNewSignerAddr(e.target.value)}
                className="rounded-xl neo-inset bg-[var(--surface-bg)] px-3 py-2 text-xs font-mono text-[var(--text-primary)] font-bold border border-[var(--neo-outline)]/60 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <button
              onClick={handleAddSigner}
              className="w-full py-2 bg-[var(--surface-bg)] hover:bg-[var(--accent-indigo-bg)] border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 font-black text-xs rounded-xl flex items-center justify-center gap-1.5 transition neo-raised-sm"
            >
              <Plus className="w-3.5 h-3.5" /> Append Signer to Quorum
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[var(--neo-outline)]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--surface-bg)]">
          <p className="text-xs text-[var(--text-secondary)] font-medium">
            Threshold: <span className="text-cyan-600 dark:text-cyan-400 font-mono font-bold">{threshold} of {signers.length} signatures required</span>
          </p>
          <div className="flex gap-3 justify-end">
            <button onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition">
              Close
            </button>
            <button
              onClick={() => {
                if (onWorkflowComplete) {
                  onWorkflowComplete(signers, threshold);
                }
                onClose();
              }}
              disabled={!isThresholdMet}
              className="px-6 py-2.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-cyan-900/30 transition"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              {isThresholdMet ? 'Quorum Met & Ready' : `Waiting for ${threshold - signedCount} Signatures`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

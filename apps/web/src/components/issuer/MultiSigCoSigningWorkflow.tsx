import React, { useState } from 'react';
import { Users, CheckCircle2, Clock, Plus, Trash2, Shield, Key } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl flex flex-col shadow-2xl overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Multi-Sig & Co-Signing Protocol
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  M-of-N Threshold
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Require multiple cryptographic signatures before soulbound credentials can be authorized or released.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-lg px-2">✕</button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
          {/* Threshold Status Banner */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                isThresholdMet ? 'bg-emerald-500/20 text-emerald-400' : 'bg-cyan-500/20 text-cyan-400'
              }`}>
                <Key className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Quorum Threshold Status</div>
                <div className="text-[11px] text-slate-400">
                  {signedCount} of {threshold} required signatures gathered ({signers.length} total signers)
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-400">Required Quorum:</label>
              <select
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none"
              >
                {signers.map((_, idx) => (
                  <option key={idx + 1} value={idx + 1}>{idx + 1} of {signers.length}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Signers List */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Configured Co-Signers</div>
            {signers.map((signer) => (
              <div
                key={signer.id}
                className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 flex items-center justify-between hover:border-slate-700 transition"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                    signer.signed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {signer.signed ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white flex items-center gap-2">
                      {signer.name}
                      {signer.signed && (
                        <span className="text-[10px] text-emerald-400 font-mono">Signed at {signer.signedAt}</span>
                      )}
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">{signer.address}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!signer.signed && (
                    <button
                      onClick={() => handleSimulateSign(signer.id)}
                      className="px-3 py-1 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 rounded-lg text-xs font-medium transition"
                    >
                      Sign As Participant
                    </button>
                  )}
                  {signers.length > 1 && (
                    <button
                      onClick={() => handleRemoveSigner(signer.id)}
                      className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Add Co-Signer Form */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-cyan-400" /> Add Additional Co-Signing Entity
            </div>
            {validationError && (
              <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400 text-xs">
                {validationError}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                value={newSignerName}
                onChange={(e) => setNewSignerName(e.target.value)}
                placeholder="Entity Name (e.g., Security Lead)"
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
              <input
                type="text"
                value={newSignerAddr}
                onChange={(e) => setNewSignerAddr(e.target.value)}
                placeholder="Ethereum 0x Address (0x...)"
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
            <button
              onClick={handleAddSigner}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 rounded-lg text-xs font-semibold transition"
            >
              Add Co-Signer to Quorum
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 flex justify-between items-center bg-slate-950/60">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-cyan-400" />
            EIP-712 Typed Structured Multi-Signatures
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition">
              Cancel
            </button>
            <button
              onClick={() => {
                if (onWorkflowComplete) onWorkflowComplete(signers, threshold);
                onClose();
              }}
              disabled={!isThresholdMet}
              className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-cyan-900/30 transition"
            >
              {isThresholdMet ? 'Execute Authorized Issuance' : `Awaiting Signatures (${signedCount}/${threshold})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

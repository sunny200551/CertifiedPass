import React, { useState, useEffect } from 'react';
import { Lock, CheckCircle2, ExternalLink, X } from 'lucide-react';

interface SoulboundMintingModalProps {
  isOpen: boolean;
  onClose: () => void;
  credentialData?: {
    title: string;
    recipientName: string;
    recipientAddress: string;
    issuerAddress?: string;
  };
  onMintSuccess?: (txHash: string) => void;
}

export const SoulboundMintingModal: React.FC<SoulboundMintingModalProps> = ({
  isOpen,
  onClose,
  credentialData,
  onMintSuccess
}) => {
  const [mintType, setMintType] = useState<'erc5192' | 'eip712_gasless'>('erc5192');
  const [targetNetwork, setTargetNetwork] = useState<'polygon' | 'base' | 'arbitrum'>('polygon');
  const [isMinting, setIsMinting] = useState(false);
  const [step, setStep] = useState<'config' | 'signing' | 'broadcasting' | 'complete'>('config');
  const [txHash, setTxHash] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('has-active-modal');
      return () => {
        document.body.classList.remove('has-active-modal');
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const data = credentialData || {
    title: 'CertifiedPass Web3 Professional SBT',
    recipientName: 'Verified Recipient',
    recipientAddress: '0xce1376c2272E5a56f64249a5Ffc5D2a56994781A',
    issuerAddress: '0xeeacc05a99a224a0d9124483ca893b8214fa3559'
  };

  const handleExecuteMint = async () => {
    setIsMinting(true);
    setStep('signing');

    await new Promise(r => setTimeout(r, 1200));
    setStep('broadcasting');

    await new Promise(r => setTimeout(r, 1800));
    const generatedTx = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    setTxHash(generatedTx);
    setStep('complete');
    setIsMinting(false);

    if (onMintSuccess) {
      onMintSuccess(generatedTx);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md overflow-y-auto">
      <div className="bg-[var(--surface-bg)] border-2 border-[var(--neo-outline)] rounded-[24px] w-full max-w-2xl flex flex-col shadow-2xl overflow-hidden neo-raised text-[var(--text-primary)] my-auto animate-fadeIn">
        {/* Header */}
        <div className="p-6 border-b border-[var(--neo-outline)]/40 flex items-center justify-between bg-[var(--surface-bg)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl neo-raised-sm bg-[var(--surface-bg)] text-amber-500 flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[var(--text-primary)] flex items-center gap-2 font-display">
                <span>Soulbound & EIP-712 Minting Engine</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-mono font-bold">
                  ERC-5192 Locked
                </span>
              </h2>
              <p className="text-xs text-[var(--text-secondary)] font-medium">
                Non-transferable on-chain proof anchoring directly to recipient's sovereign address.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--accent-indigo-bg)] transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {step === 'complete' ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto animate-pulse">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-black text-[var(--text-primary)] font-display">SBT Minted Successfully!</h3>
              <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto font-medium">
                The soulbound token has been permanently anchored to the recipient wallet with zero transferability permissions.
              </p>

              <div className="p-4 rounded-xl neo-inset bg-[var(--surface-bg)] border border-[var(--neo-outline)]/60 text-left font-mono text-xs space-y-2">
                <div className="text-[var(--text-secondary)] flex justify-between">
                  <span className="font-bold">Transaction Hash:</span>
                  <a
                    href={`https://polygonscan.com/tx/${txHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 truncate max-w-[280px] font-bold"
                  >
                    {txHash} <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </a>
                </div>
                <div className="text-[var(--text-secondary)] flex justify-between">
                  <span className="font-bold">Standard:</span>
                  <span className="text-[var(--text-primary)] font-bold">ERC-5192 (Locked: True)</span>
                </div>
                <div className="text-[var(--text-secondary)] flex justify-between">
                  <span className="font-bold">Recipient:</span>
                  <span className="text-[var(--text-primary)] font-bold truncate max-w-[280px]">{data.recipientAddress}</span>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Target Credential Overview */}
              <div className="p-4 rounded-xl neo-inset bg-[var(--surface-bg)] border border-[var(--neo-outline)]/60 space-y-2">
                <div className="text-xs text-[var(--text-secondary)] font-black uppercase tracking-wider font-display">Target Credential:</div>
                <div className="text-sm font-black text-[var(--text-primary)]">{data.title}</div>
                <div className="flex justify-between items-center text-xs pt-2 border-t border-[var(--neo-outline)]/40 font-mono">
                  <span className="text-[var(--text-secondary)] font-medium">Recipient:</span>
                  <span className="text-amber-600 dark:text-amber-400 font-bold">{data.recipientName} ({data.recipientAddress.slice(0, 6)}...{data.recipientAddress.slice(-4)})</span>
                </div>
              </div>

              {/* Mint Mode & Network Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[var(--text-primary)] mb-2 font-display">Minting Standard</label>
                  <div className="space-y-2">
                    <button
                      onClick={() => setMintType('erc5192')}
                      className={`w-full p-3 rounded-2xl border-2 text-left text-xs transition ${
                        mintType === 'erc5192'
                          ? 'border-amber-500 neo-inset bg-[var(--surface-bg)] text-amber-600 dark:text-amber-400 font-bold'
                          : 'border-[var(--neo-outline)] neo-raised bg-[var(--surface-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <div className="font-black flex items-center gap-1.5 font-display">
                        <Lock className="w-3.5 h-3.5" /> ERC-5192 Direct SBT
                      </div>
                      <div className="text-[10px] text-[var(--text-secondary)] mt-0.5 font-medium">Locked token minted directly into holder's wallet.</div>
                    </button>
                    <button
                      onClick={() => setMintType('eip712_gasless')}
                      className={`w-full p-3 rounded-2xl border-2 text-left text-xs transition ${
                        mintType === 'eip712_gasless'
                          ? 'border-amber-500 neo-inset bg-[var(--surface-bg)] text-amber-600 dark:text-amber-400 font-bold'
                          : 'border-[var(--neo-outline)] neo-raised bg-[var(--surface-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <div className="font-black flex items-center gap-1.5 font-display">
                        <Lock className="w-3.5 h-3.5" /> EIP-712 Lazy Voucher
                      </div>
                      <div className="text-[10px] text-[var(--text-secondary)] mt-0.5 font-medium">0 gas fee for issuer. Holder claims on demand.</div>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-[var(--text-primary)] mb-2 font-display">Target Network</label>
                  <div className="space-y-2">
                    {[
                      { id: 'polygon', name: 'Polygon PoS 137', desc: 'Sovereign low-fee anchor' },
                      { id: 'base', name: 'Base Mainnet', desc: 'Coinbase L2 Ecosystem' },
                      { id: 'arbitrum', name: 'Arbitrum One', desc: 'High throughput Rollup' }
                    ].map(n => {
                      const isSel = targetNetwork === n.id;
                      return (
                        <button
                          key={n.id}
                          onClick={() => setTargetNetwork(n.id as any)}
                          className={`w-full p-2.5 rounded-2xl border-2 text-left text-xs transition ${
                            isSel
                              ? 'border-amber-500 neo-inset bg-[var(--surface-bg)] text-amber-600 dark:text-amber-400 font-bold'
                              : 'border-[var(--neo-outline)] neo-raised bg-[var(--surface-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                          }`}
                        >
                          <div className="font-bold">{n.name}</div>
                          <div className="text-[10px] text-[var(--text-secondary)] font-medium">{n.desc}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[var(--neo-outline)]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--surface-bg)]">
          <p className="text-xs text-[var(--text-secondary)] font-medium">
            Gas Sponsor: <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">Issuer Relay (0x51E2...793B)</span>
          </p>
          <div className="flex gap-3 justify-end">
            <button onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition">
              {step === 'complete' ? 'Done' : 'Cancel'}
            </button>
            {step !== 'complete' && (
              <button
                onClick={handleExecuteMint}
                disabled={isMinting}
                className="px-6 py-2.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-amber-900/30 transition"
              >
                <Lock className="w-3.5 h-3.5" />
                {isMinting ? (step === 'signing' ? 'Signing EIP-712...' : 'Broadcasting Polygon Tx...') : 'Mint Soulbound SBT'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

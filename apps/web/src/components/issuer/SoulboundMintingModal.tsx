import React, { useState } from 'react';
import { ShieldCheck, Lock, Cpu, CheckCircle2, ExternalLink, ArrowRight, Loader2 } from 'lucide-react';

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

    // Simulate EIP-712 or direct on-chain minting workflow
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl flex flex-col shadow-2xl overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Soulbound & EIP-712 Minting Engine
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  ERC-5192 Locked
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Non-transferable on-chain proof anchoring directly to recipient's sovereign address.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-lg px-2">✕</button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {step === 'complete' ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto animate-pulse">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-white">SBT Minted Successfully!</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                The soulbound token has been permanently anchored to the recipient wallet with zero transferability permissions.
              </p>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-left font-mono text-xs space-y-2">
                <div className="text-slate-400 flex justify-between">
                  <span>Transaction Hash:</span>
                  <a
                    href={`https://polygonscan.com/tx/${txHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-amber-400 hover:underline flex items-center gap-1 truncate max-w-[280px]"
                  >
                    {txHash} <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </a>
                </div>
                <div className="text-slate-400 flex justify-between">
                  <span>Standard:</span>
                  <span className="text-white">ERC-5192 (Locked: True)</span>
                </div>
                <div className="text-slate-400 flex justify-between">
                  <span>Recipient:</span>
                  <span className="text-slate-200 truncate max-w-[280px]">{data.recipientAddress}</span>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Target Credential Overview */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="text-xs text-slate-400 font-medium">Target Credential:</div>
                <div className="text-sm font-bold text-white">{data.title}</div>
                <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-800/80 font-mono">
                  <span className="text-slate-400">Recipient:</span>
                  <span className="text-amber-400">{data.recipientName} ({data.recipientAddress.slice(0, 6)}...{data.recipientAddress.slice(-4)})</span>
                </div>
              </div>

              {/* Mint Mode & Network Selection */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Minting Standard</label>
                  <div className="space-y-2">
                    <button
                      onClick={() => setMintType('erc5192')}
                      className={`w-full p-3 rounded-xl border text-left text-xs transition ${
                        mintType === 'erc5192'
                          ? 'border-amber-500 bg-amber-500/10 text-white'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-bold flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-amber-400" /> ERC-5192 Direct SBT
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">Immutable on-chain soulbound lock event</div>
                    </button>
                    <button
                      onClick={() => setMintType('eip712_gasless')}
                      className={`w-full p-3 rounded-xl border text-left text-xs transition ${
                        mintType === 'eip712_gasless'
                          ? 'border-amber-500 bg-amber-500/10 text-white'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-bold flex items-center gap-1.5">
                        <Cpu className="w-3.5 h-3.5 text-indigo-400" /> EIP-712 Gasless Relay
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">Cryptographic signature voucher with relayer gas</div>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-2">Target Settlement Layer</label>
                  <div className="space-y-2">
                    {(['polygon', 'base', 'arbitrum'] as const).map((net) => (
                      <button
                        key={net}
                        onClick={() => setTargetNetwork(net)}
                        className={`w-full p-2.5 rounded-xl border text-left text-xs capitalize transition ${
                          targetNetwork === net
                            ? 'border-amber-500 bg-amber-500/10 text-white font-bold'
                            : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {net === 'polygon' && '🟣 Polygon PoS (Recommended)'}
                        {net === 'base' && '🔵 Base L2'}
                        {net === 'arbitrum' && '🔷 Arbitrum One'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Status or Progress if active */}
              {isMinting && (
                <div className="p-4 bg-slate-950 rounded-xl border border-amber-500/30 flex items-center gap-3">
                  <Loader2 className="w-5 h-5 text-amber-400 animate-spin flex-shrink-0" />
                  <div className="text-xs">
                    <div className="font-bold text-white">
                      {step === 'signing' ? 'Awaiting Issuer EIP-712 Cryptographic Signature...' : 'Broadcasting & Anchoring to Polygon EVM Node...'}
                    </div>
                    <div className="text-slate-400 text-[11px]">Do not close this window while transaction settles.</div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 flex justify-between items-center bg-slate-950/60">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Zero Transferability Guarantee
          </div>
          <div className="flex gap-3">
            {step === 'complete' ? (
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 transition"
              >
                Done
              </button>
            ) : (
              <>
                <button
                  onClick={onClose}
                  disabled={isMinting}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExecuteMint}
                  disabled={isMinting}
                  className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 flex items-center gap-2 shadow-lg shadow-amber-900/30 transition disabled:opacity-50"
                >
                  {isMinting ? 'Minting...' : 'Sign & Anchor On-Chain'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

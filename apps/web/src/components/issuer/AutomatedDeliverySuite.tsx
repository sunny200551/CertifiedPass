import React, { useState } from 'react';
import { Send, Mail, MessageSquare, Smartphone, Share2, Check, Copy, ExternalLink, QrCode } from 'lucide-react';

interface AutomatedDeliverySuiteProps {
  isOpen: boolean;
  onClose: () => void;
  certId?: string;
  recipientName?: string;
}

export const AutomatedDeliverySuite: React.FC<AutomatedDeliverySuiteProps> = ({
  isOpen,
  onClose,
  certId = 'PL-SBT-JOB-0xce1376c2272E-0xce13',
  recipientName = 'Alice Johnson'
}) => {
  const [activeChannel, setActiveChannel] = useState<'email' | 'telegram' | 'discord' | 'apple_wallet'>('email');
  const [emailInput, setEmailInput] = useState('');
  const [telegramChatId, setTelegramChatId] = useState('');
  const [discordWebhook, setDiscordWebhook] = useState('');
  const [copied, setCopied] = useState(false);
  const [dispatched, setDispatched] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  const claimUrl = `${window.location.origin}/verify?id=${certId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(claimUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDispatch = async () => {
    setIsSending(true);
    await new Promise(r => setTimeout(r, 1200));
    setIsSending(false);
    setDispatched(activeChannel);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl flex flex-col shadow-2xl overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Automated Multi-Channel Delivery Suite
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Instant Dispatch
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Notify recipient, issue claim vouchers, and export credentials directly into Apple & Google Wallet.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-lg px-2">✕</button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Universal Claim Link Box */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Direct Universal Claim Link</span>
              <span className="text-emerald-400 font-mono text-[11px]">Ready to Share</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={claimUrl}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition flex-shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Channel Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">Select Delivery Channel</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'email', name: 'Email Delivery', icon: Mail, color: 'text-blue-400' },
                { id: 'telegram', name: 'Telegram Bot', icon: MessageSquare, color: 'text-sky-400' },
                { id: 'discord', name: 'Discord Webhook', icon: Share2, color: 'text-indigo-400' },
                { id: 'apple_wallet', name: 'Apple / Google Wallet', icon: Smartphone, color: 'text-amber-400' }
              ].map(c => {
                const Icon = c.icon;
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      setActiveChannel(c.id as any);
                      setDispatched(null);
                    }}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition text-xs ${
                      activeChannel === c.id
                        ? 'border-blue-500 bg-blue-500/10 text-white shadow-lg shadow-blue-500/10'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${c.color}`} />
                    <span className="text-[11px] font-medium text-center">{c.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Channel Details */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-4">
            {activeChannel === 'email' && (
              <div className="space-y-3">
                <div className="text-xs text-slate-300 font-semibold">Recipient Email Notification</div>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="recipient@example.com"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
                <div className="text-[11px] text-slate-400">
                  Sends an automated branded email containing the 3D verifiable credential badge, cryptographic proof hash, and claiming instructions.
                </div>
              </div>
            )}

            {activeChannel === 'telegram' && (
              <div className="space-y-3">
                <div className="text-xs text-slate-300 font-semibold">Telegram Bot Bot-to-User Push</div>
                <input
                  type="text"
                  value={telegramChatId}
                  onChange={(e) => setTelegramChatId(e.target.value)}
                  placeholder="@username or Telegram Chat ID"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
                />
                <div className="text-[11px] text-slate-400">
                  CertifiedPass Bot will direct-message the credential link and QR pass to the recipient.
                </div>
              </div>
            )}

            {activeChannel === 'discord' && (
              <div className="space-y-3">
                <div className="text-xs text-slate-300 font-semibold">Discord Channel Announcement Webhook</div>
                <input
                  type="url"
                  value={discordWebhook}
                  onChange={(e) => setDiscordWebhook(e.target.value)}
                  placeholder="https://discord.com/api/webhooks/..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                />
                <div className="text-[11px] text-slate-400">
                  Post an embed card into your community Discord server celebrating this milestone certification.
                </div>
              </div>
            )}

            {activeChannel === 'apple_wallet' && (
              <div className="space-y-3">
                <div className="text-xs text-slate-300 font-semibold">Apple Wallet (.pkpass) & Google Wallet Object</div>
                <p className="text-xs text-slate-400">
                  Generate signed mobile wallet passes that recipients can add directly to their iPhone or Android wallet for NFC and offline QR verification.
                </p>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-mono text-amber-300">CertifiedPass_Pass_{certId.slice(0, 10)}.pkpass</span>
                  <button
                    onClick={() => setDispatched('Apple Wallet Pass Generated')}
                    className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-bold hover:bg-amber-500/30 transition"
                  >
                    Download Pass
                  </button>
                </div>
              </div>
            )}

            {dispatched && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-xs flex items-center gap-2">
                <Check className="w-4 h-4" /> Successfully dispatched via {dispatched.toUpperCase()} channel!
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 flex justify-between items-center bg-slate-950/60">
          <div className="text-xs text-slate-400">
            Recipient: <span className="text-white font-medium">{recipientName}</span>
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition">
              Close
            </button>
            <button
              onClick={handleDispatch}
              disabled={isSending}
              className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 flex items-center gap-2 shadow-lg shadow-blue-900/30 transition disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              {isSending ? 'Dispatching...' : 'Dispatch Notification'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

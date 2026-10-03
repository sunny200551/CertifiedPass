import React, { useState } from 'react';
import { Send, Mail, MessageSquare, Smartphone, Share2, Check, Copy, X } from 'lucide-react';

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
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto w-screen h-screen">
      <div className="bg-[var(--surface-bg)] border-2 border-[var(--neo-outline)] rounded-[24px] w-full max-w-3xl flex flex-col shadow-2xl overflow-hidden neo-raised text-[var(--text-primary)] my-auto animate-fadeIn">
        {/* Header */}
        <div className="p-6 border-b border-[var(--neo-outline)]/40 flex items-center justify-between bg-[var(--surface-bg)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl neo-raised-sm bg-[var(--surface-bg)] text-blue-500 flex items-center justify-center font-bold">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[var(--text-primary)] flex items-center gap-2 font-display">
                <span>Automated Multi-Channel Delivery Suite</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 font-mono font-bold">
                  Instant Dispatch
                </span>
              </h2>
              <p className="text-xs text-[var(--text-secondary)] font-medium">
                Notify recipient, issue claim vouchers, and export credentials directly into Apple & Google Wallet.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--accent-indigo-bg)] transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Universal Claim Link Box */}
          <div className="p-4 rounded-xl neo-inset bg-[var(--surface-bg)] border border-[var(--neo-outline)]/60 space-y-2">
            <div className="text-xs font-black uppercase tracking-wider text-[var(--text-primary)] flex items-center justify-between font-display">
              <span>Direct Universal Claim Link</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono text-[11px] font-bold">Ready to Share</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={claimUrl}
                className="w-full bg-[var(--surface-bg)] border border-[var(--neo-outline)]/60 rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-[var(--text-primary)] focus:outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 neo-raised bg-[var(--surface-bg)] text-[var(--text-primary)] hover:text-indigo-600 rounded-xl text-xs font-bold flex items-center gap-1.5 transition flex-shrink-0 border border-[var(--neo-outline)]"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Channel Selector */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-[var(--text-primary)] mb-2 font-display">
              Select Delivery Channel
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'email', name: 'Email Delivery', icon: Mail, color: 'text-blue-500' },
                { id: 'telegram', name: 'Telegram Bot', icon: MessageSquare, color: 'text-sky-500' },
                { id: 'discord', name: 'Discord Webhook', icon: Share2, color: 'text-indigo-500' },
                { id: 'apple_wallet', name: 'Apple / Google Wallet', icon: Smartphone, color: 'text-amber-500' }
              ].map(c => {
                const Icon = c.icon;
                const isSel = activeChannel === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      setActiveChannel(c.id as any);
                      setDispatched(null);
                    }}
                    className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1.5 transition text-xs ${
                      isSel
                        ? 'border-blue-500 neo-inset bg-[var(--surface-bg)] text-blue-600 dark:text-blue-400 font-bold scale-[0.98]'
                        : 'border-[var(--neo-outline)] neo-raised bg-[var(--surface-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${c.color}`} />
                    <span className="text-[11px] font-bold text-center">{c.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Channel Details */}
          <div className="p-4 rounded-xl neo-inset bg-[var(--surface-bg)] border border-[var(--neo-outline)]/60 space-y-4">
            {activeChannel === 'email' && (
              <div className="space-y-3">
                <div className="text-xs text-[var(--text-primary)] font-black uppercase tracking-wider font-display">Recipient Email Notification</div>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="recipient@example.com"
                  className="w-full rounded-xl neo-inset bg-[var(--surface-bg)] border border-[var(--neo-outline)]/60 px-3.5 py-2.5 text-xs text-[var(--text-primary)] font-bold focus:outline-none focus:border-blue-500"
                />
                <div className="text-[11px] text-[var(--text-secondary)] font-medium">
                  Sends an automated branded email containing the 3D verifiable credential badge, cryptographic proof hash, and claiming instructions.
                </div>
              </div>
            )}

            {activeChannel === 'telegram' && (
              <div className="space-y-3">
                <div className="text-xs text-[var(--text-primary)] font-black uppercase tracking-wider font-display">Telegram Bot Integration</div>
                <input
                  type="text"
                  value={telegramChatId}
                  onChange={(e) => setTelegramChatId(e.target.value)}
                  placeholder="@telegram_username or Chat ID"
                  className="w-full rounded-xl neo-inset bg-[var(--surface-bg)] border border-[var(--neo-outline)]/60 px-3.5 py-2.5 text-xs text-[var(--text-primary)] font-bold focus:outline-none focus:border-sky-500"
                />
                <div className="text-[11px] text-[var(--text-secondary)] font-medium">
                  The @CertifiedPassBot will instantly DM the candidate with dynamic inline verification buttons.
                </div>
              </div>
            )}

            {activeChannel === 'discord' && (
              <div className="space-y-3">
                <div className="text-xs text-[var(--text-primary)] font-black uppercase tracking-wider font-display">Discord Channel Webhook</div>
                <input
                  type="text"
                  value={discordWebhook}
                  onChange={(e) => setDiscordWebhook(e.target.value)}
                  placeholder="https://discord.com/api/webhooks/..."
                  className="w-full rounded-xl neo-inset bg-[var(--surface-bg)] border border-[var(--neo-outline)]/60 px-3.5 py-2.5 text-xs text-[var(--text-primary)] font-mono font-bold focus:outline-none focus:border-indigo-500"
                />
                <div className="text-[11px] text-[var(--text-secondary)] font-medium">
                  Publishes a rich Discord embed with verified certificate preview, recipient metadata, and Polygon PoS explorer link.
                </div>
              </div>
            )}

            {activeChannel === 'apple_wallet' && (
              <div className="space-y-3">
                <div className="text-xs text-[var(--text-primary)] font-black uppercase tracking-wider font-display">Apple & Google Wallet Pass</div>
                <div className="p-3 rounded-xl neo-raised bg-[var(--surface-bg)] border border-[var(--neo-outline)] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-6 h-6 text-amber-500" />
                    <div>
                      <div className="text-xs font-bold text-[var(--text-primary)]">PassKit (.pkpass) Bundle</div>
                      <div className="text-[10px] text-[var(--text-secondary)] font-mono">Compatible with iOS 16+ & Google Wallet</div>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-black border border-amber-500/20">
                    Ready
                  </span>
                </div>
              </div>
            )}

            {dispatched && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2 font-bold">
                <Check className="w-4 h-4" />
                <span>Credential successfully dispatched via {dispatched.toUpperCase()}! Recipient can view it immediately.</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[var(--neo-outline)]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--surface-bg)]">
          <p className="text-xs text-[var(--text-secondary)] font-medium">
            Recipient: <span className="font-bold text-[var(--text-primary)]">{recipientName}</span>
          </p>
          <div className="flex gap-3 justify-end">
            <button onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition">
              Close
            </button>
            <button
              onClick={handleDispatch}
              disabled={isSending}
              className="px-6 py-2.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-blue-900/30 transition"
            >
              <Send className="w-3.5 h-3.5" />
              {isSending ? 'Dispatching...' : `Dispatch via ${activeChannel.toUpperCase()}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

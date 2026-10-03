import React, { useEffect } from 'react';
import { BarChart3, TrendingUp, Users, ShieldCheck, Globe, Download, Eye, QrCode, X } from 'lucide-react';

interface IssuerAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  issuerStats?: {
    totalIssued: number;
    activeCredentials: number;
    totalVerifications: number;
    revocationRate: string;
  };
}

export const IssuerAnalyticsModal: React.FC<IssuerAnalyticsModalProps> = ({
  isOpen,
  onClose,
  issuerStats
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('has-active-modal');
      return () => {
        document.body.classList.remove('has-active-modal');
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const stats = issuerStats || {
    totalIssued: 48,
    activeCredentials: 46,
    totalVerifications: 1382,
    revocationRate: '4.1%'
  };

  const recentVerifications = [
    { id: '1', certTitle: 'PolyLance Verified Web3 Developer', verifierOrg: 'Recruiter @ Polygon Labs', timestamp: '12 mins ago', location: 'United States', status: 'VERIFIED' },
    { id: '2', certTitle: 'Smart Contract Auditor SBT', verifierOrg: 'CertiK Review Portal', timestamp: '48 mins ago', location: 'Germany', status: 'VERIFIED' },
    { id: '3', certTitle: 'Full-Stack DApp Architect', verifierOrg: 'Anonymous Direct QR Scan', timestamp: '2 hours ago', location: 'Singapore', status: 'VERIFIED' },
    { id: '4', certTitle: 'Solidity Security Specialist', verifierOrg: 'Enterprise HR Portal', timestamp: '5 hours ago', location: 'United Kingdom', status: 'VERIFIED' },
  ];

  const handleExportReport = () => {
    const csvContent = `Timestamp,CredentialTitle,VerifierOrg,Location,Status\n${recentVerifications.map(r => `"${r.timestamp}","${r.certTitle}","${r.verifierOrg}","${r.location}","${r.status}"`).join('\n')}`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CertifiedPass_Issuer_Audit_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md overflow-y-auto">
      <div className="bg-[var(--surface-bg)] border-2 border-[var(--neo-outline)] rounded-[24px] w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden neo-raised text-[var(--text-primary)] my-auto animate-fadeIn">
        {/* Header */}
        <div className="p-6 border-b border-[var(--neo-outline)]/40 flex items-center justify-between bg-[var(--surface-bg)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl neo-raised-sm bg-[var(--surface-bg)] text-emerald-500 flex items-center justify-center font-bold">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[var(--text-primary)] flex items-center gap-2 font-display">
                <span>Real-Time Issuer Analytics & Auditing</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-mono font-bold">
                  Live Telemetry
                </span>
              </h2>
              <p className="text-xs text-[var(--text-secondary)] font-medium">
                Track global verification scans, recipient engagement, and cryptographic audit trails.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--accent-indigo-bg)] transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl neo-raised bg-[var(--surface-bg)] border border-[var(--neo-outline)]/60">
              <div className="text-[var(--text-secondary)] text-xs flex items-center gap-1.5 mb-1 font-bold">
                <Users className="w-3.5 h-3.5 text-blue-500" /> Total Credentials
              </div>
              <div className="text-2xl font-black text-[var(--text-primary)] font-display">{stats.totalIssued}</div>
              <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-0.5 font-bold">
                <TrendingUp className="w-3 h-3" /> +12% this month
              </div>
            </div>

            <div className="p-4 rounded-xl neo-raised bg-[var(--surface-bg)] border border-[var(--neo-outline)]/60">
              <div className="text-[var(--text-secondary)] text-xs flex items-center gap-1.5 mb-1 font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Active on Polygon
              </div>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-display">{stats.activeCredentials}</div>
              <div className="text-[10px] text-[var(--text-secondary)] mt-1 font-semibold">Non-transferable</div>
            </div>

            <div className="p-4 rounded-xl neo-raised bg-[var(--surface-bg)] border border-[var(--neo-outline)]/60">
              <div className="text-[var(--text-secondary)] text-xs flex items-center gap-1.5 mb-1 font-bold">
                <Eye className="w-3.5 h-3.5 text-purple-500" /> Total Verifications
              </div>
              <div className="text-2xl font-black text-purple-600 dark:text-purple-400 font-display">{stats.totalVerifications.toLocaleString()}</div>
              <div className="text-[10px] text-[var(--text-secondary)] mt-1 font-semibold">Scans & API checks</div>
            </div>

            <div className="p-4 rounded-xl neo-raised bg-[var(--surface-bg)] border border-[var(--neo-outline)]/60">
              <div className="text-[var(--text-secondary)] text-xs flex items-center gap-1.5 mb-1 font-bold">
                <QrCode className="w-3.5 h-3.5 text-amber-500" /> Revocation Rate
              </div>
              <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-display">{stats.revocationRate}</div>
              <div className="text-[10px] text-[var(--text-secondary)] mt-1 font-semibold">2 nullified on-chain</div>
            </div>
          </div>

          {/* Real-Time Scan Feed */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="text-xs font-black uppercase tracking-wider text-[var(--text-primary)] flex items-center gap-1.5 font-display">
                <Globe className="w-4 h-4 text-emerald-500" /> Live Verification Audit Log
              </div>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" /> Live Stream
              </span>
            </div>

            <div className="border-2 border-[var(--neo-outline)] rounded-xl overflow-hidden neo-raised bg-[var(--surface-bg)]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[var(--surface-bg)] text-[var(--text-secondary)] border-b-2 border-[var(--neo-outline)] font-black uppercase text-[10px]">
                  <tr>
                    <th className="p-3">Status</th>
                    <th className="p-3">Credential</th>
                    <th className="p-3">Verifier / Entity</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--neo-outline)]/40">
                  {recentVerifications.map((v) => (
                    <tr key={v.id} className="hover:bg-[var(--accent-indigo-bg)] transition">
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black border border-emerald-500/20">
                          {v.status}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-[var(--text-primary)]">{v.certTitle}</td>
                      <td className="p-3 text-[var(--text-primary)] font-medium">{v.verifierOrg}</td>
                      <td className="p-3 text-[var(--text-secondary)] font-semibold">{v.location}</td>
                      <td className="p-3 font-mono text-[var(--text-secondary)]">{v.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[var(--neo-outline)]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--surface-bg)]">
          <button
            onClick={handleExportReport}
            className="px-4 py-2 neo-raised bg-[var(--surface-bg)] text-[var(--text-primary)] border border-[var(--neo-outline)] rounded-full text-xs font-bold flex items-center gap-2 transition"
          >
            <Download className="w-4 h-4" /> Export Full Audit CSV
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full text-xs font-black text-white bg-emerald-600 hover:bg-emerald-500 transition shadow-lg shadow-emerald-900/30"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

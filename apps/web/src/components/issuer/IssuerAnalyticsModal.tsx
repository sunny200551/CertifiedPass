import React from 'react';
import { BarChart3, TrendingUp, Users, ShieldCheck, Globe, Download, Eye, QrCode } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Real-Time Issuer Analytics & Auditing
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Live Telemetry
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Track global verification scans, recipient engagement, and cryptographic audit trails.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-lg px-2">✕</button>
        </div>

        {/* Body */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-xs flex items-center gap-1.5 mb-1">
                <Users className="w-3.5 h-3.5 text-blue-400" /> Total Credentials
              </div>
              <div className="text-2xl font-bold text-white font-mono">{stats.totalIssued}</div>
              <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> +12% this month
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-xs flex items-center gap-1.5 mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Active on Polygon
              </div>
              <div className="text-2xl font-bold text-emerald-400 font-mono">{stats.activeCredentials}</div>
              <div className="text-[10px] text-slate-400 mt-1">Non-transferable</div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-xs flex items-center gap-1.5 mb-1">
                <Eye className="w-3.5 h-3.5 text-purple-400" /> Total Verifications
              </div>
              <div className="text-2xl font-bold text-purple-400 font-mono">{stats.totalVerifications.toLocaleString()}</div>
              <div className="text-[10px] text-slate-400 mt-1">Scans & API checks</div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="text-slate-400 text-xs flex items-center gap-1.5 mb-1">
                <QrCode className="w-3.5 h-3.5 text-amber-400" /> Revocation Rate
              </div>
              <div className="text-2xl font-bold text-amber-400 font-mono">{stats.revocationRate}</div>
              <div className="text-[10px] text-slate-400 mt-1">2 nullified on-chain</div>
            </div>
          </div>

          {/* Real-Time Scan Feed */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-emerald-400" /> Live Verification Audit Log
              </div>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" /> Live Stream
              </span>
            </div>

            <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/60 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-3">Status</th>
                    <th className="p-3">Credential</th>
                    <th className="p-3">Verifier / Entity</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {recentVerifications.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-900/30">
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                          {v.status}
                        </span>
                      </td>
                      <td className="p-3 font-medium text-white">{v.certTitle}</td>
                      <td className="p-3 text-slate-300">{v.verifierOrg}</td>
                      <td className="p-3 text-slate-400">{v.location}</td>
                      <td className="p-3 font-mono text-slate-500">{v.timestamp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-800 flex justify-between items-center bg-slate-950/60">
          <button
            onClick={handleExportReport}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition"
          >
            <Download className="w-4 h-4" /> Export Full Audit CSV
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition shadow-lg shadow-emerald-900/30"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Award, Search, ExternalLink, ShieldAlert, Plus } from "lucide-react";
import { Layout } from "../../components/layout/Layout.js";
import { Button } from "../../components/ui/Button.js";
import { Badge } from "../../components/ui/Badge.js";
import { api } from "../../lib/api.js";

export default function IssuerCredentials() {
  const [search, setSearch] = useState("");
  const [credentials, setCredentials] = useState([
    {
      id: "cp-hackathon-2026-ethsf",
      title: "1st Place Winner — Global Web3 AI Hackathon",
      holderName: "Alex Rivera",
      holderAddress: "0x71C845137F73612FACb1C1E6e3e1A144e5904F2E",
      type: "hackathon",
      status: "ACTIVE",
      date: "2026-08-20",
    },
    {
      id: "cp-internship-2026-consensys",
      title: "Smart Contract Engineering Intern",
      holderName: "Alex Rivera",
      holderAddress: "0x71C845137F73612FACb1C1E6e3e1A144e5904F2E",
      type: "internship",
      status: "ACTIVE",
      date: "2026-07-31",
    },
  ]);

  const handleRevoke = async (id: string) => {
    const reason = window.prompt("Enter revocation reason (irreversible):");
    if (!reason) return;

    try {
      await api.post(`/credentials/${id}/revoke`, { reason });
      setCredentials(
        credentials.map((c) => (c.id === id ? { ...c, status: "REVOKED" } : c))
      );
    } catch {
      setCredentials(
        credentials.map((c) => (c.id === id ? { ...c, status: "REVOKED" } : c))
      );
    }
  };

  const filtered = credentials.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.holderName.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 text-[var(--text-primary)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--shadow-dark)]/15 pb-8 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] font-display">All Issued Credentials</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">Complete log of on-chain credentials issued by your organization.</p>
          </div>

          <Link to="/issuer/issue">
            <Button variant="primary" className="gap-1.5 rounded-full px-6">
              <Plus className="h-4 w-4" /> Issue Credentials
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="mb-6 max-w-md">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)]" />
            <input
              type="text"
              placeholder="Search by title, recipient, or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl neo-inset bg-[var(--surface-bg)] pl-10 pr-4 py-2.5 text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none"
            />
          </div>
        </div>

        {/* Credentials Table (Raised Container) */}
        <div className="rounded-[24px] neo-raised bg-[var(--surface-bg)] overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[var(--shadow-dark)]/15 bg-[var(--surface-bg)] text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)] font-display">
              <tr>
                <th className="px-6 py-4">Credential</th>
                <th className="px-6 py-4">Recipient</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--shadow-dark)]/10">
              {filtered.map((cred) => (
                <tr key={cred.id} className="hover:bg-[var(--shadow-dark)]/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-[var(--text-primary)]">{cred.title}</div>
                    <div className="text-[11px] font-mono text-[var(--brand-indigo)]">{cred.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-[var(--text-primary)]">{cred.holderName}</div>
                    <div className="font-mono text-[10px] text-[var(--text-secondary)] truncate max-w-[120px]">
                      {cred.holderAddress}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={cred.type as any} size="sm">
                      {cred.type.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 font-bold ${
                        cred.status === "ACTIVE" ? "text-[var(--accent-green)]" : "text-rose-500"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          cred.status === "ACTIVE" ? "bg-[var(--accent-green)]" : "bg-rose-500"
                        }`}
                      />
                      {cred.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[var(--text-secondary)] font-mono">{cred.date}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/c/${cred.id}`}
                        className="p-1.5 rounded-lg neo-raised-sm text-[var(--text-secondary)] hover:text-[var(--brand-indigo)] transition-all"
                        title="View Pass"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Link>
                      {cred.status === "ACTIVE" && (
                        <button
                          onClick={() => handleRevoke(cred.id)}
                          className="p-1.5 rounded-lg neo-raised-sm text-[var(--text-secondary)] hover:text-rose-500 transition-all"
                          title="Revoke Credential"
                        >
                          <ShieldAlert className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

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
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 text-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/90 pb-8 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">All Issued Credentials</h1>
            <p className="text-sm text-slate-500 mt-1">Complete log of on-chain credentials issued by your organization.</p>
          </div>

          <Link to="/issuer/issue">
            <Button variant="primary" className="gap-1.5 shadow-apple-sm">
              <Plus className="h-4 w-4" /> Issue Credentials
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="mb-6 max-w-md">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, recipient, or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 shadow-apple-sm"
            />
          </div>
        </div>

        {/* Credentials Table */}
        <div className="rounded-3xl border border-slate-200/90 bg-white overflow-hidden shadow-apple-sm">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 font-display">
              <tr>
                <th className="px-6 py-4">Credential</th>
                <th className="px-6 py-4">Recipient</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((cred) => (
                <tr key={cred.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900 text-sm font-display">{cred.title}</div>
                    <div className="font-mono text-[11px] text-slate-400">{cred.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-800">{cred.holderName}</div>
                    <div className="font-mono text-[11px] text-slate-400 truncate max-w-[120px]">
                      {cred.holderAddress}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={cred.type as any} size="sm">
                      {cred.type.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={cred.status === "ACTIVE" ? "verified" : "revoked"} size="sm">
                      {cred.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-500">{cred.date}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Link
                      to={`/c/${cred.id}`}
                      className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:underline"
                    >
                      View <ExternalLink className="h-3 w-3" />
                    </Link>
                    {cred.status === "ACTIVE" && (
                      <button
                        onClick={() => handleRevoke(cred.id)}
                        className="font-semibold text-amber-600 hover:underline ml-2"
                      >
                        Revoke
                      </button>
                    )}
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

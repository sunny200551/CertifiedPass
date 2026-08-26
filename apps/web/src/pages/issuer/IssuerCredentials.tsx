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

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-8 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">All Issued Credentials</h1>
            <p className="text-sm text-slate-400 mt-1">Complete log of on-chain credentials issued by your organization.</p>
          </div>

          <Link to="/issuer/issue">
            <Button variant="primary" className="gap-1.5">
              <Plus className="h-4 w-4" /> Issue Credentials
            </Button>
          </Link>
        </div>

        {/* Credentials Table / List */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden backdrop-blur-md">
          <div className="p-4 border-b border-slate-800/80">
            <input
              type="text"
              placeholder="Search by title, recipient, or wallet..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full max-w-sm rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div className="divide-y divide-slate-800/80">
            {credentials.map((c) => (
              <div key={c.id} className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={c.type as any} size="sm">
                      {c.type.toUpperCase()}
                    </Badge>
                    <Badge variant={c.status === "ACTIVE" ? "active" : "revoked"} size="sm" dot>
                      {c.status}
                    </Badge>
                  </div>
                  <h4 className="text-sm font-bold text-white">{c.title}</h4>
                  <p className="text-xs text-slate-400">
                    Recipient: <span className="text-slate-200">{c.holderName}</span> • <span className="font-mono text-cyan-400">{c.holderAddress.slice(0, 8)}...{c.holderAddress.slice(-6)}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Link to={`/c/${c.id}`}>
                    <Button variant="secondary" size="sm" className="gap-1 text-xs">
                      Public View <ExternalLink className="h-3 w-3" />
                    </Button>
                  </Link>
                  {c.status === "ACTIVE" && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleRevoke(c.id)}
                      className="gap-1 text-xs"
                    >
                      <ShieldAlert className="h-3.5 w-3.5" /> Revoke
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

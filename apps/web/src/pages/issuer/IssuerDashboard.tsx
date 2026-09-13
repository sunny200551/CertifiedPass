import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Award, Calendar, FileText, PlusCircle, Sparkles, ShieldCheck, Users, ExternalLink, ArrowRight } from "lucide-react";
import { Layout } from "../../components/layout/Layout.js";
import { Button } from "../../components/ui/Button.js";
import { Badge } from "../../components/ui/Badge.js";
import { useAuth } from "../../context/AuthContext.js";
import { api } from "../../lib/api.js";

export default function IssuerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    issuedCount: 142,
    activeEvents: 3,
    pendingDrafts: 18,
    isVerified: true,
  });

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 text-[var(--text-primary)]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--shadow-dark)]/15 pb-8 mb-8">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold text-[var(--text-primary)] sm:text-3xl font-display">Issuer Portal</h1>
              <Badge variant="verified" size="sm" dot>
                Verified Issuer
              </Badge>
            </div>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Issue AI-parsed credentials, manage hackathons/programs, and monitor on-chain anchors.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/issuer/issue">
              <Button variant="primary" className="gap-2 rounded-full px-6">
                <Sparkles className="h-4 w-4 text-[var(--accent-purple)] animate-pulse-glow" /> Issue Credentials (AI)
              </Button>
            </Link>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="rounded-[24px] neo-raised bg-[var(--surface-bg)] p-6">
            <div className="flex items-center justify-between text-[var(--text-secondary)] mb-2">
              <span className="text-xs font-bold uppercase tracking-wider font-display">Total Issued</span>
              <div className="neo-raised-sm rounded-full p-2 bg-[var(--surface-bg)] text-[var(--brand-indigo)]">
                <Award className="h-4 w-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-[var(--text-primary)] font-display">{stats.issuedCount}</p>
            <span className="text-xs text-[var(--accent-green)] font-bold mt-1 inline-block">100% Anchored on Polygon Amoy</span>
          </div>

          <div className="rounded-[24px] neo-raised bg-[var(--surface-bg)] p-6">
            <div className="flex items-center justify-between text-[var(--text-secondary)] mb-2">
              <span className="text-xs font-bold uppercase tracking-wider font-display">Active Programs</span>
              <div className="neo-raised-sm rounded-full p-2 bg-[var(--surface-bg)] text-[var(--accent-blue)]">
                <Calendar className="h-4 w-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-[var(--text-primary)] font-display">{stats.activeEvents}</p>
            <span className="text-xs text-[var(--text-secondary)] mt-1 inline-block">ETHSF, Polygon Guild, ConsenSys</span>
          </div>

          <div className="rounded-[24px] neo-raised bg-[var(--surface-bg)] p-6">
            <div className="flex items-center justify-between text-[var(--text-secondary)] mb-2">
              <span className="text-xs font-bold uppercase tracking-wider font-display">AI Extraction Pipeline</span>
              <div className="neo-raised-sm rounded-full p-2 bg-[var(--surface-bg)] text-[var(--accent-purple)]">
                <Sparkles className="h-4 w-4" />
              </div>
            </div>
            <p className="text-3xl font-extrabold text-[var(--text-primary)] font-display">Active</p>
            <span className="text-xs text-[var(--brand-indigo)] font-bold mt-1 inline-block">Gemini 1.5 Flash Parser</span>
          </div>
        </div>

        {/* Quick Action Banner */}
        <div className="rounded-[24px] neo-raised bg-[var(--surface-bg)] p-8 flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-lg font-bold text-[var(--text-primary)] font-display">Need to Issue a New Batch of Credentials?</h3>
            <p className="text-xs text-[var(--text-secondary)] max-w-xl">
              Upload certificate templates, judge spreadsheets, or award documents. Our AI will automatically parse the recipient data, calculate canonical SHA-256 hashes, and prepare the Polygon Amoy transaction.
            </p>
          </div>
          <Link to="/issuer/issue" className="shrink-0">
            <Button variant="primary" size="md" className="gap-2 rounded-full px-6">
              <span>Start AI Batch Issuance</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}

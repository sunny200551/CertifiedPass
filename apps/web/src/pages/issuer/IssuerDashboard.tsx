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
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/90 pb-8 mb-8">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl font-display">Issuer Portal</h1>
              <Badge variant="verified" size="sm" dot>
                Verified Issuer
              </Badge>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Issue AI-parsed credentials, manage hackathons/programs, and monitor on-chain anchors.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/issuer/issue">
              <Button variant="primary" className="gap-2 shadow-apple-sm">
                <Sparkles className="h-4 w-4 text-indigo-400" /> Issue Credentials (AI)
              </Button>
            </Link>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-apple-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider font-display">Total Issued</span>
              <Award className="h-5 w-5 text-indigo-600" />
            </div>
            <p className="text-3xl font-extrabold text-slate-900 font-display">{stats.issuedCount}</p>
            <span className="text-xs text-emerald-700 font-medium mt-1 inline-block">100% Anchored on Polygon Amoy</span>
          </div>

          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-apple-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider font-display">Active Programs</span>
              <Calendar className="h-5 w-5 text-sky-600" />
            </div>
            <p className="text-3xl font-extrabold text-slate-900 font-display">{stats.activeEvents}</p>
            <span className="text-xs text-slate-500 mt-1 inline-block">ETHSF, Polygon Guild, ConsenSys</span>
          </div>

          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-apple-sm">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider font-display">AI Extraction Pipeline</span>
              <Sparkles className="h-5 w-5 text-indigo-600" />
            </div>
            <p className="text-3xl font-extrabold text-slate-900 font-display">Active</p>
            <span className="text-xs text-indigo-600 font-medium mt-1 inline-block">Gemini 1.5 Flash Parser</span>
          </div>
        </div>

        {/* Quick Action Banner */}
        <div className="rounded-3xl border border-indigo-200/90 bg-gradient-to-r from-indigo-50/80 via-white to-sky-50/50 p-8 shadow-apple-sm flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-lg font-bold text-slate-900 font-display">Need to Issue a New Batch of Credentials?</h3>
            <p className="text-xs text-slate-500 max-w-xl">
              Upload certificate templates, judge spreadsheets, or award documents. Our AI will automatically parse the recipient data, calculate canonical SHA-256 hashes, and prepare the Polygon Amoy transaction.
            </p>
          </div>
          <Link to="/issuer/issue" className="shrink-0">
            <Button variant="primary" size="md" className="gap-2">
              Start AI Batch Issuance <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}

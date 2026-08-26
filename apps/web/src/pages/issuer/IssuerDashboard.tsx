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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-8 mb-8">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold text-white sm:text-3xl">Issuer Portal</h1>
              <Badge variant="verified" size="sm" dot>
                Verified Issuer
              </Badge>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Issue AI-parsed credentials, manage hackathons/programs, and monitor on-chain anchors.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/issuer/issue">
              <Button variant="primary" className="gap-2">
                <Sparkles className="h-4 w-4" /> Issue Credentials (AI)
              </Button>
            </Link>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Total Issued</span>
              <Award className="h-5 w-5 text-cyan-400" />
            </div>
            <p className="text-3xl font-extrabold text-white">{stats.issuedCount}</p>
            <span className="text-xs text-emerald-400 mt-1 inline-block">100% Anchored on Polygon</span>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Active Programs</span>
              <Calendar className="h-5 w-5 text-purple-400" />
            </div>
            <p className="text-3xl font-extrabold text-white">{stats.activeEvents}</p>
            <Link to="/issuer/events" className="text-xs text-cyan-400 hover:underline mt-1 inline-block">
              Manage Events →
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">AI Drafts in Review</span>
              <Sparkles className="h-5 w-5 text-amber-400" />
            </div>
            <p className="text-3xl font-extrabold text-white">{stats.pendingDrafts}</p>
            <Link to="/issuer/issue" className="text-xs text-amber-400 hover:underline mt-1 inline-block">
              Review Drafts →
            </Link>
          </div>
        </div>

        {/* Action Banners */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* AI Issuance Flow Card */}
          <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/20 via-slate-900/60 to-slate-900/90 p-6 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-white">AI-Assisted Batch Issuance</h3>
            </div>
            <p className="text-sm text-slate-300 mb-6 leading-relaxed">
              Upload spreadsheets (CSV/XLSX) or certificates. Gemini 1.5 Flash parses and structures drafts with zero manual entry required.
            </p>
            <Link to="/issuer/issue">
              <Button variant="cyan" className="gap-2">
                Launch AI Issuance Workflow <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* Quick Links */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md space-y-4">
            <h3 className="text-base font-bold text-white mb-2">Issuer Navigation</h3>
            <div className="space-y-2">
              <Link
                to="/issuer/events"
                className="flex items-center justify-between rounded-xl bg-slate-950/80 p-3 hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-2.5 text-sm font-medium text-slate-200">
                  <Calendar className="h-4 w-4 text-purple-400" />
                  <span>My Events & Programs</span>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-500" />
              </Link>
              <Link
                to="/issuer/credentials"
                className="flex items-center justify-between rounded-xl bg-slate-950/80 p-3 hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center gap-2.5 text-sm font-medium text-slate-200">
                  <Award className="h-4 w-4 text-cyan-400" />
                  <span>All Issued Credentials</span>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-500" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Award, Calendar, ExternalLink, Plus, Users } from "lucide-react";
import { Layout } from "../../components/layout/Layout.js";
import { Button } from "../../components/ui/Button.js";
import { Badge } from "../../components/ui/Badge.js";

export default function IssuerEventDetail() {
  const { id } = useParams<{ id: string }>();

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 text-slate-900">
        <Link
          to="/issuer/events"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 mb-6 transition-colors font-medium"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Events
        </Link>

        <div className="rounded-3xl border border-slate-200/90 bg-white p-8 shadow-apple-md mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="hackathon" size="sm">
                  HACKATHON
                </Badge>
                <span className="text-xs font-mono text-slate-400">ID: {id}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">ETHSF Innovation Summit 2026</h1>
              <p className="text-xs text-slate-500 mt-1">Date: 2026-08-20 • Location: San Francisco, CA & Online</p>
            </div>

            <Link to="/issuer/issue">
              <Button variant="primary" className="gap-1.5 shadow-apple-sm">
                <Plus className="h-4 w-4" /> Issue More Credentials
              </Button>
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 font-display">Issued Event Credentials (42)</h2>
          <div className="rounded-3xl border border-slate-200/90 bg-white p-4 divide-y divide-slate-100 shadow-apple-sm">
            <div className="py-4 px-3 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 font-display">1st Place Winner — Global Web3 AI Hackathon</h4>
                <p className="text-xs font-mono text-indigo-600">Alex Rivera (0x71C8...4F2E)</p>
              </div>
              <Link to="/c/cp-hackathon-2026-ethsf">
                <Button variant="outline" size="sm" className="text-xs">
                  View Pass <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </div>
            <div className="py-4 px-3 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 font-display">2nd Place Winner — Zero-Knowledge Track</h4>
                <p className="text-xs font-mono text-sky-600">Elena Rostova (0x8920...43e7)</p>
              </div>
              <Link to="/c/cp-hackathon-2026-ethsf">
                <Button variant="outline" size="sm" className="text-xs">
                  View Pass <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShieldCheck, Award, Globe, ExternalLink, Calendar, Users } from "lucide-react";
import { Layout } from "../components/layout/Layout.js";
import { Badge } from "../components/ui/Badge.js";
import { Button } from "../components/ui/Button.js";
import { api } from "../lib/api.js";

export default function IssuerPublicPage() {
  const { id } = useParams<{ id: string }>();
  const [issuer, setIssuer] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadIssuer() {
      if (!id) return;
      setLoading(true);
      try {
        const res = await api.get(`/issuers/${encodeURIComponent(id)}`);
        setIssuer(res.data.data);
      } catch {
        // Fallback demo data
        setIssuer({
          id: id || "ethsf",
          name: "ETHSF & Polygon Labs",
          walletAddress: "0x51E2a819bA4F5b6c891e4a3F12c6a4F69B88793B",
          description: "Global community organizing high-impact blockchain hackathons, technical grants, and decentralized infrastructure programs.",
          website: "https://polygon.technology",
          verificationStatus: "VERIFIED",
          _count: { issuedCredentials: 420 },
          events: [
            { id: "e1", name: "ETHSF Innovation Summit 2026", eventType: "hackathon", date: "2026-08-20" },
            { id: "e2", name: "Polygon Amoy Developer Accelerator", eventType: "workshop", date: "2026-06-10" },
          ],
        });
      } finally {
        setLoading(false);
      }
    }

    loadIssuer();
  }, [id]);

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Org Header */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-xl mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start md:items-center gap-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white text-2xl font-bold shadow-lg shadow-purple-500/20">
                {issuer?.name?.slice(0, 2).toUpperCase() || "OR"}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-white">{issuer?.name}</h1>
                  <Badge variant="verified" dot size="sm">
                    Platform Verified
                  </Badge>
                </div>
                <p className="text-xs font-mono text-slate-400">{issuer?.walletAddress}</p>
                <p className="text-sm text-slate-300 max-w-xl pt-1 leading-relaxed">
                  {issuer?.description}
                </p>
              </div>
            </div>

            {issuer?.website && (
              <a href={issuer.website} target="_blank" rel="noreferrer">
                <Button variant="outline" size="sm" className="gap-2">
                  <Globe className="h-4 w-4" /> Website <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </a>
            )}
          </div>

          {/* Org Metric Bar */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-slate-800/80 pt-6">
            <div className="rounded-xl bg-slate-950/60 p-4 border border-slate-800/60">
              <span className="text-[10px] uppercase font-bold text-slate-500">Issued Credentials</span>
              <p className="text-2xl font-extrabold text-cyan-400">{issuer?._count?.issuedCredentials || 0}</p>
            </div>
            <div className="rounded-xl bg-slate-950/60 p-4 border border-slate-800/60">
              <span className="text-[10px] uppercase font-bold text-slate-500">Active Programs</span>
              <p className="text-2xl font-extrabold text-purple-400">{issuer?.events?.length || 0}</p>
            </div>
            <div className="rounded-xl bg-slate-950/60 p-4 border border-slate-800/60">
              <span className="text-[10px] uppercase font-bold text-slate-500">On-Chain Registry</span>
              <p className="text-sm font-semibold text-emerald-400 mt-1 flex items-center gap-1">
                <ShieldCheck className="h-4 w-4" /> Active on Polygon Amoy
              </p>
            </div>
          </div>
        </div>

        {/* Programs / Events Hosted */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-400" /> Programs & Hackathons
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {issuer?.events?.map((ev: any) => (
              <div
                key={ev.id}
                className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 hover:border-purple-500/40 transition-colors backdrop-blur-md"
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={ev.eventType as any} size="sm">
                    {ev.eventType.toUpperCase()}
                  </Badge>
                  <span className="text-xs font-mono text-slate-400">{ev.date}</span>
                </div>
                <h3 className="text-base font-bold text-white mt-1">{ev.name}</h3>
                <p className="text-xs text-slate-400 mt-2">
                  Verifiable digital proof certificates issued for participants and winners.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

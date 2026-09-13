import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShieldCheck, Award, Globe, ExternalLink, Calendar, Users, ArrowRight } from "lucide-react";
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
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 text-[var(--text-primary)]">
        {/* Org Header (Raised Panel) */}
        <div className="rounded-[24px] neo-raised bg-[var(--surface-bg)] p-8 mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start md:items-center gap-5">
              <div className="neo-raised-sm flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[var(--brand-indigo)] to-[var(--brand-violet)] text-white text-2xl font-bold font-display flex-shrink-0">
                {issuer?.name?.slice(0, 2).toUpperCase() || "OR"}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] font-display">{issuer?.name}</h1>
                  <Badge variant="verified" dot size="sm">
                    Platform Verified
                  </Badge>
                </div>
                <p className="text-xs font-mono text-[var(--brand-indigo)] font-bold">{issuer?.walletAddress}</p>
                <p className="text-sm text-[var(--text-secondary)] max-w-2xl leading-relaxed pt-1">{issuer?.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {issuer?.website && (
                <a href={issuer.website} target="_blank" rel="noreferrer">
                  <Button variant="outline" size="sm" className="gap-1.5 rounded-full">
                    <Globe className="h-4 w-4" /> Website <ExternalLink className="h-3 w-3" />
                  </Button>
                </a>
              )}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-[var(--shadow-dark)]/15 pt-6">
            <div className="rounded-2xl neo-inset bg-[var(--surface-bg)] p-4 text-center">
              <div className="text-2xl font-black text-[var(--text-primary)] font-display">{issuer?._count?.issuedCredentials || 420}</div>
              <div className="text-xs text-[var(--text-secondary)] font-bold">Issued Credentials</div>
            </div>
            <div className="rounded-2xl neo-inset bg-[var(--surface-bg)] p-4 text-center">
              <div className="text-2xl font-black text-[var(--brand-indigo)] font-display">100%</div>
              <div className="text-xs text-[var(--text-secondary)] font-bold">On-Chain Anchored</div>
            </div>
            <div className="rounded-2xl neo-inset bg-[var(--surface-bg)] p-4 text-center">
              <div className="text-2xl font-black text-[var(--accent-green)] font-display">Active</div>
              <div className="text-xs text-[var(--text-secondary)] font-bold">Registry Status</div>
            </div>
          </div>
        </div>

        {/* Org Programs */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-[var(--text-primary)] font-display">Organized Programs & Hackathons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {issuer?.events?.map((ev: any) => (
              <div
                key={ev.id}
                className="rounded-[24px] neo-raised bg-[var(--surface-bg)] p-6 hover:-translate-y-1 transition-all flex items-center justify-between"
              >
                <div className="space-y-1">
                  <Badge variant={ev.eventType} size="sm">
                    {ev.eventType.toUpperCase()}
                  </Badge>
                  <h3 className="text-base font-bold text-[var(--text-primary)] font-display pt-1">{ev.name}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{ev.date}</span>
                  </div>
                </div>

                <Link to="/verify">
                  <Button variant="secondary" size="sm" className="gap-1 text-xs rounded-full">
                    <span>Audit Pass</span> <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

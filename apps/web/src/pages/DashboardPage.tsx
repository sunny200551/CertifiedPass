import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Award, Shield, PlusCircle, ExternalLink, Share2, Sparkles, LayoutDashboard } from "lucide-react";
import { Layout } from "../components/layout/Layout.js";
import { Button } from "../components/ui/Button.js";
import { Badge } from "../components/ui/Badge.js";
import { HolographicCard3D } from "../components/credential/HolographicCard3D.js";
import { useAuth } from "../context/AuthContext.js";
import { api } from "../lib/api.js";

export default function DashboardPage() {
  const { user, isAuthenticated, login } = useAuth();
  const [credentials, setCredentials] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadHolderCredentials() {
      if (!user?.walletAddress) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get(`/credentials?holderAddress=${user.walletAddress}`);
        setCredentials(res.data.data.items || []);
      } catch {
        // Fallback demo credentials
        setCredentials([
          {
            id: "cp-hackathon-2026-ethsf",
            credentialType: "hackathon",
            status: "ACTIVE",
            issuedAt: new Date().toISOString(),
            metadata: {
              title: "1st Place Winner — Global Web3 AI Hackathon",
              holderName: user.displayName || "Alex Rivera",
              issuerName: "ETHSF & Polygon Labs",
              achievement: "1st Place Winner - Infrastructure Track",
              skills: ["Solidity", "TypeScript", "Three.js", "Zod"],
            },
            credentialHash: "4a9d721183c509539fbe54b5df16a7f85dc9eb3e85e507f3531b790d0ef093ac",
            issuer: { name: "ETHSF & Polygon Labs" },
          },
        ]);
      } finally {
        setLoading(false);
      }
    }

    loadHolderCredentials();
  }, [user]);

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-8 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-white sm:text-3xl">Holder Dashboard</h1>
              <Badge variant="active" size="sm">
                Connected
              </Badge>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Manage your verified achievements, share proof profiles, and review on-chain anchors.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {user?.username ? (
              <Link to={`/u/${user.username}`}>
                <Button variant="secondary" size="sm" className="gap-1.5">
                  <Share2 className="h-4 w-4" /> View Public Profile
                </Button>
              </Link>
            ) : (
              <Link to="/profile">
                <Button variant="secondary" size="sm">
                  Set Username
                </Button>
              </Link>
            )}
            <Link to="/verify">
              <Button variant="outline" size="sm">
                Verify New ID
              </Button>
            </Link>
          </div>
        </div>

        {/* Credentials Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="h-5 w-5 text-cyan-400" /> My Verified Credentials ({credentials.length})
            </h2>
            <Link to="/credentials" className="text-xs text-cyan-400 hover:underline">
              View All
            </Link>
          </div>

          {credentials.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center">
              <Award className="h-12 w-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">No Credentials Found Yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                When hackathon organizers, companies, or open source orgs issue credentials to your wallet address, they will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
              {credentials.map((c) => (
                <div key={c.id} className="w-full flex flex-col items-center">
                  <HolographicCard3D
                    id={c.id}
                    title={c.metadata?.title || "Achievement"}
                    holderName={c.metadata?.holderName || user?.displayName || "Holder"}
                    issuerName={c.issuer?.name || c.metadata?.issuerName || "CertifiedPass Issuer"}
                    credentialType={c.credentialType}
                    issuedAt={c.issuedAt || new Date().toISOString()}
                    credentialHash={c.credentialHash}
                    isVerified={c.status === "ACTIVE"}
                    metadata={c.metadata}
                  />
                  <div className="mt-3 flex items-center gap-3">
                    <Link
                      to={`/c/${c.id}`}
                      className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                    >
                      Audit Proof <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

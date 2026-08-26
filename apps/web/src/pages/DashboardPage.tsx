import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Award, Shield, PlusCircle, ExternalLink, Share2, Sparkles, LayoutDashboard, QrCode } from "lucide-react";
import { Layout } from "../components/layout/Layout.js";
import { Button } from "../components/ui/Button.js";
import { Badge } from "../components/ui/Badge.js";
import { HolographicCard3D } from "../components/credential/HolographicCard3D.js";
import { CredentialQRModal } from "../components/credential/CredentialQRModal.js";
import { useAuth } from "../context/AuthContext.js";
import { api } from "../lib/api.js";

export default function DashboardPage() {
  const { user, isAuthenticated, login } = useAuth();
  const [credentials, setCredentials] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedQR, setSelectedQR] = useState<{ id: string; title: string } | null>(null);

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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/90 pb-8 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl font-display">Holder Dashboard</h1>
              <Badge variant="active" size="sm">
                Live Wallet
              </Badge>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Manage, view, and share your Polygon Amoy verified credentials.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {user?.username && (
              <Link to={`/u/${user.username}`}>
                <Button variant="outline" size="sm" className="gap-1.5 text-xs shadow-apple-sm">
                  <ExternalLink className="h-3.5 w-3.5" /> View Public Profile
                </Button>
              </Link>
            )}
            <Link to="/verify">
              <Button variant="primary" size="sm" className="gap-1.5 text-xs shadow-apple-sm">
                Verify Any Credential
              </Button>
            </Link>
          </div>
        </div>

        {/* Not Authenticated Callout */}
        {!isAuthenticated && (
          <div className="rounded-3xl border border-indigo-200/90 bg-indigo-50/50 p-8 shadow-apple-sm text-center max-w-2xl mx-auto my-12 space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-apple-sm">
              <Shield className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 font-display">Connect Wallet to Access Your Credentials</h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Sign in with your EVM wallet using Sign-In with Ethereum (SIWE) to load all credentials issued to your wallet address.
            </p>
            <div className="pt-2">
              <Button variant="cyan" size="md" onClick={login}>
                Sign In (SIWE)
              </Button>
            </div>
          </div>
        )}

        {/* Credentials Grid */}
        {isAuthenticated && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 font-display">My Digital Achievement Passes</h2>
              <span className="text-xs text-slate-500 font-medium">{credentials.length} Issued Passes</span>
            </div>

            {credentials.length === 0 ? (
              <div className="rounded-3xl border border-slate-200/90 bg-white p-12 text-center text-slate-500 shadow-apple-sm">
                <p>No credentials found for this wallet address yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {credentials.map((cred) => (
                  <div key={cred.id} className="flex flex-col items-center">
                    <HolographicCard3D
                      id={cred.id}
                      title={cred.metadata?.title || "Hackathon Credential"}
                      holderName={cred.metadata?.holderName || user?.displayName || "Alex Rivera"}
                      issuerName={cred.issuer?.name || "ETHSF & Polygon Labs"}
                      credentialType={cred.credentialType}
                      issuedAt={cred.issuedAt}
                      credentialHash={cred.credentialHash}
                      status={cred.status}
                      isVerified={cred.status === "ACTIVE"}
                      metadata={cred.metadata}
                      onShowQR={() => setSelectedQR({ id: cred.id, title: cred.metadata?.title || "Credential" })}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* QR Modal */}
      {selectedQR && (
        <CredentialQRModal
          isOpen={!!selectedQR}
          onClose={() => setSelectedQR(null)}
          credentialId={selectedQR.id}
          title={selectedQR.title}
        />
      )}
    </Layout>
  );
}

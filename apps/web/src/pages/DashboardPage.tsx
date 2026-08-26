import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Award, Shield, PlusCircle, ExternalLink, Share2, Sparkles, LayoutDashboard, QrCode, User, Edit3 } from "lucide-react";
import { Layout } from "../components/layout/Layout.js";
import { Button } from "../components/ui/Button.js";
import { Badge } from "../components/ui/Badge.js";
import { HolographicCard3D } from "../components/credential/HolographicCard3D.js";
import { CredentialQRModal } from "../components/credential/CredentialQRModal.js";
import { DecentralizedRegistry } from "../lib/blockchain.js";
import { useAuth } from "../context/AuthContext.js";
import { api } from "../lib/api.js";

export default function DashboardPage() {
  const { user, isAuthenticated, login, openProfileModal } = useAuth();
  const [credentials, setCredentials] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedQR, setSelectedQR] = useState<{ id: string; title: string } | null>(null);

  useEffect(() => {
    function loadHolderCredentials() {
      setLoading(true);
      try {
        const holderAddr = user?.walletAddress || "0x71C845137F73612FACb1C1E6e3e1A144e5904F2E";
        let creds = DecentralizedRegistry.getByHolder(holderAddr);
        if (creds.length === 0) {
          creds = DecentralizedRegistry.getAll();
        }
        setCredentials(creds);
      } catch (err) {
        console.warn("Decentralized credential loader fallback:", err);
        setCredentials(DecentralizedRegistry.getAll());
      } finally {
        setLoading(false);
      }
    }

    loadHolderCredentials();
  }, [user]);

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 text-slate-900">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/90 pb-8 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl font-display">Holder Dashboard</h1>
              <Badge variant="active" size="sm">
                Polygon Amoy
              </Badge>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Manage, view, and share your verifiable blockchain achievements.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={openProfileModal}
              className="gap-1.5 text-xs shadow-apple-sm"
            >
              <Edit3 className="h-3.5 w-3.5" /> Edit Profile & Name
            </Button>
            {user?.username && (
              <Link to={`/u/${user.username}`}>
                <Button variant="secondary" size="sm" className="gap-1.5 text-xs shadow-apple-sm">
                  <ExternalLink className="h-3.5 w-3.5" /> Public Profile
                </Button>
              </Link>
            )}
            <Link to="/verify">
              <Button variant="primary" size="sm" className="gap-1.5 text-xs shadow-apple-sm">
                Verify Any Pass
              </Button>
            </Link>
          </div>
        </div>

        {/* Profile Card Banner */}
        {isAuthenticated && user && (
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-apple-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-700 text-xl font-bold font-display shadow-apple-sm">
                {user.displayName?.slice(0, 2).toUpperCase() || "PH"}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900 font-display">{user.displayName}</h3>
                  {user.username && (
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-mono text-slate-700 font-semibold">
                      @{user.username}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  {user.bio || "No bio added yet. Click 'Edit Profile & Name' to customize."}
                </p>
                <p className="text-[11px] font-mono text-slate-400 truncate max-w-xs sm:max-w-md">
                  {user.walletAddress}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={openProfileModal} className="text-xs">
                Change Details
              </Button>
            </div>
          </div>
        )}

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
              <Button variant="primary" size="md" onClick={login} className="shadow-apple-sm">
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

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 text-[var(--text-primary)]">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--shadow-dark)]/15 pb-8 mb-8">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-extrabold text-[var(--text-primary)] sm:text-3xl font-display">Holder Dashboard</h1>
              <Badge variant="active" size="sm" inset={false}>
                Polygon Amoy
              </Badge>
            </div>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Manage, view, and share your verifiable blockchain achievements.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={openProfileModal}
              className="gap-1.5 text-xs rounded-full"
            >
              <Edit3 className="h-3.5 w-3.5" /> Edit Profile & Name
            </Button>
            {user?.username && (
              <Link to={`/u/${user.username}`}>
                <Button variant="secondary" size="sm" className="gap-1.5 text-xs rounded-full">
                  <ExternalLink className="h-3.5 w-3.5" /> Public Profile
                </Button>
              </Link>
            )}
            <Link to="/verify">
              <Button variant="primary" size="sm" className="gap-1.5 text-xs rounded-full">
                Verify Any Pass
              </Button>
            </Link>
          </div>
        </div>

        {/* Profile Card Banner */}
        {isAuthenticated && user && (
          <div className="rounded-[24px] neo-raised bg-[var(--surface-bg)] p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all">
            <div className="flex items-center gap-4">
              <div className="neo-raised-sm flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[var(--brand-indigo)] to-[var(--brand-violet)] text-white text-xl font-bold font-display flex-shrink-0">
                {user.displayName?.slice(0, 2).toUpperCase() || "PH"}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-[var(--text-primary)] font-display">{user.displayName}</h3>
                  {user.username && (
                    <span className="neo-inset-sm rounded-full bg-[var(--surface-bg)] px-2.5 py-0.5 text-xs font-mono text-[var(--brand-indigo)] font-bold">
                      @{user.username}
                    </span>
                  )}
                </div>
                <p className="text-xs text-[var(--text-secondary)]">
                  {user.bio || "No bio added yet. Click 'Edit Profile & Name' to customize."}
                </p>
                <p className="text-[11px] font-mono text-[var(--text-secondary)] truncate max-w-xs sm:max-w-md">
                  {user.walletAddress}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={openProfileModal} className="text-xs rounded-full">
                Change Details
              </Button>
            </div>
          </div>
        )}

        {/* Not Authenticated Callout */}
        {!isAuthenticated && (
          <div className="rounded-[24px] neo-raised bg-[var(--surface-bg)] p-8 text-center max-w-2xl mx-auto my-12 space-y-4">
            <div className="mx-auto neo-raised-sm flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[var(--brand-indigo)] to-[var(--brand-violet)] text-white">
              <Shield className="h-7 w-7" />
            </div>
            <h2 className="text-xl font-bold text-[var(--text-primary)] font-display">Connect Wallet to Access Your Credentials</h2>
            <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed">
              Sign in with your EVM wallet using Sign-In with Ethereum (SIWE) to load all credentials issued to your wallet address.
            </p>
            <div className="pt-2">
              <Button variant="primary" size="md" onClick={login} className="rounded-full px-7">
                Sign In (SIWE)
              </Button>
            </div>
          </div>
        )}

        {/* Credentials Grid */}
        {isAuthenticated && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[var(--text-primary)] font-display">My Digital Achievement Passes</h2>
              <span className="neo-raised-sm rounded-full px-3 py-1 text-xs text-[var(--text-secondary)] font-bold bg-[var(--surface-bg)]">
                {credentials.length} Issued Passes
              </span>
            </div>

            {credentials.length === 0 ? (
              <div className="rounded-[24px] neo-inset bg-[var(--surface-bg)] p-12 text-center text-[var(--text-secondary)]">
                <p>No credentials found for this wallet address yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {credentials.map((cred, index) => (
                  <motion.div
                    key={cred.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
                    className="flex flex-col items-center hover:-translate-y-1 transition-transform"
                  >
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
                  </motion.div>
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

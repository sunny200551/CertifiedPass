import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Award, Filter, Search, ExternalLink } from "lucide-react";
import { Layout } from "../components/layout/Layout.js";
import { HolographicCard3D } from "../components/credential/HolographicCard3D.js";
import { CredentialQRModal } from "../components/credential/CredentialQRModal.js";
import { Badge } from "../components/ui/Badge.js";
import { useAuth } from "../context/AuthContext.js";
import { DecentralizedRegistry, type DecentralizedCredential } from "../lib/blockchain.js";

export default function MyCredentials() {
  const { user } = useAuth();
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedQR, setSelectedQR] = useState<{ id: string; title: string } | null>(null);

  const allCreds = React.useMemo(() => {
    if (user?.walletAddress) {
      return DecentralizedRegistry.getByHolder(user.walletAddress);
    }
    return DecentralizedRegistry.getAll();
  }, [user]);

  const filtered = selectedType === "all" ? allCreds : allCreds.filter((c) => c.credentialType === selectedType);

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 text-[var(--text-primary)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--shadow-dark)]/15 pb-6 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] font-display">My Credentials</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">All verified credentials anchored to your wallet address.</p>
          </div>

          {/* Category Filter Pills (Neomorphic) */}
          <div className="flex flex-wrap gap-2">
            {["all", "hackathon", "internship", "opensource", "competition", "workshop"].map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                  selectedType === t
                    ? "neo-pill-active text-[var(--brand-indigo)]"
                    : "neo-raised-sm bg-[var(--surface-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Credentials Grid */}
        {filtered.length === 0 ? (
          <div className="rounded-[24px] neo-inset bg-[var(--surface-bg)] p-12 text-center text-[var(--text-secondary)]">
            <p className="font-semibold text-sm">No verifiable credentials found in this category.</p>
            <p className="text-xs text-slate-400 mt-1">Credentials issued to your wallet on Polygon will appear here in real-time.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((c) => (
              <div key={c.id} className="flex flex-col items-center hover:-translate-y-1 transition-transform">
                <HolographicCard3D
                  id={c.id}
                  title={c.title}
                  holderName={c.holderName || user?.displayName || "Verified Recipient"}
                  issuerName={c.issuerName || "CertifiedPass Registry"}
                  credentialType={c.credentialType}
                  issuedAt={c.issuedAt}
                  status={c.status}
                  isVerified={c.isVerified}
                  metadata={c.metadata}
                  onShowQR={() => setSelectedQR({ id: c.id, title: c.title })}
                />
              </div>
            ))}
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

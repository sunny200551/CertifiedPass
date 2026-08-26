import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Award, Filter, Search, ExternalLink } from "lucide-react";
import { Layout } from "../components/layout/Layout.js";
import { HolographicCard3D } from "../components/credential/HolographicCard3D.js";
import { CredentialQRModal } from "../components/credential/CredentialQRModal.js";
import { Badge } from "../components/ui/Badge.js";
import { useAuth } from "../context/AuthContext.js";

export default function MyCredentials() {
  const { user } = useAuth();
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedQR, setSelectedQR] = useState<{ id: string; title: string } | null>(null);

  const credentials = [
    {
      id: "cp-hackathon-2026-ethsf",
      credentialType: "hackathon",
      title: "1st Place Winner — Global Web3 AI Hackathon",
      issuedAt: "2026-08-20",
      issuer: { name: "ETHSF & Polygon Labs" },
      metadata: { placement: "1st Place Winner", track: "Infrastructure Track", skills: ["Solidity", "TypeScript", "Three.js"] },
    },
    {
      id: "cp-internship-2026-consensys",
      credentialType: "internship",
      title: "Smart Contract Engineering Intern",
      issuedAt: "2026-07-31",
      issuer: { name: "ConsenSys" },
      metadata: { companyName: "ConsenSys", role: "Smart Contract Intern", skills: ["Foundry", "EVM", "Auditing"] },
    },
    {
      id: "cp-opensource-2026-ethers",
      credentialType: "opensource",
      title: "Core Contributor — Ethers.js v6",
      issuedAt: "2026-06-15",
      issuer: { name: "Ethers Org" },
      metadata: { organizationName: "Ethers", repositoryName: "ethers.js", skills: ["TypeScript", "Cryptography"] },
    },
  ];

  const filtered = selectedType === "all" ? credentials : credentials.filter((c) => c.credentialType === selectedType);

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 text-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/90 pb-6 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">My Credentials</h1>
            <p className="text-sm text-slate-500 mt-1">All verified credentials anchored to your wallet address.</p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {["all", "hackathon", "internship", "opensource", "competition", "workshop"].map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                  selectedType === t
                    ? "bg-slate-900 text-white shadow-apple-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Credentials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((c) => (
            <div key={c.id} className="flex flex-col items-center">
              <HolographicCard3D
                id={c.id}
                title={c.title}
                holderName={user?.displayName || "Alex Rivera"}
                issuerName={c.issuer.name}
                credentialType={c.credentialType}
                issuedAt={c.issuedAt}
                status="ACTIVE"
                isVerified={true}
                metadata={c.metadata}
                onShowQR={() => setSelectedQR({ id: c.id, title: c.title })}
              />
            </div>
          ))}
        </div>
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

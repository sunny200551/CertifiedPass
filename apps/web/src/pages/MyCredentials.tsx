import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Award, Filter, Search, ExternalLink } from "lucide-react";
import { Layout } from "../components/layout/Layout.js";
import { HolographicCard3D } from "../components/credential/HolographicCard3D.js";
import { Badge } from "../components/ui/Badge.js";
import { useAuth } from "../context/AuthContext.js";

export default function MyCredentials() {
  const { user } = useAuth();
  const [selectedType, setSelectedType] = useState<string>("all");

  const credentials = [
    {
      id: "cp-hackathon-2026-ethsf",
      credentialType: "hackathon",
      title: "1st Place Winner — Global Web3 AI Hackathon",
      issuedAt: "2026-08-20",
      issuer: { name: "ETHSF & Polygon Labs" },
      metadata: { achievement: "1st Place Winner - Infrastructure Track", skills: ["Solidity", "TypeScript", "Three.js"] },
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
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">My Credentials</h1>
            <p className="text-sm text-slate-400 mt-1">All verified credentials anchored to your wallet address.</p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {["all", "hackathon", "internship", "opensource", "competition", "workshop"].map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  selectedType === t
                    ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                    : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {filtered.map((c) => (
            <div key={c.id} className="w-full flex flex-col items-center">
              <HolographicCard3D
                id={c.id}
                title={c.title}
                holderName={user?.displayName || "Alex Rivera"}
                issuerName={c.issuer.name}
                credentialType={c.credentialType}
                issuedAt={c.issuedAt}
                isVerified={true}
                metadata={c.metadata}
              />
              <Link
                to={`/c/${c.id}`}
                className="mt-3 text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                View Verification Certificate <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

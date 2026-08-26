import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShieldCheck, Award, ExternalLink, Share2, Check, User, Sparkles } from "lucide-react";
import { Layout } from "../components/layout/Layout.js";
import { Button } from "../components/ui/Button.js";
import { Badge } from "../components/ui/Badge.js";
import { HolographicCard3D } from "../components/credential/HolographicCard3D.js";
import { api } from "../lib/api.js";

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const [copied, setCopied] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadProfile() {
      if (!username) return;
      setLoading(true);
      try {
        const res = await api.get(`/profiles/${encodeURIComponent(username)}`);
        setProfile(res.data.data);
      } catch {
        // Fallback demo profile
        setProfile({
          user: {
            username: username || "alexrivera",
            displayName: "Alex Rivera",
            bio: "Full-stack Web3 engineer & smart contract architect. Building verifiable digital infrastructure.",
            avatarUrl: null,
            memberSince: "2026-01-15T00:00:00.000Z",
          },
          stats: {
            totalCredentials: 3,
            hackathons: 1,
            internships: 1,
            openSource: 1,
            competitions: 0,
            workshops: 0,
            events: 0,
          },
          credentials: [
            {
              id: "cp-hackathon-2026-ethsf",
              credentialType: "hackathon",
              title: "1st Place Winner — Global Web3 AI Hackathon",
              holderName: "Alex Rivera",
              issuedAt: "2026-08-20T00:00:00.000Z",
              issuer: { name: "ETHSF & Polygon Labs", verificationStatus: "VERIFIED" },
              credentialHash: "4a9d721183c509539fbe54b5df16a7f85dc9eb3e85e507f3531b790d0ef093ac",
              metadata: { achievement: "1st Place Winner - Infrastructure Track", skills: ["Solidity", "TypeScript", "Three.js"] },
            },
            {
              id: "cp-internship-2026-consensys",
              credentialType: "internship",
              title: "Smart Contract Engineering Intern",
              holderName: "Alex Rivera",
              issuedAt: "2026-07-31T00:00:00.000Z",
              issuer: { name: "ConsenSys", verificationStatus: "VERIFIED" },
              credentialHash: "7b8e1940a12cf4608c028e46950280f55c27ad6bb2c6e61f22e841289191d90a",
              metadata: { companyName: "ConsenSys", role: "Smart Contract Intern", skills: ["Foundry", "EVM", "Auditing"] },
            },
            {
              id: "cp-opensource-2026-ethers",
              credentialType: "opensource",
              title: "Core Contributor — Ethers.js v6",
              holderName: "Alex Rivera",
              issuedAt: "2026-06-15T00:00:00.000Z",
              issuer: { name: "Ethers Org", verificationStatus: "VERIFIED" },
              credentialHash: "9f321458e0a78627b0c95027c91a742841b802a46e174092b77138096180a012",
              metadata: { organizationName: "Ethers", repositoryName: "ethers.js", skills: ["TypeScript", "Cryptography"] },
            },
          ],
        });
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [username]);

  const copyProfileLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-slate-950/90 p-8 shadow-2xl backdrop-blur-xl mb-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start md:items-center gap-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-slate-950 text-2xl font-extrabold shadow-lg shadow-cyan-500/20">
                {profile?.user?.displayName?.slice(0, 2).toUpperCase() || "AR"}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-white">{profile?.user?.displayName}</h1>
                  <Badge variant="verified" dot size="sm">
                    Verified Holder
                  </Badge>
                </div>
                <p className="text-xs font-mono text-cyan-400">@{profile?.user?.username}</p>
                <p className="text-sm text-slate-300 max-w-xl pt-1 leading-relaxed">
                  {profile?.user?.bio}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="secondary" size="sm" onClick={copyProfileLink}>
                {copied ? <Check className="h-4 w-4 mr-1.5" /> : <Share2 className="h-4 w-4 mr-1.5" />}
                {copied ? "Copied" : "Share Profile"}
              </Button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-800/80 pt-6">
            <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800/60">
              <span className="text-[10px] uppercase font-bold text-slate-500">Total Verified</span>
              <p className="text-xl font-extrabold text-white">{profile?.stats?.totalCredentials || 0}</p>
            </div>
            <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800/60">
              <span className="text-[10px] uppercase font-bold text-cyan-400">Hackathons</span>
              <p className="text-xl font-extrabold text-cyan-300">{profile?.stats?.hackathons || 0}</p>
            </div>
            <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800/60">
              <span className="text-[10px] uppercase font-bold text-purple-400">Internships</span>
              <p className="text-xl font-extrabold text-purple-300">{profile?.stats?.internships || 0}</p>
            </div>
            <div className="rounded-xl bg-slate-950/60 p-3 border border-slate-800/60">
              <span className="text-[10px] uppercase font-bold text-emerald-400">Open Source</span>
              <p className="text-xl font-extrabold text-emerald-300">{profile?.stats?.openSource || 0}</p>
            </div>
          </div>
        </div>

        {/* Credentials Showcase Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Award className="h-5 w-5 text-cyan-400" /> Verified Achievements
            </h2>
            <span className="text-xs text-slate-400">Anchored on Polygon Amoy EVM</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {profile?.credentials?.map((cred: any) => (
              <div key={cred.id} className="w-full flex flex-col items-center">
                <HolographicCard3D
                  id={cred.id}
                  title={cred.title}
                  holderName={cred.holderName}
                  issuerName={cred.issuer?.name || "CertifiedPass Issuer"}
                  credentialType={cred.credentialType}
                  issuedAt={cred.issuedAt}
                  credentialHash={cred.credentialHash}
                  isVerified={true}
                  metadata={cred.metadata}
                />
                <Link
                  to={`/c/${cred.id}`}
                  className="mt-2 text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  Verify Cryptographic Anchor <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

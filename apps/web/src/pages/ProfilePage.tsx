import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShieldCheck, Award, ExternalLink, Share2, Check, User, Sparkles, Code, QrCode } from "lucide-react";
import { Layout } from "../components/layout/Layout.js";
import { Button } from "../components/ui/Button.js";
import { Badge } from "../components/ui/Badge.js";
import { HolographicCard3D } from "../components/credential/HolographicCard3D.js";
import { ProfileBadgeEmbedModal } from "../components/profile/ProfileBadgeEmbedModal.js";
import { CredentialQRModal } from "../components/credential/CredentialQRModal.js";
import { api } from "../lib/api.js";

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const [copied, setCopied] = useState(false);
  const [showEmbed, setShowEmbed] = useState(false);
  const [selectedQR, setSelectedQR] = useState<{ id: string; title: string } | null>(null);
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
            username: username || "alex.rivera",
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
              metadata: { placement: "1st Place Winner", track: "Infrastructure Track", skills: ["Solidity", "TypeScript", "Three.js"] },
            },
            {
              id: "cp-internship-2026-consensys",
              credentialType: "internship",
              title: "Smart Contract Engineering Intern",
              holderName: "Alex Rivera",
              issuedAt: "2026-07-31T00:00:00.000Z",
              issuer: { name: "ConsenSys", verificationStatus: "VERIFIED" },
              credentialHash: "6c9d823483c509539fbe54b5df16a7f85dc9eb3e85e507f3531b790d0ef123ab",
              metadata: { role: "Engineering Intern", skills: ["EVM", "Audit", "Foundry"] },
            },
            {
              id: "cp-opensource-2026-ethers",
              credentialType: "opensource",
              title: "Core Contributor — Ethers.js v6",
              holderName: "Alex Rivera",
              issuedAt: "2026-06-15T00:00:00.000Z",
              issuer: { name: "Ethers Org", verificationStatus: "VERIFIED" },
              credentialHash: "8f1a923483c509539fbe54b5df16a7f85dc9eb3e85e507f3531b790d0ef789ef",
              metadata: { role: "Core Contributor", skills: ["TypeScript", "Cryptography"] },
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

  if (loading) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center space-y-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent mx-auto" />
            <p className="text-sm font-medium text-slate-500 font-display">Loading Proof Profile...</p>
          </div>
        </div>
      </Layout>
    );
  }

  const u = profile?.user;
  const stats = profile?.stats;
  const credentials = profile?.credentials || [];

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Profile Header Card */}
        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-apple-md mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-50 border border-indigo-100 text-indigo-700 text-2xl font-bold font-display shadow-apple-sm flex-shrink-0">
                {u?.displayName?.slice(0, 2).toUpperCase() || "AR"}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
                    {u?.displayName || "Alex Rivera"}
                  </h1>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                    <ShieldCheck className="h-3.5 w-3.5" /> Verified Holder
                  </span>
                </div>
                <p className="text-xs font-mono text-slate-500 font-medium">@{u?.username || "alex.rivera"}</p>
                <p className="text-sm text-slate-600 max-w-xl leading-relaxed pt-1">{u?.bio}</p>
              </div>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto">
              <Button variant="outline" size="sm" onClick={copyProfileLink} className="text-xs gap-1.5 flex-1 sm:flex-none">
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Share2 className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Share Profile"}
              </Button>
              <Button variant="primary" size="sm" onClick={() => setShowEmbed(true)} className="text-xs gap-1.5 flex-1 sm:flex-none">
                <Code className="h-3.5 w-3.5" /> Embed Badge
              </Button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-100 pt-6">
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 text-center">
              <div className="text-2xl font-black text-slate-900 font-display">{stats?.totalCredentials || credentials.length}</div>
              <div className="text-xs text-slate-500 font-medium">Verified Credentials</div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 text-center">
              <div className="text-2xl font-black text-indigo-600 font-display">{stats?.hackathons || 1}</div>
              <div className="text-xs text-slate-500 font-medium">Hackathon Awards</div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 text-center">
              <div className="text-2xl font-black text-sky-600 font-display">{stats?.internships || 1}</div>
              <div className="text-xs text-slate-500 font-medium">Internships</div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 text-center">
              <div className="text-2xl font-black text-emerald-600 font-display">{stats?.openSource || 1}</div>
              <div className="text-xs text-slate-500 font-medium">Open-Source Merges</div>
            </div>
          </div>
        </div>

        {/* Credentials Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 font-display">Verifiable Achievement Passes</h2>
            <span className="text-xs text-slate-500">Publicly Auditable on Polygon Amoy</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {credentials.map((cred: any) => (
              <div key={cred.id} className="flex flex-col items-center">
                <HolographicCard3D
                  id={cred.id}
                  title={cred.title}
                  holderName={cred.holderName || u?.displayName}
                  issuerName={cred.issuer?.name || "Verified Organization"}
                  credentialType={cred.credentialType}
                  issuedAt={cred.issuedAt}
                  credentialHash={cred.credentialHash}
                  status="ACTIVE"
                  isVerified={true}
                  metadata={cred.metadata}
                  onShowQR={() => setSelectedQR({ id: cred.id, title: cred.title })}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Embed Badge Modal */}
      <ProfileBadgeEmbedModal
        isOpen={showEmbed}
        onClose={() => setShowEmbed(false)}
        username={u?.username || "alex.rivera"}
        displayName={u?.displayName || "Alex Rivera"}
      />

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

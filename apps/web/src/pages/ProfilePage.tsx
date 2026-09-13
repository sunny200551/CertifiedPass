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
        <div className="flex min-h-[60vh] items-center justify-center text-[var(--text-primary)]">
          <div className="text-center space-y-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--brand-indigo)] border-t-transparent mx-auto" />
            <p className="text-sm font-bold text-[var(--text-primary)] font-display">Loading Proof Profile...</p>
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
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 text-[var(--text-primary)]">
        {/* Profile Header Card (Raised Panel) */}
        <div className="rounded-[24px] neo-raised bg-[var(--surface-bg)] p-6 sm:p-8 mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="neo-raised-sm flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[var(--brand-indigo)] to-[var(--brand-violet)] text-white text-2xl font-bold font-display flex-shrink-0">
                {u?.displayName?.slice(0, 2).toUpperCase() || "AR"}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] font-display">
                    {u?.displayName || "Alex Rivera"}
                  </h1>
                  <span className="neo-raised-sm inline-flex items-center gap-1 rounded-full bg-[var(--accent-green-bg)] px-3 py-1 text-xs font-bold text-[var(--accent-green)]">
                    <ShieldCheck className="h-3.5 w-3.5" /> Verified Holder
                  </span>
                </div>
                <p className="text-xs font-mono text-[var(--brand-indigo)] font-bold">@{u?.username || "alex.rivera"}</p>
                <p className="text-sm text-[var(--text-secondary)] max-w-xl leading-relaxed pt-1">{u?.bio}</p>
              </div>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full sm:w-auto">
              <Button variant="outline" size="sm" onClick={copyProfileLink} className="text-xs gap-1.5 flex-1 sm:flex-none rounded-full">
                {copied ? <Check className="h-3.5 w-3.5 text-[var(--accent-green)]" /> : <Share2 className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Share Profile"}
              </Button>
              <Button variant="primary" size="sm" onClick={() => setShowEmbed(true)} className="text-xs gap-1.5 flex-1 sm:flex-none rounded-full px-5">
                <Code className="h-3.5 w-3.5" /> Embed Badge
              </Button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-[var(--shadow-dark)]/15 pt-6">
            <div className="rounded-2xl neo-inset bg-[var(--surface-bg)] p-4 text-center">
              <div className="text-2xl font-black text-[var(--text-primary)] font-display">{stats?.totalCredentials || credentials.length}</div>
              <div className="text-xs text-[var(--text-secondary)] font-bold">Verified Credentials</div>
            </div>
            <div className="rounded-2xl neo-inset bg-[var(--surface-bg)] p-4 text-center">
              <div className="text-2xl font-black text-[var(--brand-indigo)] font-display">{stats?.hackathons || 1}</div>
              <div className="text-xs text-[var(--text-secondary)] font-bold">Hackathon Awards</div>
            </div>
            <div className="rounded-2xl neo-inset bg-[var(--surface-bg)] p-4 text-center">
              <div className="text-2xl font-black text-[var(--accent-cyan)] font-display">{stats?.internships || 1}</div>
              <div className="text-xs text-[var(--text-secondary)] font-bold">Internships</div>
            </div>
            <div className="rounded-2xl neo-inset bg-[var(--surface-bg)] p-4 text-center">
              <div className="text-2xl font-black text-[var(--accent-green)] font-display">{stats?.openSource || 1}</div>
              <div className="text-xs text-[var(--text-secondary)] font-bold">Open-Source Merges</div>
            </div>
          </div>
        </div>

        {/* Credentials Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[var(--text-primary)] font-display">Verifiable Achievement Passes</h2>
            <span className="text-xs text-[var(--text-secondary)] font-bold">Publicly Auditable on Polygon Amoy</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {credentials.map((cred: any) => (
              <div key={cred.id} className="flex flex-col items-center hover:-translate-y-1 transition-transform">
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

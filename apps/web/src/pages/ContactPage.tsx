import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  MessageSquare,
  Send,
  Sparkles,
  CheckCircle2,
  ArrowLeft,
  Building2,
  HelpCircle,
  Github,
  Globe,
  Headphones,
  ShieldCheck,
} from "lucide-react";
import { Layout } from "../components/layout/Layout.js";
import { Button } from "../components/ui/Button.js";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    org: "",
    inquiryType: "partnership",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1000);
  };

  return (
    <Layout>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 text-[var(--text-primary)]">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] mb-8 transition-colors font-bold group"
        >
          <div className="neo-icon-btn h-7 w-7 group-hover:-translate-x-0.5 transition-transform">
            <ArrowLeft className="h-3.5 w-3.5" />
          </div>
          <span>Back to Home</span>
        </Link>

        {/* Hero Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-black text-[var(--brand-indigo)] bg-indigo-500/10 border border-indigo-500/20 neo-inset-sm">
            <Headphones className="h-4 w-4" />
            <span>DIRECT SUPPORT & PARTNERSHIPS</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[var(--text-primary)] font-display tracking-tight">
            Get in Touch with CertifiedPass
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-2xl mx-auto font-medium leading-relaxed">
            Have questions about issuing credentials, integrating our verification APIs, or collaborating on decentralized identity? Our team is here to assist.
          </p>
        </div>

        {/* Contact Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="neo-raised p-6 rounded-3xl bg-[var(--surface-bg)] border border-[var(--neo-outline)]/40 space-y-3">
            <div className="h-10 w-10 rounded-2xl neo-inset-sm bg-indigo-500/10 text-[var(--brand-indigo)] flex items-center justify-center font-bold">
              <Mail className="h-5 w-5" />
            </div>
            <h3 className="text-base font-extrabold font-display">Email Support</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium">
              Reach our core engineering and support team directly:
            </p>
            <a
              href="mailto:support@certifiedpass.polylance.codes"
              className="text-xs font-mono font-bold text-[var(--brand-indigo)] hover:underline block pt-1"
            >
              support@certifiedpass.polylance.codes
            </a>
          </div>

          <div className="neo-raised p-6 rounded-3xl bg-[var(--surface-bg)] border border-[var(--neo-outline)]/40 space-y-3">
            <div className="h-10 w-10 rounded-2xl neo-inset-sm bg-purple-500/10 text-[var(--accent-purple)] flex items-center justify-center font-bold">
              <MessageSquare className="h-5 w-5" />
            </div>
            <h3 className="text-base font-extrabold font-display">Community Discord</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium">
              Join discussions with Web3 issuers, developers, and credential holders:
            </p>
            <a
              href="https://discord.com"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-[var(--accent-purple)] hover:underline block pt-1"
            >
              Join Discord Server →
            </a>
          </div>

          <div className="neo-raised p-6 rounded-3xl bg-[var(--surface-bg)] border border-[var(--neo-outline)]/40 space-y-3">
            <div className="h-10 w-10 rounded-2xl neo-inset-sm bg-cyan-500/10 text-[var(--accent-cyan)] flex items-center justify-center font-bold">
              <Github className="h-5 w-5" />
            </div>
            <h3 className="text-base font-extrabold font-display">Developer GitHub</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium">
              Report bugs, inspect open-source contracts, and submit PRs:
            </p>
            <a
              href="https://github.com/sunny200551/CertifiedPass"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-[var(--accent-cyan)] hover:underline block pt-1"
            >
              github.com/sunny200551/CertifiedPass →
            </a>
          </div>
        </div>

        {/* Interactive Form & FAQ Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Inquiry Form */}
          <div className="lg:col-span-7 bg-[var(--surface-bg)] neo-raised p-6 sm:p-10 rounded-3xl border border-[var(--neo-outline)]/50">
            {isSubmitted ? (
              <div className="text-center py-10 space-y-4 animate-fadeIn">
                <div className="h-16 w-16 rounded-full neo-inset-sm bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-black font-display text-[var(--text-primary)]">
                  Message Received!
                </h3>
                <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto leading-relaxed">
                  Thank you for contacting CertifiedPass. A member of our support team will respond to <strong className="text-[var(--text-primary)]">{formData.email}</strong> shortly.
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({ name: "", email: "", org: "", inquiryType: "partnership", message: "" });
                  }}
                  className="px-6 py-2.5 rounded-full text-xs font-bold neo-raised-sm hover:neo-raised text-[var(--brand-indigo)]"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h3 className="text-xl font-black font-display text-[var(--text-primary)]">
                    Send an Inquiry
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    Fill out the form below and we'll get back to you within 24 hours.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[var(--text-primary)]">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Rivera"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 text-xs rounded-2xl bg-[var(--surface-bg)] neo-inset-sm border border-[var(--neo-outline)]/40 text-[var(--text-primary)] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[var(--text-primary)]">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="alex@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 text-xs rounded-2xl bg-[var(--surface-bg)] neo-inset-sm border border-[var(--neo-outline)]/40 text-[var(--text-primary)] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[var(--text-primary)]">Organization / Event Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Polygon Guild, Hackathon Host"
                      value={formData.org}
                      onChange={(e) => setFormData({ ...formData, org: e.target.value })}
                      className="w-full px-4 py-2.5 text-xs rounded-2xl bg-[var(--surface-bg)] neo-inset-sm border border-[var(--neo-outline)]/40 text-[var(--text-primary)] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[var(--text-primary)]">Inquiry Topic</label>
                    <select
                      value={formData.inquiryType}
                      onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                      className="w-full px-4 py-2.5 text-xs rounded-2xl bg-[var(--surface-bg)] neo-inset-sm border border-[var(--neo-outline)]/40 text-[var(--text-primary)] focus:outline-none"
                    >
                      <option value="partnership">Issuer Onboarding & Verification</option>
                      <option value="api">Developer & API Integration</option>
                      <option value="polylance">PolyLance Milestone Inquiries</option>
                      <option value="support">General Platform Support</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[var(--text-primary)]">Message</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us about your requirements or question..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs rounded-2xl bg-[var(--surface-bg)] neo-inset-sm border border-[var(--neo-outline)]/40 text-[var(--text-primary)] focus:outline-none resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-2xl text-xs font-black bg-[var(--brand-indigo)] text-white hover:brightness-110 flex items-center justify-center gap-2 shadow-lg"
                >
                  {isSubmitting ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Submit Inquiry</span>
                    </>
                  )}
                </Button>
              </form>
            )}
          </div>

          {/* Quick FAQ Sidebar */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 bg-[var(--surface-bg)] neo-raised rounded-3xl border border-[var(--neo-outline)]/40 space-y-4">
              <h4 className="text-base font-extrabold font-display text-[var(--text-primary)] flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-[var(--brand-indigo)]" />
                <span>Frequently Asked Questions</span>
              </h4>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-2xl neo-inset-sm bg-[var(--surface-bg)] space-y-1">
                  <strong className="text-[var(--text-primary)] block">Who can issue credentials?</strong>
                  <p className="text-[var(--text-secondary)] leading-relaxed">
                    Any registered organization, hackathon team, university, or verified Web3 community can issue credentials directly through the Issuer Portal.
                  </p>
                </div>

                <div className="p-3 rounded-2xl neo-inset-sm bg-[var(--surface-bg)] space-y-1">
                  <strong className="text-[var(--text-primary)] block">Is verification free for employers?</strong>
                  <p className="text-[var(--text-secondary)] leading-relaxed">
                    Yes! Public verification via URL, QR scan, or REST API is 100% free and requires no wallet connection.
                  </p>
                </div>

                <div className="p-3 rounded-2xl neo-inset-sm bg-[var(--surface-bg)] space-y-1">
                  <strong className="text-[var(--text-primary)] block">Which blockchains are supported?</strong>
                  <p className="text-[var(--text-secondary)] leading-relaxed">
                    CertifiedPass anchors on Polygon PoS Mainnet (Chain 137) and Polygon Amoy Testnet (Chain 80002).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

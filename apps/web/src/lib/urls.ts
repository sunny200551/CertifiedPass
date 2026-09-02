/**
 * URL and Currency formatting utilities for CertifiedPass
 * Handles base path routing for GitHub Pages (e.g. /CertifiedPass/) and custom domains
 */

export function getAppBaseUrl(): string {
  if (typeof window === "undefined") {
    return "https://sunny200551.github.io/CertifiedPass";
  }
  const base = import.meta.env.BASE_URL || "/";
  const cleanBase = base.endsWith("/") ? base.slice(0, -1) : base;
  return `${window.location.origin}${cleanBase}`;
}

export function getCertificateUrl(credentialId: string): string {
  const base = getAppBaseUrl();
  return `${base}/c/${encodeURIComponent(credentialId)}`;
}

export function getVerifyUrl(certId?: string): string {
  const base = getAppBaseUrl();
  if (certId) {
    return `${base}/verify?certId=${encodeURIComponent(certId)}`;
  }
  return `${base}/verify`;
}

export function formatUsdc(amount: any): string {
  if (amount === undefined || amount === null || amount === "") return "$0.00 USDC";
  const str = String(amount).trim();
  if (str.startsWith("$") && str.toUpperCase().endsWith("USDC")) return str;
  if (str.startsWith("$")) return `${str} USDC`;
  const num = parseFloat(str.replace(/[^0-9.-]+/g, ""));
  if (isNaN(num)) return "$0.00 USDC";
  return `$${num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDC`;
}

export const logoUrl = `${import.meta.env.BASE_URL || "/"}CP_logo.png`.replace(/([^:]\/)\/+/g, "$1");

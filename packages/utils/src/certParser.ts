/**
 * Intelligent QR & URL Certificate Identifier Parser
 * Extracts canonical Certificate ID from raw input, scanned QR strings, or full web URLs.
 */

export function parseCertificateId(input: string | undefined | null): string {
  if (!input || typeof input !== "string") {
    return "";
  }

  let cleaned = input.trim();

  // Remove surrounding quotes or backticks if present
  cleaned = cleaned.replace(/^["'`]|["'`]$/g, "").trim();

  if (!cleaned) {
    return "";
  }

  // If it's already a clean ID with no URL syntax
  if (
    !cleaned.includes("://") &&
    !cleaned.includes("/") &&
    !cleaned.includes("?") &&
    !cleaned.includes("#") &&
    !cleaned.includes("&")
  ) {
    return cleaned;
  }

  try {
    // Normalize URL string for URL parsing
    const urlStr = cleaned.startsWith("http://") || cleaned.startsWith("https://")
      ? cleaned
      : `https://${cleaned}`;

    const parsedUrl = new URL(urlStr);

    // 1. Check query parameters on the main URL (?certId=..., ?cert=..., ?jobId=..., ?id=...)
    const certParam =
      parsedUrl.searchParams.get("certId") ||
      parsedUrl.searchParams.get("cert_id") ||
      parsedUrl.searchParams.get("cert") ||
      parsedUrl.searchParams.get("jobId") ||
      parsedUrl.searchParams.get("id");

    if (certParam) {
      return certParam.trim();
    }

    // 2. Check query parameters inside the hash (e.g. #/jobs/101?certId=PL-SBT-... or #/attestation?id=...)
    if (parsedUrl.hash && parsedUrl.hash.includes("?")) {
      const hashQueryString = parsedUrl.hash.substring(parsedUrl.hash.indexOf("?") + 1);
      const hashParams = new URLSearchParams(hashQueryString);
      const hashCertParam =
        hashParams.get("certId") ||
        hashParams.get("cert_id") ||
        hashParams.get("cert") ||
        hashParams.get("jobId") ||
        hashParams.get("id");

      if (hashCertParam) {
        return hashCertParam.trim();
      }
    }

    const ignoredKeywords = new Set([
      "certifiedpass",
      "jobs",
      "job",
      "attestation",
      "attestations",
      "audit",
      "audits",
      "verify",
      "verification",
      "certificate",
      "c",
      "credentials",
      "dashboard",
      "profile",
      "home",
    ]);

    // 3. Check hash path segments (e.g. #/jobs/0xeeacc05a99a2/attestation or #/attestation/PL-SBT-...)
    if (parsedUrl.hash) {
      const hashPath = parsedUrl.hash.replace(/^#\/?/, "").split("?")[0] || "";
      const hashSegments = hashPath
        .split("/")
        .filter(Boolean)
        .map((s) => decodeURIComponent(s).trim());

      // First check for explicit PL-SBT or PL-AUD or cp-
      for (const seg of hashSegments) {
        const upper = seg.toUpperCase();
        if (upper.startsWith("PL-SBT-") || upper.startsWith("PL-AUD-") || upper.startsWith("CP-")) {
          return seg;
        }
      }

      // Then check for hex/id segments (e.g. 0xeeacc05a99a2)
      for (let i = hashSegments.length - 1; i >= 0; i--) {
        const seg = hashSegments[i]!;
        const lower = seg.toLowerCase();
        if (!ignoredKeywords.has(lower) && (seg.startsWith("0x") || seg.length >= 6)) {
          return seg;
        }
      }
    }

    // 4. Check pathname segments (e.g. /c/PL-SBT-JOB-101 or /jobs/0xeeacc05a99a2)
    const pathSegments = parsedUrl.pathname
      .split("/")
      .filter(Boolean)
      .map((s) => decodeURIComponent(s).trim());

    // Check for explicit prefixes
    for (const seg of pathSegments) {
      const upper = seg.toUpperCase();
      if (upper.startsWith("PL-SBT-") || upper.startsWith("PL-AUD-") || upper.startsWith("CP-")) {
        return seg;
      }
    }

    // Check other non-keyword segments
    for (let i = pathSegments.length - 1; i >= 0; i--) {
      const seg = pathSegments[i]!;
      const lower = seg.toLowerCase();
      if (!ignoredKeywords.has(lower) && (seg.startsWith("0x") || seg.length >= 6)) {
        return seg;
      }
    }
  } catch {
    // If URL parsing throws, proceed to regex extractors
  }

  // Regex fallback for certId query param
  const matchParam = cleaned.match(/[?&](?:certId|cert_id|cert|jobId|id)=([^&#\s]+)/i);
  if (matchParam && matchParam[1]) {
    return decodeURIComponent(matchParam[1]).trim();
  }

  // Regex fallback for PL-SBT or PL-AUD in the string
  const matchPlId = cleaned.match(/(PL-SBT-[A-Za-z0-9_-]+|PL-AUD-[A-Za-z0-9_-]+|CP-[A-Za-z0-9_-]+)/i);
  if (matchPlId && matchPlId[1]) {
    return matchPlId[1].trim();
  }

  // Regex fallback for 0x hex address/hash
  const matchHex = cleaned.match(/(0x[a-fA-F0-9]{8,64})/);
  if (matchHex && matchHex[1]) {
    return matchHex[1].trim();
  }

  return cleaned;
}

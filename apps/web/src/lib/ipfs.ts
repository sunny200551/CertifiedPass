/**
 * CertifiedPass — Pure Decentralized IPFS & Web Crypto Engine
 * Deterministic JSON Canonicalization & SHA-256 Hashing directly in browser.
 */

/**
 * Deterministically sort and stringify an object (Canonical JSON RFC 8785)
 */
export function canonicalizeJSON(obj: any): string {
  if (obj === null || typeof obj !== "object") {
    return JSON.stringify(obj);
  }
  if (Array.isArray(obj)) {
    return "[" + obj.map((item) => canonicalizeJSON(item)).join(",") + "]";
  }
  const keys = Object.keys(obj).sort();
  const pairs = keys.map((key) => `${JSON.stringify(key)}:${canonicalizeJSON(obj[key])}`);
  return "{" + pairs.join(",") + "}";
}

/**
 * Compute SHA-256 digest in hex format using standard Web Crypto API
 */
export async function computeSHA256(data: string | ArrayBuffer): Promise<string> {
  const buffer =
    typeof data === "string" ? new TextEncoder().encode(data) : new Uint8Array(data);
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hex;
}

/**
 * Resolve IPFS URIs (ipfs://Qm...) via multiple public decentralized gateways
 */
export function resolveIPFS(uri: string): string {
  if (!uri) return "";
  if (uri.startsWith("ipfs://")) {
    const cid = uri.replace("ipfs://", "");
    return `https://ipfs.io/ipfs/${cid}`;
  }
  return uri;
}

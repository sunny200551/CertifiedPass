/**
 * CertifiedPass — Credential Hashing Utilities
 *
 * This module is the SINGLE SOURCE OF TRUTH for credential canonicalization
 * and hashing. It is used by:
 *   - The API server (when generating the credential hash before issuance)
 *   - The verification service (when recalculating hash to compare with on-chain)
 *   - The frontend verification widget (client-side hash recalculation)
 *
 * CRITICAL RULES:
 * 1. Never hash unordered JSON — always canonicalize first.
 * 2. Field order in CANONICAL_FIELD_ORDER is immutable once deployed.
 *    Adding new fields must go AFTER existing ones (append-only).
 * 3. Both API and frontend must use this same function — never duplicate it.
 * 4. If you change this function, ALL existing credential hashes become invalid.
 *    Treat it like a migration.
 */

import type { CanonicalCredential } from "@certifiedpass/types";

// ---------------------------------------------------------------------------
// Canonical field order
// This order is FIXED and append-only. Never reorder existing fields.
// ---------------------------------------------------------------------------
const CANONICAL_FIELD_ORDER: (keyof CanonicalCredential)[] = [
  "id",
  "credentialType",
  "issuerAddress",
  "holderAddress",
  "issuedAt",
  "metadata",
  "schemaVersion",
];

/**
 * Recursively sort an object's keys alphabetically.
 * This ensures metadata fields are always serialized in the same order
 * regardless of how they were constructed.
 */
function sortObjectKeys(obj: unknown): unknown {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    // Arrays: sort each element, but DO NOT sort the array itself
    // (order is semantically significant for arrays like skills, refs)
    return obj.map(sortObjectKeys);
  }

  const sorted: Record<string, unknown> = {};
  const keys = Object.keys(obj as Record<string, unknown>).sort();
  for (const key of keys) {
    sorted[key] = sortObjectKeys((obj as Record<string, unknown>)[key]);
  }
  return sorted;
}

/**
 * Serialize a credential into its canonical JSON representation.
 *
 * Requirements:
 * - Fixed field order matching CANONICAL_FIELD_ORDER
 * - Metadata keys sorted alphabetically at all nesting levels
 * - No extra whitespace (JSON.stringify default without indent)
 * - UTF-8 encoding
 *
 * @throws Error if any required field is missing
 */
export function canonicalizeCredential(credential: CanonicalCredential): string {
  const canonical: Record<string, unknown> = {};

  for (const field of CANONICAL_FIELD_ORDER) {
    const value = credential[field];
    if (value === undefined) {
      throw new Error(
        `canonicalizeCredential: missing required field "${field}" on credential ${credential.id}`
      );
    }
    // Sort metadata keys; leave scalar fields as-is
    canonical[field] = field === "metadata" ? sortObjectKeys(value) : value;
  }

  return JSON.stringify(canonical);
}

// ---------------------------------------------------------------------------
// Standard SHA-256 Implementation (Typed, Zero Dependency, Node & Browser Compatible)
// ---------------------------------------------------------------------------

const K = new Uint32Array([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
]);

function rotr(n: number, x: number): number {
  return (x >>> n) | (x << (32 - n));
}

function sha256Bytes(data: Uint8Array): string {
  const dataLen = data.length;
  const bitLen = dataLen * 8;
  
  // Total length must be a multiple of 64 bytes
  const totalLen = Math.ceil((dataLen + 9) / 64) * 64;
  const padded = new Uint8Array(totalLen);
  padded.set(data, 0);
  padded[dataLen] = 0x80;
  
  // Set 64-bit big endian length
  const view = new DataView(padded.buffer);
  view.setUint32(totalLen - 4, bitLen >>> 0, false);
  view.setUint32(totalLen - 8, Math.floor(bitLen / 0x100000000), false);

  let h0 = 0x6a09e667;
  let h1 = 0xbb67ae85;
  let h2 = 0x3c6ef372;
  let h3 = 0xa54ff53a;
  let h4 = 0x510e527f;
  let h5 = 0x9b05688c;
  let h6 = 0x1f83d9ab;
  let h7 = 0x5be0cd19;

  const w = new Uint32Array(64);

  for (let offset = 0; offset < totalLen; offset += 64) {
    for (let i = 0; i < 16; i++) {
      w[i] = view.getUint32(offset + i * 4, false);
    }
    for (let i = 16; i < 64; i++) {
      const w15 = w[i - 15]!;
      const s0 = rotr(7, w15) ^ rotr(18, w15) ^ (w15 >>> 3);
      const w2 = w[i - 2]!;
      const s1 = rotr(17, w2) ^ rotr(19, w2) ^ (w2 >>> 10);
      w[i] = (w[i - 16]! + s0 + w[i - 7]! + s1) >>> 0;
    }

    let a = h0;
    let b = h1;
    let c = h2;
    let d = h3;
    let e = h4;
    let f = h5;
    let g = h6;
    let h = h7;

    for (let i = 0; i < 64; i++) {
      const S1 = rotr(6, e) ^ rotr(11, e) ^ rotr(25, e);
      const ch = (e & f) ^ ((~e) & g);
      const temp1 = (h + S1 + ch + K[i]! + w[i]!) >>> 0;
      const S0 = rotr(2, a) ^ rotr(13, a) ^ rotr(22, a);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (S0 + maj) >>> 0;

      h = g;
      g = f;
      f = e;
      e = (d + temp1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) >>> 0;
    }

    h0 = (h0 + a) >>> 0;
    h1 = (h1 + b) >>> 0;
    h2 = (h2 + c) >>> 0;
    h3 = (h3 + d) >>> 0;
    h4 = (h4 + e) >>> 0;
    h5 = (h5 + f) >>> 0;
    h6 = (h6 + g) >>> 0;
    h7 = (h7 + h) >>> 0;
  }

  const out = [h0, h1, h2, h3, h4, h5, h6, h7];
  return out.map((x) => x.toString(16).padStart(8, "0")).join("");
}

/**
 * Compute the SHA-256 hash of a canonical credential string.
 *
 * @param canonicalJson - Output of canonicalizeCredential()
 * @returns Lowercase hex-encoded SHA-256 digest (64 chars)
 */
export function hashCanonicalString(canonicalJson: string): string {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(canonicalJson);
  return sha256Bytes(bytes);
}

/**
 * Convenience function: canonicalize + hash in one call.
 * Returns the hex digest that goes on-chain.
 *
 * @param credential - The credential to hash
 * @returns Lowercase hex SHA-256 digest
 */
export function hashCredential(credential: CanonicalCredential): string {
  const canonical = canonicalizeCredential(credential);
  return hashCanonicalString(canonical);
}

/**
 * Convert a hex hash string to bytes32 format for Solidity.
 * Prepends "0x" if not already present.
 *
 * @param hexHash - 64-char hex string
 * @returns "0x" prefixed 66-char hex string for bytes32
 */
export function toBytes32(hexHash: string): string {
  const clean = hexHash.startsWith("0x") ? hexHash.slice(2) : hexHash;
  if (clean.length !== 64) {
    throw new Error(
      `toBytes32: expected 64-char hex string, got ${clean.length} chars`
    );
  }
  return `0x${clean}`;
}

/**
 * Compare two hashes in constant time to prevent timing attacks.
 * Both inputs should be lowercase hex strings.
 *
 * @param a - First hash (e.g. calculated from metadata)
 * @param b - Second hash (e.g. retrieved from on-chain)
 * @returns true if hashes are identical
 */
export function compareHashes(a: string, b: string): boolean {
  const normalizeA = a.toLowerCase().replace(/^0x/, "");
  const normalizeB = b.toLowerCase().replace(/^0x/, "");

  if (normalizeA.length !== normalizeB.length) return false;

  // XOR-based constant time comparison
  let result = 0;
  for (let i = 0; i < normalizeA.length; i++) {
    result |=
      normalizeA.charCodeAt(i) ^ normalizeB.charCodeAt(i);
  }
  return result === 0;
}

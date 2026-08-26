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
import { createHash } from "crypto";

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
 * Produce the canonical JSON string for a credential.
 *
 * The canonical representation:
 * - Uses the fixed CANONICAL_FIELD_ORDER for top-level fields
 * - Recursively sorts metadata keys alphabetically
 * - No whitespace (compact)
 * - UTF-8 encoding
 *
 * This string is what gets hashed. It must be reproducible byte-for-byte
 * across different environments and programming languages.
 *
 * @param credential - The credential to canonicalize
 * @returns The canonical JSON string
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

/**
 * Compute the SHA-256 hash of a canonical credential string.
 *
 * @param canonicalJson - Output of canonicalizeCredential()
 * @returns Lowercase hex-encoded SHA-256 digest (64 chars)
 */
export function hashCanonicalString(canonicalJson: string): string {
  return createHash("sha256").update(canonicalJson, "utf8").digest("hex");
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

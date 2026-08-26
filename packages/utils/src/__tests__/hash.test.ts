import { describe, it, expect } from "vitest";
import {
  canonicalizeCredential,
  hashCanonicalString,
  hashCredential,
  compareHashes,
  toBytes32,
} from "../hash.js";
import type { CanonicalCredential } from "@certifiedpass/types";

describe("Credential Hashing & Canonicalization", () => {
  const sampleCred: CanonicalCredential = {
    id: "550e8400-e29b-41d4-a716-446655440000",
    credentialType: "hackathon",
    issuerAddress: "0x51E2a819bA4F5b6c891e4a3F12c6a4F69B88793B",
    holderAddress: "0x71C845137F73612FACb1C1E6e3e1A144e5904F2E",
    issuedAt: "2026-08-20T12:00:00.000Z",
    schemaVersion: 1,
    metadata: {
      credentialType: "hackathon",
      title: "1st Place Winner",
      holderName: "Alex Rivera",
      issuerName: "ETHSF",
      issuedAt: "2026-08-20",
      achievement: "1st Place - Infrastructure Track",
      eventName: "ETHSF 2026",
      skills: ["Solidity", "TypeScript"],
    },
  };

  it("produces deterministic canonical JSON string regardless of metadata key order", () => {
    const credA = {
      ...sampleCred,
      metadata: {
        credentialType: "hackathon" as const,
        title: "1st Place Winner",
        holderName: "Alex Rivera",
        issuerName: "ETHSF",
        issuedAt: "2026-08-20",
        eventName: "ETHSF 2026",
        achievement: "1st Place - Infrastructure Track",
        skills: ["Solidity", "TypeScript"],
      },
    };
    const credB = {
      ...sampleCred,
      metadata: {
        credentialType: "hackathon" as const,
        eventName: "ETHSF 2026",
        holderName: "Alex Rivera",
        issuerName: "ETHSF",
        issuedAt: "2026-08-20",
        achievement: "1st Place - Infrastructure Track",
        title: "1st Place Winner",
        skills: ["Solidity", "TypeScript"],
      },
    };

    const canonicalA = canonicalizeCredential(credA);
    const canonicalB = canonicalizeCredential(credB);

    expect(canonicalA).toBe(canonicalB);
  });

  it("hashCredential returns 64-char lowercase hex SHA-256 hash", () => {
    const hash = hashCredential(sampleCred);
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });

  it("compareHashes accurately detects matching hashes in constant time", () => {
    const hash1 = hashCredential(sampleCred);
    const hash2 = hashCredential(sampleCred);
    const fakeHash = "0000000000000000000000000000000000000000000000000000000000000000";

    expect(compareHashes(hash1, hash2)).toBe(true);
    expect(compareHashes(hash1, `0x${hash2}`)).toBe(true);
    expect(compareHashes(hash1, fakeHash)).toBe(false);
  });

  it("toBytes32 formats hash with 0x prefix for Solidity", () => {
    const hash = hashCredential(sampleCred);
    const bytes32Val = toBytes32(hash);

    expect(bytes32Val.startsWith("0x")).toBe(true);
    expect(bytes32Val.length).toBe(66);
  });
});

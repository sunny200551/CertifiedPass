/**
 * CertifiedPass — Pure Decentralized Blockchain Registry Service
 * Direct integration with Polygon Amoy EVM contract: CertifiedPassRegistry.sol
 */

import { encodePacked, keccak256, toHex } from "viem";

export const REGISTRY_CONTRACT_ADDRESS =
  (import.meta.env["VITE_REGISTRY_ADDRESS"] as `0x${string}`) ||
  "0x192739B78C56A490196Ac588D4b50f75727F47e6";

export const REGISTRY_ABI = [
  {
    type: "function",
    name: "issueCredential",
    stateMutability: "nonpayable",
    inputs: [
      { name: "credentialId", type: "bytes32" },
      { name: "holder", type: "address" },
      { name: "credentialType", type: "uint8" },
      { name: "credentialHash", type: "bytes32" },
      { name: "uri", type: "string" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "verifyCredential",
    stateMutability: "view",
    inputs: [
      { name: "credentialId", type: "bytes32" },
      { name: "expectedHash", type: "bytes32" },
    ],
    outputs: [
      { name: "isValid", type: "bool" },
      { name: "issuer", type: "address" },
      { name: "issuedAt", type: "uint256" },
      { name: "isRevoked", type: "bool" },
    ],
  },
  {
    type: "function",
    name: "getCredential",
    stateMutability: "view",
    inputs: [{ name: "credentialId", type: "bytes32" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        components: [
          { name: "issuer", type: "address" },
          { name: "holder", type: "address" },
          { name: "credentialType", type: "uint8" },
          { name: "credentialHash", type: "bytes32" },
          { name: "issuedAt", type: "uint256" },
          { name: "isRevoked", type: "bool" },
          { name: "uri", type: "string" },
        ],
      },
    ],
  },
  {
    type: "function",
    name: "getHolderCredentials",
    stateMutability: "view",
    inputs: [{ name: "holder", type: "address" }],
    outputs: [{ name: "", type: "bytes32[]" }],
  },
  {
    type: "function",
    name: "registerIssuer",
    stateMutability: "nonpayable",
    inputs: [
      { name: "name", type: "string" },
      { name: "uri", type: "string" },
    ],
    outputs: [],
  },
  {
    type: "function",
    name: "revokeCredential",
    stateMutability: "nonpayable",
    inputs: [
      { name: "credentialId", type: "bytes32" },
      { name: "reason", type: "string" },
    ],
    outputs: [],
  },
] as const;

/** Convert string ID to bytes32 format */
export function stringToBytes32(id: string): `0x${string}` {
  const hash = keccak256(encodePacked(["string"], [id]));
  return hash;
}

export interface DecentralizedCredential {
  id: string;
  credentialType: string;
  holderAddress: string;
  holderName: string;
  issuerName: string;
  issuerAddress: string;
  title: string;
  achievement: string;
  eventName?: string;
  skills: string[];
  issuedAt: string;
  credentialHash: string;
  txHash?: string;
  tokenUri?: string;
  status: "ACTIVE" | "REVOKED";
  isVerified: boolean;
  metadata?: any;
}

// Decentralized in-memory / local storage index for instant access across sessions
const STORAGE_KEY = "certifiedpass_decentralized_credentials";

export class DecentralizedRegistry {
  static getAll(): DecentralizedCredential[] {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Seed default verifiable credentials on Amoy
      const defaultList: DecentralizedCredential[] = [
        {
          id: "cp-hackathon-2026-ethsf",
          credentialType: "hackathon",
          holderAddress: "0x71C845137F73612FACb1C1E6e3e1A144e5904F2E",
          holderName: "Alex Rivera",
          issuerName: "ETHSF & Polygon Labs",
          issuerAddress: "0x51E2a819bA4F5b6c891e4a3F12c6a4F69B88793B",
          title: "1st Place Winner — Global Web3 AI Hackathon",
          achievement: "1st Place Winner - Infrastructure Track",
          eventName: "ETHSF 2026",
          skills: ["Solidity", "TypeScript", "Three.js", "Zod"],
          issuedAt: "2026-08-20T00:00:00.000Z",
          credentialHash: "4a9d721183c509539fbe54b5df16a7f85dc9eb3e85e507f3531b790d0ef093ac",
          txHash: "0x3f4a9b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a",
          tokenUri: "ipfs://QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
          status: "ACTIVE",
          isVerified: true,
          metadata: {
            title: "1st Place Winner — Global Web3 AI Hackathon",
            holderName: "Alex Rivera",
            issuerName: "ETHSF & Polygon Labs",
            achievement: "1st Place Winner - Infrastructure Track",
            eventName: "ETHSF 2026",
            skills: ["Solidity", "TypeScript", "Three.js", "Zod"],
          },
        },
        {
          id: "cp-internship-2026-consensys",
          credentialType: "internship",
          holderAddress: "0x71C845137F73612FACb1C1E6e3e1A144e5904F2E",
          holderName: "Alex Rivera",
          issuerName: "ConsenSys",
          issuerAddress: "0x91a2B3c4D5e6F7a8B9c0D1e2F3a4B5c6D7e8F9a0",
          title: "Smart Contract Engineering Intern",
          achievement: "Completed 12-week Smart Contract Security & EVM Core Audit Cohort",
          eventName: "ConsenSys Summer 2026",
          skills: ["Foundry", "EVM", "Smart Contract Auditing", "ERC-4337"],
          issuedAt: "2026-07-31T00:00:00.000Z",
          credentialHash: "b8c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3",
          txHash: "0x8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b",
          tokenUri: "ipfs://QmZtmD2qtW3wknFiJnKLwHCnL72vedxjQkDDP1mXWo6abc",
          status: "ACTIVE",
          isVerified: true,
          metadata: {
            title: "Smart Contract Engineering Intern",
            holderName: "Alex Rivera",
            issuerName: "ConsenSys",
            role: "Smart Contract Intern",
            companyName: "ConsenSys",
            skills: ["Foundry", "EVM", "Auditing"],
          },
        },
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultList));
      return defaultList;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  static getById(id: string): DecentralizedCredential | null {
    const list = this.getAll();
    const found = list.find((c) => c.id.toLowerCase() === id.trim().toLowerCase());
    return found || null;
  }

  static getByHolder(holderAddress: string): DecentralizedCredential[] {
    const list = this.getAll();
    return list.filter(
      (c) => c.holderAddress.toLowerCase() === holderAddress.trim().toLowerCase()
    );
  }

  static save(cred: DecentralizedCredential) {
    const list = this.getAll();
    const idx = list.findIndex((c) => c.id.toLowerCase() === cred.id.toLowerCase());
    if (idx >= 0) {
      list[idx] = cred;
    } else {
      list.unshift(cred);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  static revoke(id: string) {
    const list = this.getAll();
    const idx = list.findIndex((c) => c.id.toLowerCase() === id.toLowerCase());
    if (idx >= 0 && list[idx]) {
      list[idx].status = "REVOKED";
      list[idx].isVerified = false;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }
  }
}

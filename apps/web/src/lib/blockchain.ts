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
      return [];
    }
    try {
      const parsed = JSON.parse(raw);
      // Clean out any legacy demo records
      if (Array.isArray(parsed)) {
        return parsed.filter(
          (c: any) =>
            c &&
            c.holderName !== "Alex Rivera" &&
            c.id !== "cp-hackathon-2026-ethsf" &&
            c.id !== "cp-internship-2026-consensys"
        );
      }
      return [];
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

  static getByIssuer(issuerAddressOrName?: string): DecentralizedCredential[] {
    const list = this.getAll();
    if (!issuerAddressOrName) return list;
    const clean = issuerAddressOrName.trim().toLowerCase();
    return list.filter(
      (c) =>
        c.issuerAddress.toLowerCase() === clean ||
        c.issuerName.toLowerCase().includes(clean)
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
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("storage"));
        window.dispatchEvent(new CustomEvent("certifiedpass_credentials_updated"));
      }
    } catch (e) {
      console.error("Failed to save to localStorage:", e);
    }
  }

  static revoke(id: string) {
    const list = this.getAll();
    const idx = list.findIndex((c) => c.id.toLowerCase() === id.toLowerCase());
    if (idx >= 0 && list[idx]) {
      list[idx] = {
        ...list[idx],
        status: "REVOKED",
        isVerified: false,
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("storage"));
          window.dispatchEvent(new CustomEvent("certifiedpass_credentials_updated"));
        }
      } catch (e) {
        console.error("Failed to revoke in localStorage:", e);
      }
    }
  }

  static updateStatus(id: string, status: "ACTIVE" | "REVOKED") {
    const list = this.getAll();
    const idx = list.findIndex((c) => c.id.toLowerCase() === id.toLowerCase());
    if (idx >= 0 && list[idx]) {
      list[idx] = {
        ...list[idx],
        status,
        isVerified: status === "ACTIVE",
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("storage"));
          window.dispatchEvent(new CustomEvent("certifiedpass_credentials_updated"));
        }
      } catch (e) {
        console.error("Failed to update status in localStorage:", e);
      }
    }
  }
}


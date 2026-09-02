/**
 * PolyLance Sovereign Ledger — Type Definitions
 * Dedicated PostgreSQL Audit & SBT Schema Integration
 */

export type PolyLanceRecordType = "SOULBOUND_ATTESTATION" | "PROTOCOL_TRUST_AUDIT";

export type PolyLanceRecordStatus = "VERIFIED" | "REVOKED" | "DISPUTED";

export interface CertifiedSBTRecord {
  id: string; // e.g. "PL-SBT-JOB-101-0x42F8"
  jobId: string;
  jobTitle: string;
  category: string;
  settledAmountUsdc: string | number;
  freelancerAddress: string;
  freelancerName: string;
  freelancerGithub?: string | null;
  clientAddress: string;
  clientName: string;
  sbtTokenId: string;
  ipfsCid: string;
  oracleSignature: string;
  contractAddress: string;
  networkChainId: number; // default 137
  status: PolyLanceRecordStatus | string;
  metadata?: Record<string, any> | null;
  completedAt: string | Date;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface CertifiedAuditRecord {
  id: string; // e.g. "PL-AUD-0x42F8"
  targetAddress: string;
  displayName: string;
  roleType: "DEVELOPER" | "CLIENT" | string;
  trustIndexScore: string; // e.g. "10.0" or "890"
  lifetimeVolumeUsdc: string | number;
  slaSuccessRate: string; // e.g. "100%"
  completedMilestonesCount: number;
  ipfsCid: string;
  oracleSignature: string;
  status: "VERIFIED" | "REVOKED" | string;
  auditData?: Record<string, any> | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface CertifiedVerificationLog {
  id?: number;
  certId: string;
  verifierPlatform: string;
  verifiedAt?: string | Date;
  clientIpHash?: string | null;
}

export interface PolyLanceVerificationResult {
  verified: boolean;
  status: "VERIFIED" | "REVOKED" | "DISPUTED" | "UNVERIFIED";
  displayStatus: "VERIFIED & AUTHENTIC" | "REVOKED / INVALIDATED" | "DISPUTED" | "UNVERIFIED / RECORD NOT FOUND";
  recordType?: PolyLanceRecordType;
  certId: string;
  reason?: string;
  message?: string;
  verifiedAt: string;
  
  // Specific details for SBT / Audit
  details?: {
    typeTitle: string; // "Soulbound Milestone Attestation" or "Protocol Trust Audit"
    title: string;
    role?: string;
    category?: string;
    settledAmountUsdc?: string;
    lifetimeVolumeUsdc?: string;
    trustIndexScore?: string;
    slaSuccessRate?: string;
    completedMilestonesCount?: number;
    
    // Talent / Recipient
    recipient: {
      name: string;
      address: string;
      github?: string | null;
    };
    
    // Sponsor / Client
    sponsor?: {
      name: string;
      address: string;
    };

    freelancer?: string;
    freelancerName?: string;
    freelancerAddress?: string;
    freelancerGithub?: string | null;
    client?: string;
    clientName?: string;
    clientAddress?: string;
    
    // Cryptographic & Blockchain proofs
    contractAddress?: string;
    networkChainId?: number;
    networkName?: string;
    oracleSignature?: string;
    ipfsCid?: string;
    sbtTokenId?: string;
    timestamp?: string;
    metadata?: Record<string, any> | null;
    auditData?: Record<string, any> | null;
  };
}

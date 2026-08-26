/**
 * CertifiedPass — Issuer Type Definitions
 */

// ---------------------------------------------------------------------------
// Issuer verification states
// ---------------------------------------------------------------------------

export const ISSUER_VERIFICATION_STATUSES = [
  "pending",
  "verified",
  "rejected",
] as const;

export type IssuerVerificationStatus =
  (typeof ISSUER_VERIFICATION_STATUSES)[number];

// ---------------------------------------------------------------------------
// Issuer profile
// ---------------------------------------------------------------------------

export interface IssuerProfile {
  id: string;
  /** Organization display name */
  name: string;
  /** Organization description / mission */
  description?: string;
  /** Public website URL */
  website?: string;
  /** Logo image URL */
  logoUrl?: string;
  /** EVM wallet address — used for contract-level authorization */
  walletAddress: string;
  /** Platform verification status */
  verificationStatus: IssuerVerificationStatus;
  /** Social links (optional) */
  socialLinks?: IssuerSocialLinks;
  /** ISO 8601 timestamp of when the issuer registered */
  createdAt: string;
  /** ISO 8601 timestamp of last profile update */
  updatedAt: string;
  /** Number of credentials issued (denormalized for display) */
  totalCredentialsIssued?: number;
  /** Number of active credentials */
  activeCredentials?: number;
}

export interface IssuerSocialLinks {
  twitter?: string;
  linkedin?: string;
  github?: string;
  discord?: string;
}

// ---------------------------------------------------------------------------
// Issuer event / program
// ---------------------------------------------------------------------------

export const EVENT_TYPES = [
  "hackathon",
  "internship_program",
  "open_source_program",
  "conference",
  "workshop",
  "competition",
  "other",
] as const;

export type EventType = (typeof EVENT_TYPES)[number];

export interface IssuerEvent {
  id: string;
  issuerId: string;
  /** Event display name */
  name: string;
  /** Matches the credential type this event will produce */
  eventType: EventType;
  description?: string;
  /** ISO 8601 event date */
  date?: string;
  location?: string;
  /** Is the event still accepting registrations / issues */
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  /** Total credentials created for this event */
  totalCredentials?: number;
}

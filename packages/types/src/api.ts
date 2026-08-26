/**
 * CertifiedPass — API Request/Response Type Definitions
 *
 * All request bodies, query params, and response shapes for the REST API.
 * Used by both the Express backend (for validation) and the React frontend
 * (for type-safe API calls).
 */

import type {
  CanonicalCredential,
  CredentialDraft,
  CredentialMetadata,
  CredentialStatus,
  CredentialType,
  VerificationResult,
} from "./credential.js";
import type {
  IssuerEvent,
  IssuerProfile,
  IssuerVerificationStatus,
} from "./issuer.js";
import type { AuthNonce, AuthToken, BlockchainVerificationProof } from "./blockchain.js";

// ---------------------------------------------------------------------------
// Generic API response envelope
// ---------------------------------------------------------------------------

export interface ApiResponse<T> {
  success: true;
  data: T;
  meta?: PaginationMeta;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginationQuery {
  page?: number;
  pageSize?: number;
}

// ---------------------------------------------------------------------------
// Auth endpoints
// ---------------------------------------------------------------------------

// POST /auth/nonce
export interface GetNonceRequest {
  walletAddress: string;
}
export type GetNonceResponse = ApiResponse<AuthNonce>;

// POST /auth/verify
export interface VerifySignatureRequest {
  walletAddress: string;
  signature: string;
  nonce: string;
}
export type VerifySignatureResponse = ApiResponse<AuthToken>;

// ---------------------------------------------------------------------------
// Issuer endpoints
// ---------------------------------------------------------------------------

// POST /issuers
export interface CreateIssuerRequest {
  name: string;
  description?: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    discord?: string;
  };
}
export type CreateIssuerResponse = ApiResponse<IssuerProfile>;

// GET /issuers/:id
export type GetIssuerResponse = ApiResponse<IssuerProfile>;

// POST /issuers/:id/verification (admin only)
export interface UpdateIssuerVerificationRequest {
  status: IssuerVerificationStatus;
  rejectionReason?: string;
}
export type UpdateIssuerVerificationResponse = ApiResponse<IssuerProfile>;

// ---------------------------------------------------------------------------
// Event endpoints
// ---------------------------------------------------------------------------

// POST /events
export interface CreateEventRequest {
  name: string;
  eventType: string;
  description?: string;
  date?: string;
  location?: string;
}
export type CreateEventResponse = ApiResponse<IssuerEvent>;

// GET /events/:id
export type GetEventResponse = ApiResponse<
  IssuerEvent & { credentials: CredentialSummary[] }
>;

// ---------------------------------------------------------------------------
// Credential endpoints
// ---------------------------------------------------------------------------

export interface CredentialSummary {
  id: string;
  credentialType: CredentialType;
  status: CredentialStatus;
  holderAddress: string;
  issuedAt: string;
  txHash?: string;
  title: string;
  issuerName: string;
}

export interface CredentialDetail extends CredentialSummary {
  metadata: CredentialMetadata;
  credentialHash: string;
  metadataURI: string;
  chainId: number;
  blockchainProof?: BlockchainVerificationProof;
}

// POST /credentials
export interface CreateCredentialRequest {
  eventId?: string;
  holderAddress: string;
  credentialType: CredentialType;
  metadata: CredentialMetadata;
}
export type CreateCredentialResponse = ApiResponse<CredentialDetail>;

// GET /credentials/:id
export type GetCredentialResponse = ApiResponse<CredentialDetail>;

// GET /credentials/:id/verify
export type VerifyCredentialResponse = ApiResponse<
  VerificationResult & { blockchainProof?: BlockchainVerificationProof }
>;

// POST /credentials/:id/revoke
export interface RevokeCredentialRequest {
  reason: string;
}
export type RevokeCredentialResponse = ApiResponse<{
  credentialId: string;
  revokedAt: string;
  txHash: string;
}>;

// GET /credentials — list with filters
export interface ListCredentialsQuery extends PaginationQuery {
  status?: CredentialStatus;
  credentialType?: CredentialType;
  holderAddress?: string;
  eventId?: string;
}
export type ListCredentialsResponse = ApiResponse<CredentialSummary[]>;

// ---------------------------------------------------------------------------
// AI endpoints
// ---------------------------------------------------------------------------

// POST /ai/extract
export interface AIExtractRequest {
  /** File content as base64 string */
  fileBase64: string;
  /** MIME type of the uploaded file */
  mimeType: string;
  /** Hint for the AI about the expected credential type */
  credentialTypeHint?: CredentialType;
}
export type AIExtractResponse = ApiResponse<{
  drafts: CredentialDraft[];
  extractionId: string;
  tokensUsed: number;
}>;

// POST /ai/generate-credentials
export interface AIGenerateCredentialsRequest {
  /** Raw CSV/XLSX rows as parsed JSON */
  rows: Record<string, string>[];
  credentialType: CredentialType;
  eventId?: string;
  /** Common fields to apply to all generated credentials */
  commonFields?: Partial<CredentialMetadata>;
}
export type AIGenerateCredentialsResponse = ApiResponse<{
  drafts: CredentialDraft[];
  totalProcessed: number;
  totalFailed: number;
  extractionId: string;
}>;

// POST /ai/classify
export interface AIClassifyRequest {
  text: string;
}
export type AIClassifyResponse = ApiResponse<{
  credentialType: CredentialType;
  confidence: number;
  reasoning: string;
}>;

// ---------------------------------------------------------------------------
// Profile endpoint
// ---------------------------------------------------------------------------

export interface PublicProfile {
  username: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  walletAddress: string;
  credentials: CredentialDetail[];
  totalCredentials: number;
  joinedAt: string;
}

// GET /profiles/:username
export type GetProfileResponse = ApiResponse<PublicProfile>;

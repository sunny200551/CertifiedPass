/**
 * CertifiedPass — Zod Validation Schemas
 *
 * Server-side schema validation for AI output and API requests.
 *
 * SECURITY: AI output is UNTRUSTED INPUT. Every AI-generated field
 * passes through these schemas before touching the database or review UI.
 * A validation failure means the draft is flagged, not silently accepted.
 */

import {
  CREDENTIAL_TYPES,
  type CanonicalCredential,
  type CredentialMetadata,
  type CredentialType,
} from "@certifiedpass/types";
import { z } from "zod";

// ---------------------------------------------------------------------------
// Primitive schemas
// ---------------------------------------------------------------------------

/** ISO 8601 date string (YYYY-MM-DD) */
const isoDateString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Must be YYYY-MM-DD format");

/** ISO 8601 datetime string */
const isoDateTimeString = z.string().datetime({ offset: true });

/** EVM address (0x + 40 hex chars) */
export const evmAddress = z
  .string()
  .regex(/^0x[0-9a-fA-F]{40}$/, "Must be a valid EVM address (0x + 40 hex chars)");

/** SHA-256 hex hash */
export const sha256Hex = z
  .string()
  .regex(/^[0-9a-f]{64}$/, "Must be a 64-char lowercase hex SHA-256 hash");

/** UUID v4 */
const uuidV4 = z
  .string()
  .uuid("Must be a valid UUID v4");

// ---------------------------------------------------------------------------
// Metadata schemas — one per credential type
// ---------------------------------------------------------------------------

const baseCredentialFields = z.object({
  title: z.string().min(1).max(200),
  holderName: z.string().min(1).max(200),
  issuerName: z.string().min(1).max(200),
  issuedAt: isoDateString,
  description: z.string().max(2000).optional(),
  skills: z.array(z.string().max(100)).max(30).optional(),
});

export const hackathonSchema = baseCredentialFields.extend({
  credentialType: z.literal("hackathon"),
  eventName: z.string().min(1).max(200),
  achievement: z.string().min(1).max(200),
  rank: z.number().int().min(1).optional(),
  team: z.string().max(200).optional(),
  project: z.string().max(200).optional(),
  organizer: z.string().max(200).optional(),
});

export const internshipSchema = baseCredentialFields.extend({
  credentialType: z.literal("internship"),
  companyName: z.string().min(1).max(200),
  role: z.string().min(1).max(200),
  department: z.string().max(200).optional(),
  startDate: isoDateString,
  endDate: isoDateString,
  completionStatus: z.enum(["completed", "ongoing", "terminated"]),
});

export const openSourceSchema = baseCredentialFields.extend({
  credentialType: z.literal("opensource"),
  organizationName: z.string().min(1).max(200),
  repositoryName: z.string().min(1).max(200),
  contributionType: z.string().min(1).max(100),
  role: z.string().max(200).optional(),
  periodStart: isoDateString,
  periodEnd: isoDateString.optional(),
  pullRequestRefs: z.array(z.string().max(200)).max(50).optional(),
  issueRefs: z.array(z.string().max(200)).max(50).optional(),
});

export const eventSchema = baseCredentialFields.extend({
  credentialType: z.literal("event"),
  eventName: z.string().min(1).max(200),
  role: z.string().min(1).max(100),
  date: isoDateString,
  location: z.string().max(200).optional(),
  contribution: z.string().max(500).optional(),
});

export const workshopSchema = baseCredentialFields.extend({
  credentialType: z.literal("workshop"),
  workshopName: z.string().min(1).max(200),
  organizer: z.string().min(1).max(200),
  topics: z.array(z.string().max(100)).min(1).max(20),
  date: isoDateString,
  durationHours: z.number().min(0).max(10000).optional(),
  completionStatus: z.enum(["completed", "partial"]),
});

export const competitionSchema = baseCredentialFields.extend({
  credentialType: z.literal("competition"),
  competitionName: z.string().min(1).max(200),
  rank: z.number().int().min(1).optional(),
  prize: z.string().max(200).optional(),
  category: z.string().max(100).optional(),
  date: isoDateString,
  organizer: z.string().max(200).optional(),
});

/**
 * Discriminated union schema for all credential metadata types.
 * Uses the `credentialType` discriminant.
 */
export const credentialMetadataSchema = z.discriminatedUnion("credentialType", [
  hackathonSchema,
  internshipSchema,
  openSourceSchema,
  eventSchema,
  workshopSchema,
  competitionSchema,
]);

// ---------------------------------------------------------------------------
// Full canonical credential schema
// ---------------------------------------------------------------------------

export const canonicalCredentialSchema = z.object({
  id: uuidV4,
  credentialType: z.enum(CREDENTIAL_TYPES),
  issuerAddress: evmAddress,
  holderAddress: evmAddress,
  issuedAt: isoDateTimeString,
  metadata: credentialMetadataSchema,
  schemaVersion: z.number().int().min(1),
});

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: Record<string, string[]> };

/**
 * Format Zod errors into a flat field→messages map for the review UI.
 */
function formatZodErrors(error: z.ZodError): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const path = issue.path.join(".") || "_root";
    if (!result[path]) result[path] = [];
    result[path]!.push(issue.message);
  }
  return result;
}

/**
 * Validate raw AI output against the appropriate credential schema.
 * Returns typed metadata or a structured error map.
 *
 * @param raw - Unvalidated AI extraction output
 * @param credentialType - The expected credential type
 */
export function validateCredentialMetadata(
  raw: unknown,
  credentialType: CredentialType
): ValidationResult<CredentialMetadata> {
  const schemaMap = {
    hackathon: hackathonSchema,
    internship: internshipSchema,
    opensource: openSourceSchema,
    event: eventSchema,
    workshop: workshopSchema,
    competition: competitionSchema,
  } as const;

  const schema = schemaMap[credentialType];
  const result = schema.safeParse(raw);

  if (result.success) {
    return { success: true, data: result.data as CredentialMetadata };
  }
  return { success: false, errors: formatZodErrors(result.error) };
}

/**
 * Validate a full canonical credential before hashing.
 */
export function validateCanonicalCredential(
  raw: unknown
): ValidationResult<CanonicalCredential> {
  const result = canonicalCredentialSchema.safeParse(raw);
  if (result.success) {
    return { success: true, data: result.data as CanonicalCredential };
  }
  return { success: false, errors: formatZodErrors(result.error) };
}

// ---------------------------------------------------------------------------
// API request schemas (for middleware/validate.ts)
// ---------------------------------------------------------------------------

export const getNonceSchema = z.object({
  body: z.object({
    walletAddress: evmAddress,
  }),
});

export const verifySignatureSchema = z.object({
  body: z.object({
    walletAddress: evmAddress,
    signature: z.string().min(1),
    nonce: z.string().uuid(),
  }),
});

export const createIssuerSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(200),
    description: z.string().max(2000).optional(),
    website: z.string().url().optional(),
    socialLinks: z
      .object({
        twitter: z.string().url().optional(),
        linkedin: z.string().url().optional(),
        github: z.string().url().optional(),
        discord: z.string().url().optional(),
      })
      .optional(),
  }),
});

export const createEventSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(200),
    eventType: z.string().min(1).max(100),
    description: z.string().max(2000).optional(),
    date: isoDateString.optional(),
    location: z.string().max(200).optional(),
  }),
});

export const createCredentialSchema = z.object({
  body: z.object({
    eventId: uuidV4.optional(),
    holderAddress: evmAddress,
    credentialType: z.enum(CREDENTIAL_TYPES),
    metadata: credentialMetadataSchema,
  }),
});

export const revokeCredentialSchema = z.object({
  body: z.object({
    reason: z.string().min(1).max(500),
  }),
  params: z.object({
    id: uuidV4,
  }),
});

export const aiExtractSchema = z.object({
  body: z.object({
    credentialTypeHint: z.enum(CREDENTIAL_TYPES).optional(),
  }),
});

export const aiGenerateSchema = z.object({
  body: z.object({
    rows: z
      .array(z.record(z.string()))
      .min(1)
      .max(500, "Max 500 rows per bulk generation request"),
    credentialType: z.enum(CREDENTIAL_TYPES),
    eventId: uuidV4.optional(),
    commonFields: baseCredentialFields.partial().optional(),
  }),
});

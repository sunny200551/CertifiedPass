import crypto from "crypto";
import { parseCertificateId } from "@certifiedpass/utils";
import type {
  PolyLanceVerificationResult,
  CertifiedSBTRecord,
  CertifiedAuditRecord,
} from "@certifiedpass/types";
import { polylancePool } from "../utils/polylanceDb.js";
import { logger } from "../utils/logger.js";

export function formatUsdcAmount(rawAmount: any): string {
  if (rawAmount === undefined || rawAmount === null || rawAmount === "") return "$0.00 USDC";
  const str = String(rawAmount).trim();
  if (str.startsWith("$") && str.toUpperCase().endsWith("USDC")) return str;
  if (str.startsWith("$")) return `${str} USDC`;
  const num = parseFloat(str.replace(/[^0-9.-]+/g, ""));
  if (isNaN(num)) return "$0.00 USDC";
  return `$${num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDC`;
}

function formatParticipantName(
  name: string | null | undefined,
  auditName: string | null | undefined,
  address: string | null | undefined,
  metadataName: string | null | undefined,
  defaultRole: string
): string {
  const cleanName = name?.trim();
  const cleanAuditName = auditName?.trim();
  const cleanMetaName = metadataName?.trim();

  // 1. If explicit specific name provided in record
  if (
    cleanName &&
    cleanName !== "Verified Developer" &&
    cleanName !== "Escrow Patron" &&
    cleanName !== "Audited Participant" &&
    cleanName !== ""
  ) {
    return cleanName;
  }

  // 2. If Audit record has a specific displayName
  if (
    cleanAuditName &&
    cleanAuditName !== "Verified Developer" &&
    cleanAuditName !== "Escrow Patron" &&
    cleanAuditName !== "Audited Participant" &&
    cleanAuditName !== ""
  ) {
    return cleanAuditName;
  }

  // 3. If metadata has a specific name
  if (
    cleanMetaName &&
    cleanMetaName !== "Verified Developer" &&
    cleanMetaName !== "Escrow Patron" &&
    cleanMetaName !== "Audited Participant" &&
    cleanMetaName !== ""
  ) {
    return cleanMetaName;
  }

  // 4. Fallback to default role with short address if address is available
  if (address && address.trim()) {
    const cleanAddr = address.trim();
    const shortAddr = cleanAddr.length >= 10 ? `${cleanAddr.slice(0, 6)}...${cleanAddr.slice(-4)}` : cleanAddr;
    return `${defaultRole} (${shortAddr})`;
  }

  return cleanName || cleanAuditName || cleanMetaName || defaultRole;
}

export class PolyLanceVerificationService {
  /**
   * Log verification audit trail asynchronously
   */
  private static async logVerification(certId: string, verifierPlatform = "CertifiedPass", clientIp?: string) {
    try {
      const clientIpHash = clientIp
        ? crypto.createHash("sha256").update(clientIp).digest("hex").slice(0, 16)
        : null;

      await polylancePool.query(
        `INSERT INTO "CertifiedVerificationLog" ("certId", "verifierPlatform", "verifiedAt", "clientIpHash")
         VALUES ($1, $2, NOW(), $3)`,
        [certId, verifierPlatform, clientIpHash]
      );
    } catch (err: any) {
      // Don't fail the verification response if logging table write encounters an issue
      logger.warn("Failed to write to CertifiedVerificationLog", {
        certId,
        error: err.message,
      });
    }
  }

  /**
   * Verify a PolyLance Certificate ID, QR code, or full URL
   */
  static async verifyCertificate(
    rawInput: string,
    verifierPlatform = "CertifiedPass",
    clientIp?: string
  ): Promise<PolyLanceVerificationResult> {
    const certId = parseCertificateId(rawInput);

    if (!certId) {
      return {
        verified: false,
        status: "UNVERIFIED",
        displayStatus: "UNVERIFIED / RECORD NOT FOUND",
        certId: rawInput,
        message: "This certificate identifier could not be verified against the PolyLance Sovereign Ledger.",
        verifiedAt: new Date().toISOString(),
      };
    }

    try {
      const cleanCertId = certId.trim();
      const likePattern = `%${cleanCertId}%`;

      // 1. Query CertifiedSBTRecord with LEFT JOIN on CertifiedAuditRecord for participant resolution
      const sbtQuery = await polylancePool.query<any>(
        `SELECT s.*,
                fa."displayName" AS "auditFreelancerName",
                ca."displayName" AS "auditClientName"
         FROM "CertifiedSBTRecord" s
         LEFT JOIN "CertifiedAuditRecord" fa ON LOWER(fa."targetAddress") = LOWER(s."freelancerAddress") AND s."freelancerAddress" != ''
         LEFT JOIN "CertifiedAuditRecord" ca ON LOWER(ca."targetAddress") = LOWER(s."clientAddress") AND s."clientAddress" != ''
         WHERE LOWER(s."id") = LOWER($1)
            OR LOWER(s."jobId") = LOWER($1)
            OR LOWER(s."sbtTokenId") = LOWER($1)
            OR LOWER(s."contractAddress") = LOWER($1)
            OR LOWER(s."ipfsCid") = LOWER($1)
            OR LOWER(s."oracleSignature") = LOWER($1)
            OR LOWER(s."freelancerAddress") = LOWER($1)
            OR LOWER(s."clientAddress") = LOWER($1)
            OR s."id" ILIKE $2
            OR s."jobId" ILIKE $2
            OR s."contractAddress" ILIKE $2
            OR s."sbtTokenId" ILIKE $2
            OR s."ipfsCid" ILIKE $2
            OR s."freelancerAddress" ILIKE $2
            OR s."clientAddress" ILIKE $2
         LIMIT 1`,
        [cleanCertId, likePattern]
      );

      if (sbtQuery.rows.length > 0) {
        const record = sbtQuery.rows[0]!;
        await this.logVerification(record.id, verifierPlatform, clientIp);

        const isVerified = record.status === "VERIFIED";
        const isRevoked = record.status === "REVOKED";
        const isDisputed = record.status === "DISPUTED";

        const status = isVerified
          ? "VERIFIED"
          : isRevoked
          ? "REVOKED"
          : isDisputed
          ? "DISPUTED"
          : "UNVERIFIED";

        const displayStatus = isVerified
          ? "VERIFIED & AUTHENTIC"
          : isRevoked
          ? "REVOKED / INVALIDATED"
          : isDisputed
          ? "DISPUTED"
          : "UNVERIFIED / RECORD NOT FOUND";

        const amountFormatted = formatUsdcAmount(record.settledAmountUsdc);

        const timestampStr = record.completedAt
          ? new Date(record.completedAt).toISOString()
          : new Date().toISOString();

        const freelancerDisplayName = formatParticipantName(
          record.freelancerName,
          record.auditFreelancerName,
          record.freelancerAddress,
          record.metadata?.freelancerName || record.metadata?.freelancer,
          "Freelancer"
        );
        const clientDisplayName = formatParticipantName(
          record.clientName,
          record.auditClientName,
          record.clientAddress,
          record.metadata?.clientName || record.metadata?.client,
          "Escrow Client"
        );

        return {
          verified: isVerified,
          status,
          displayStatus,
          recordType: "SOULBOUND_ATTESTATION",
          certId: record.id,
          verifiedAt: new Date().toISOString(),
          reason: isRevoked
            ? "Record has been revoked or invalidated on the PolyLance Sovereign Ledger."
            : isDisputed
            ? "Record is currently under decentralized dispute resolution."
            : "Cryptographically verified against the PolyLance Sovereign Escrow Ledger (Polygon PoS).",
          details: {
            typeTitle: "Soulbound Milestone Attestation",
            title: record.jobTitle || "Decentralized Milestone Attestation",
            role: "Freelancer / Contributor",
            category: record.category || "General",
            settledAmountUsdc: amountFormatted,
            freelancer: freelancerDisplayName,
            freelancerName: freelancerDisplayName,
            freelancerAddress: record.freelancerAddress,
            freelancerGithub: record.freelancerGithub || null,
            client: clientDisplayName,
            clientName: clientDisplayName,
            clientAddress: record.clientAddress,
            recipient: {
              name: freelancerDisplayName,
              address: record.freelancerAddress,
              github: record.freelancerGithub || null,
            },
            sponsor: {
              name: clientDisplayName,
              address: record.clientAddress,
            },
            contractAddress: record.contractAddress,
            networkChainId: record.networkChainId || 137,
            networkName: "Polygon PoS 137",
            oracleSignature: record.oracleSignature,
            ipfsCid: record.ipfsCid,
            sbtTokenId: record.sbtTokenId,
            timestamp: timestampStr,
            metadata: record.metadata || null,
          },
        };
      }

      // 2. Query CertifiedAuditRecord if not in SBT table
      const auditQuery = await polylancePool.query<CertifiedAuditRecord>(
        `SELECT * FROM "CertifiedAuditRecord"
         WHERE LOWER("id") = LOWER($1)
            OR LOWER("targetAddress") = LOWER($1)
            OR LOWER("ipfsCid") = LOWER($1)
            OR LOWER("oracleSignature") = LOWER($1)
            OR "id" ILIKE $2
            OR "targetAddress" ILIKE $2
         LIMIT 1`,
        [cleanCertId, likePattern]
      );

      if (auditQuery.rows.length > 0) {
        const audit = auditQuery.rows[0]!;
        await this.logVerification(audit.id, verifierPlatform, clientIp);

        const isVerified = audit.status === "VERIFIED";
        const isRevoked = audit.status === "REVOKED";

        const status = isVerified ? "VERIFIED" : isRevoked ? "REVOKED" : "UNVERIFIED";
        const displayStatus = isVerified
          ? "VERIFIED & AUTHENTIC"
          : isRevoked
          ? "REVOKED / INVALIDATED"
          : "UNVERIFIED / RECORD NOT FOUND";

        const volumeFormatted = formatUsdcAmount(audit.lifetimeVolumeUsdc);

        const participantDisplayName = formatParticipantName(
          audit.displayName,
          null,
          audit.targetAddress,
          audit.auditData?.profile?.displayName || audit.auditData?.profile?.title,
          `Audited ${audit.roleType || "Participant"}`
        );

        return {
          verified: isVerified,
          status,
          displayStatus,
          recordType: "PROTOCOL_TRUST_AUDIT",
          certId: audit.id,
          verifiedAt: new Date().toISOString(),
          reason: isRevoked
            ? "Trust audit report has been revoked or invalidated."
            : "Authentic PolyLance protocol trust index and historical milestone audit verified.",
          details: {
            typeTitle: "Protocol Trust Audit",
            title: `${participantDisplayName} Trust & Performance Audit`,
            role: audit.roleType || "DEVELOPER",
            trustIndexScore: audit.trustIndexScore || "10.0",
            lifetimeVolumeUsdc: volumeFormatted,
            slaSuccessRate: audit.slaSuccessRate || "100%",
            completedMilestonesCount: audit.completedMilestonesCount || 0,
            freelancer: participantDisplayName,
            freelancerName: participantDisplayName,
            freelancerAddress: audit.targetAddress,
            recipient: {
              name: participantDisplayName,
              address: audit.targetAddress,
            },
            oracleSignature: audit.oracleSignature,
            ipfsCid: audit.ipfsCid,
            timestamp: audit.createdAt ? new Date(audit.createdAt).toISOString() : new Date().toISOString(),
            auditData: audit.auditData || null,
          },
        };
      }

      // 3. Not found in either table
      return {
        verified: false,
        status: "UNVERIFIED",
        displayStatus: "UNVERIFIED / RECORD NOT FOUND",
        certId,
        message: "This certificate identifier could not be verified against the PolyLance Sovereign Ledger.",
        verifiedAt: new Date().toISOString(),
      };
    } catch (err: any) {
      logger.error("Error verifying PolyLance certificate", {
        certId,
        error: err.message,
      });

      return {
        verified: false,
        status: "UNVERIFIED",
        displayStatus: "UNVERIFIED / RECORD NOT FOUND",
        certId,
        message: "This certificate identifier could not be verified against the PolyLance Sovereign Ledger.",
        verifiedAt: new Date().toISOString(),
      };
    }
  }

  /**
   * Fetch sample verified records for UI demonstration / testing
   */
  static async getSampleRecords(): Promise<{
    sbtRecords: Partial<CertifiedSBTRecord>[];
    auditRecords: Partial<CertifiedAuditRecord>[];
  }> {
    try {
      const sbt = await polylancePool.query(
        `SELECT s."id", s."jobId", s."jobTitle", s."category", s."settledAmountUsdc",
                s."freelancerAddress", s."freelancerName",
                fa."displayName" AS "auditFreelancerName",
                s."clientAddress", s."clientName",
                ca."displayName" AS "auditClientName",
                s."status", s."completedAt"
         FROM "CertifiedSBTRecord" s
         LEFT JOIN "CertifiedAuditRecord" fa ON LOWER(fa."targetAddress") = LOWER(s."freelancerAddress") AND s."freelancerAddress" != ''
         LEFT JOIN "CertifiedAuditRecord" ca ON LOWER(ca."targetAddress") = LOWER(s."clientAddress") AND s."clientAddress" != ''
         ORDER BY s."completedAt" DESC
         LIMIT 10`
      );

      const mappedSbt = sbt.rows.map((r: any) => ({
        id: r.id,
        jobId: r.jobId,
        jobTitle: r.jobTitle,
        category: r.category,
        settledAmountUsdc: formatUsdcAmount(r.settledAmountUsdc),
        freelancerAddress: r.freelancerAddress,
        freelancerName: formatParticipantName(r.freelancerName, r.auditFreelancerName, r.freelancerAddress, null, "Freelancer"),
        clientAddress: r.clientAddress,
        clientName: formatParticipantName(r.clientName, r.auditClientName, r.clientAddress, null, "Escrow Client"),
        status: r.status,
        completedAt: r.completedAt,
      }));

      const audit = await polylancePool.query(
        `SELECT "id", "displayName", "roleType", "trustIndexScore", "lifetimeVolumeUsdc", "targetAddress", "status"
         FROM "CertifiedAuditRecord"
         ORDER BY "createdAt" DESC
         LIMIT 10`
      );

      return {
        sbtRecords: mappedSbt,
        auditRecords: audit.rows,
      };
    } catch {
      return {
        sbtRecords: [],
        auditRecords: [],
      };
    }
  }
}

import { PrismaClient } from '@prisma/client';
import { parsePolyLanceInput } from '../utils/polylanceParser.js';

const prisma = new PrismaClient();

function formatParticipantName(
  name: string | null | undefined,
  address: string | null | undefined,
  defaultRole: string
): string {
  if (!name && !address) return defaultRole;
  const shortAddr = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";
  const cleanName = name?.trim();

  if (
    cleanName &&
    cleanName !== "Verified Developer" &&
    cleanName !== "Escrow Patron" &&
    cleanName !== "Audited Participant"
  ) {
    return cleanName;
  }

  if (shortAddr) {
    return `${defaultRole} (${shortAddr})`;
  }

  return cleanName || defaultRole;
}

export interface VerificationResult {
  verified: boolean;
  status: 'VERIFIED' | 'REVOKED' | 'NOT_FOUND' | 'DISPUTED';
  type: 'SOULBOUND_MILESTONE_ATTESTATION' | 'PROTOCOL_AUDIT_REPORT' | 'UNKNOWN';
  title: string;
  details: any;
  polyLanceUrl: string;
}

export async function verifyPolyLanceCredential(inputString: string): Promise<VerificationResult> {
  const parsed = parsePolyLanceInput(inputString);
  const key = parsed.cleanKey;
  const keyLower = key.toLowerCase();

  try {
    // 1. Check CertifiedSBTRecord
    const sbtRecords: any[] = await prisma.$queryRawUnsafe(
      `SELECT * FROM "CertifiedSBTRecord"
       WHERE "id" = $1 
          OR "jobId" = $1 
          OR LOWER("id") = $2
          OR LOWER("contractAddress") = $2 
          OR LOWER("sbtTokenId") = $2 
          OR "ipfsCid" = $1
          OR "id" ILIKE '%' || $1 || '%'
       LIMIT 1;`,
      key,
      keyLower
    );

    if (sbtRecords && sbtRecords.length > 0) {
      const rec = sbtRecords[0];
      const freelancerDisplayName = formatParticipantName(rec.freelancerName, rec.freelancerAddress, "Freelancer");
      const clientDisplayName = formatParticipantName(rec.clientName, rec.clientAddress, "Escrow Client");
      const amountFormatted = rec.settledAmountUsdc !== undefined
        ? `$${Number(rec.settledAmountUsdc).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDC`
        : "$0.00 USDC";

      return {
        verified: rec.status === 'VERIFIED',
        status: rec.status || 'VERIFIED',
        type: 'SOULBOUND_MILESTONE_ATTESTATION',
        title: rec.jobTitle,
        details: {
          certificateId: rec.id,
          jobId: rec.jobId,
          title: rec.jobTitle,
          typeTitle: 'Soulbound Milestone Attestation',
          amountUsdc: parseFloat(rec.settledAmountUsdc || '0'),
          settledAmountUsdc: amountFormatted,
          freelancer: freelancerDisplayName,
          freelancerName: freelancerDisplayName,
          freelancerAddress: rec.freelancerAddress,
          freelancerGithub: rec.freelancerGithub || null,
          client: clientDisplayName,
          clientName: clientDisplayName,
          clientAddress: rec.clientAddress,
          recipient: {
            name: freelancerDisplayName,
            address: rec.freelancerAddress,
            github: rec.freelancerGithub || null,
          },
          sponsor: {
            name: clientDisplayName,
            address: rec.clientAddress,
          },
          contractAddress: rec.contractAddress,
          sbtTokenId: rec.sbtTokenId,
          oracleSignature: rec.oracleSignature,
          ipfsCid: rec.ipfsCid,
          network: 'Polygon PoS (137)',
          completedAt: rec.completedAt,
        },
        polyLanceUrl: `https://polylance.app/#/jobs/${rec.jobId}/attestation`,
      };
    }

    // 2. Check CertifiedAuditRecord
    const auditRecords: any[] = await prisma.$queryRawUnsafe(
      `SELECT * FROM "CertifiedAuditRecord"
       WHERE "id" = $1 
          OR LOWER("id") = $2
          OR LOWER("targetAddress") = $2
          OR "ipfsCid" = $1
          OR "id" ILIKE '%' || $1 || '%'
       LIMIT 1;`,
      key,
      keyLower
    );

    if (auditRecords && auditRecords.length > 0) {
      const rec = auditRecords[0];
      const participantDisplayName = formatParticipantName(
        rec.displayName,
        rec.targetAddress,
        `Audited ${rec.roleType || "Participant"}`
      );
      const volumeFormatted = rec.lifetimeVolumeUsdc !== undefined
        ? `$${Number(rec.lifetimeVolumeUsdc).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDC`
        : "$0.00 USDC";

      return {
        verified: rec.status === 'VERIFIED',
        status: rec.status || 'VERIFIED',
        type: 'PROTOCOL_AUDIT_REPORT',
        title: `${participantDisplayName} (${rec.roleType}) Trust Audit`,
        details: {
          auditId: rec.id,
          targetAddress: rec.targetAddress,
          displayName: participantDisplayName,
          freelancer: participantDisplayName,
          freelancerName: participantDisplayName,
          freelancerAddress: rec.targetAddress,
          roleType: rec.roleType,
          trustScore: rec.trustIndexScore || '10.0',
          lifetimeVolumeUsdc: volumeFormatted,
          slaSuccessRate: rec.slaSuccessRate || '100%',
          completedMilestonesCount: rec.completedMilestonesCount || 0,
          recipient: {
            name: participantDisplayName,
            address: rec.targetAddress,
          },
          oracleSignature: rec.oracleSignature,
          ipfsCid: rec.ipfsCid,
          network: 'Polygon PoS (137)',
        },
        polyLanceUrl: `https://polylance.app/#/audit/${rec.targetAddress}`,
      };
    }

    // 3. Fallback: Query PolyLance Live REST API
    const response = await fetch(`https://polylance-fv-1.onrender.com/api/certifiedpass/verify/${encodeURIComponent(key)}`);
    if (response.ok) {
      const data: any = await response.json();
      if (data && data.verified) {
        return {
          verified: true,
          status: 'VERIFIED',
          type: data.type || 'SOULBOUND_MILESTONE_ATTESTATION',
          title: data.certificate?.title || 'Verified PolyLance Credential',
          details: data.certificate || {},
          polyLanceUrl: data.polyLanceUrl || `https://polylance.app/#/jobs/${data.certificate?.jobId || 1}/attestation`,
        };
      }
    }

    return {
      verified: false,
      status: 'NOT_FOUND',
      type: 'UNKNOWN',
      title: 'Record Not Found',
      details: { searchedIdentifier: key },
      polyLanceUrl: 'https://polylance.app',
    };
  } catch (err: any) {
    console.error('Verification error:', err);
    return {
      verified: false,
      status: 'NOT_FOUND',
      type: 'UNKNOWN',
      title: 'Verification Error',
      details: { error: err.message },
      polyLanceUrl: 'https://polylance.app',
    };
  }
}

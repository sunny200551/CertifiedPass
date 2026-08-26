import {
  canonicalizeCredential,
  hashCanonicalString,
} from "@certifiedpass/utils";
import type { CanonicalCredential, VerificationResult, VerificationStatus } from "@certifiedpass/types";
import { prisma } from "../utils/prisma.js";
import { BlockchainService } from "./BlockchainService.js";

export class VerificationService {
  /**
   * Comprehensive credential verification pipeline.
   * Public endpoint - no wallet or login required.
   */
  static async verify(credentialId: string): Promise<VerificationResult> {
    const credential = await prisma.credential.findUnique({
      where: { id: credentialId },
      include: {
        issuer: true,
        event: true,
        revocation: true,
      },
    });

    if (!credential) {
      return {
        status: "INVALID",
        reason: `Credential with ID ${credentialId} does not exist in the CertifiedPass registry.`,
        credentialId,
        verifiedAt: new Date().toISOString(),
      };
    }

    // 1. Reconstruct Canonical JSON
    const canonical: CanonicalCredential = {
      id: credential.id,
      credentialType: credential.credentialType.toLowerCase() as any,
      issuerAddress: credential.issuer.walletAddress,
      holderAddress: credential.holderAddress,
      issuedAt: credential.issuedAt?.toISOString() ?? credential.createdAt.toISOString(),
      metadata: credential.metadata as any,
      schemaVersion: 1,
    };

    const canonicalJson = canonicalizeCredential(canonical);
    const calculatedHash = hashCanonicalString(canonicalJson);

    // 2. Query On-Chain state
    const onChainRecord = await BlockchainService.verifyCredentialOnChain(credentialId);

    const onChainHash = onChainRecord
      ? onChainRecord.credentialHash.replace(/^0x/, "").toLowerCase()
      : (credential.credentialHash ?? calculatedHash);

    const hashesMatch = calculatedHash.toLowerCase() === onChainHash.toLowerCase();

    // 3. Determine status
    let status: VerificationStatus;
    let reason: string;

    if (credential.status === "REVOKED" || onChainRecord?.revoked) {
      status = "REVOKED";
      reason = `This credential was revoked by the issuing organization${credential.revocation?.reason ? `: "${credential.revocation.reason}"` : "."}`;
    } else if (!hashesMatch) {
      status = "INVALID";
      reason = "Cryptographic tamper detected: computed SHA-256 hash does not match on-chain hash.";
    } else if (credential.issuer.verificationStatus !== "VERIFIED") {
      status = "ISSUER_UNVERIFIED";
      reason = "Credential hash matches, but the issuing organization has not yet completed platform identity verification.";
    } else {
      status = "VALID";
      reason = "Verified authentic. Credential hash matches on-chain anchor and issuer is platform verified.";
    }

    const res: VerificationResult = {
      status,
      reason,
      credentialId: credential.id,
      hashMatch: hashesMatch,
      calculatedHash,
      onChainHash,
      issuerVerified: credential.issuer.verificationStatus === "VERIFIED",
      isRevoked: status === "REVOKED",
      verifiedAt: new Date().toISOString(),
    };

    if (credential.revocation?.revokedAt) {
      res.revokedAt = credential.revocation.revokedAt.toISOString();
    }
    if (credential.revocation?.reason) {
      res.revocationReason = credential.revocation.reason;
    }
    if (credential.txHash) {
      res.txHash = credential.txHash;
    }
    if (credential.blockNumber) {
      res.blockNumber = Number(credential.blockNumber);
    }
    if (credential.chainId) {
      res.chainId = credential.chainId;
    }

    return res;
  }
}

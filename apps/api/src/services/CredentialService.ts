import { ethers } from "ethers";
import { v4 as uuidv4 } from "uuid";
import type {
  CanonicalCredential,
  CredentialMetadata,
  CredentialType,
} from "@certifiedpass/types";
import {
  canonicalizeCredential,
  hashCanonicalString,
  validateCredentialMetadata,
} from "@certifiedpass/utils";
import { prisma } from "../utils/prisma.js";
import { logger } from "../utils/logger.js";
import { BlockchainService } from "./BlockchainService.js";

export class CredentialService {
  /**
   * Issue a new credential:
   * 1. Validate issuer is verified
   * 2. Canonicalize metadata and compute SHA-256 hash
   * 3. Save to database
   * 4. Submit to blockchain registry
   */
  static async issueCredential(
    issuerId: string,
    data: {
      eventId?: string;
      holderAddress: string;
      credentialType: CredentialType;
      metadata: CredentialMetadata;
    }
  ) {
    const issuer = await prisma.issuer.findUnique({
      where: { id: issuerId },
    });

    if (!issuer) {
      throw new Error("Issuer record not found.");
    }

    if (issuer.verificationStatus !== "VERIFIED") {
      throw new Error("Only verified issuers can issue credentials.");
    }

    const validation = validateCredentialMetadata(data.metadata, data.credentialType);
    if (!validation.success) {
      throw new Error(`Invalid credential metadata: ${JSON.stringify(validation.errors)}`);
    }

    const holderChecksum = ethers.getAddress(data.holderAddress);
    const credentialId = uuidv4();
    const nowIso = new Date().toISOString();

    // Construct CanonicalCredential representation
    const canonical: CanonicalCredential = {
      id: credentialId,
      credentialType: data.credentialType,
      issuerAddress: issuer.walletAddress,
      holderAddress: holderChecksum,
      issuedAt: nowIso,
      metadata: data.metadata,
      schemaVersion: 1,
    };

    const canonicalJson = canonicalizeCredential(canonical);
    const credentialHash = hashCanonicalString(canonicalJson);
    const metadataUri = `/api/v1/credentials/${credentialId}`;

    // Store in DB with ISSUED state
    const credential = await prisma.credential.create({
      data: {
        id: credentialId,
        issuerId: issuer.id,
        holderAddress: holderChecksum,
        eventId: data.eventId ?? null,
        credentialType: data.credentialType.toUpperCase() as any,
        status: "ISSUED",
        credentialHash,
        metadataUri,
        metadata: data.metadata as any,
        issuedAt: new Date(nowIso),
      },
      include: {
        issuer: true,
        event: true,
      },
    });

    logger.info(`Credential created off-chain: ${credentialId} (hash: ${credentialHash})`);

    // Submit on-chain
    try {
      const onChainTx = await BlockchainService.issueCredentialOnChain({
        credentialId,
        holderAddress: holderChecksum,
        credentialType: data.credentialType,
        credentialHash,
        metadataURI: metadataUri,
      });

      // Update credential to ACTIVE
      const updated = await prisma.credential.update({
        where: { id: credentialId },
        data: {
          status: "ACTIVE",
          txHash: onChainTx.txHash,
          blockNumber: onChainTx.blockNumber,
          chainId: onChainTx.chainId,
        },
        include: {
          issuer: true,
          event: true,
        },
      });

      logger.info(`Credential anchored on-chain: ${credentialId} (tx: ${onChainTx.txHash})`);
      return updated;
    } catch (err: any) {
      logger.error("Failed to anchor credential on-chain", { error: err.message });
      // Keep credential in ISSUED status so it can be retried
      return credential;
    }
  }

  /**
   * List credentials with filters and pagination.
   */
  static async listCredentials(query: {
    issuerId?: string;
    holderAddress?: string;
    eventId?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }) {
    const limit = Math.min(query.limit ?? 20, 100);
    const offset = query.offset ?? 0;

    const where: any = {};
    if (query.issuerId) where.issuerId = query.issuerId;
    if (query.holderAddress) where.holderAddress = ethers.getAddress(query.holderAddress);
    if (query.eventId) where.eventId = query.eventId;
    if (query.status) where.status = query.status.toUpperCase();

    const [items, total] = await Promise.all([
      prisma.credential.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { createdAt: "desc" },
        include: {
          issuer: {
            select: {
              id: true,
              name: true,
              walletAddress: true,
              verificationStatus: true,
              logoUrl: true,
            },
          },
          event: {
            select: {
              id: true,
              name: true,
              eventType: true,
            },
          },
          revocation: true,
        },
      }),
      prisma.credential.count({ where }),
    ]);

    return {
      items,
      total,
      limit,
      offset,
      hasMore: offset + items.length < total,
    };
  }

  /**
   * Get single credential by ID.
   */
  static async getCredential(id: string) {
    const credential = await prisma.credential.findUnique({
      where: { id },
      include: {
        issuer: {
          select: {
            id: true,
            name: true,
            walletAddress: true,
            verificationStatus: true,
            description: true,
            website: true,
            logoUrl: true,
          },
        },
        event: true,
        revocation: true,
      },
    });

    if (!credential) {
      throw new Error("Credential not found.");
    }

    return credential;
  }

  /**
   * Revoke a credential on-chain and in the database.
   */
  static async revokeCredential(id: string, issuerId: string, reason: string) {
    const credential = await prisma.credential.findUnique({
      where: { id },
    });

    if (!credential) {
      throw new Error("Credential not found.");
    }

    if (credential.issuerId !== issuerId) {
      throw new Error("Only the issuing organization can revoke this credential.");
    }

    if (credential.status === "REVOKED") {
      throw new Error("Credential has already been revoked.");
    }

    // Submit on-chain revocation
    const tx = await BlockchainService.revokeCredentialOnChain(id, reason);

    // Update database record and create Revocation
    const updated = await prisma.$transaction(async (txPrisma) => {
      await txPrisma.revocation.create({
        data: {
          credentialId: id,
          issuerId,
          reason,
          txHash: tx.txHash,
        },
      });

      return txPrisma.credential.update({
        where: { id },
        data: {
          status: "REVOKED",
        },
        include: {
          issuer: true,
          revocation: true,
        },
      });
    });

    logger.info(`Credential revoked: ${id} (reason: ${reason})`);
    return updated;
  }
}

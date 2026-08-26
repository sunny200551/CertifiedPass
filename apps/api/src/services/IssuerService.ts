import { ethers } from "ethers";
import { prisma } from "../utils/prisma.js";
import { logger } from "../utils/logger.js";

export class IssuerService {
  static async createIssuer(
    walletAddress: string,
    data: {
      name: string;
      description?: string;
      website?: string;
      socialLinks?: Record<string, unknown>;
    }
  ) {
    const checksumAddress = ethers.getAddress(walletAddress);

    const existing = await prisma.issuer.findUnique({
      where: { walletAddress: checksumAddress },
    });

    if (existing) {
      throw new Error("Issuer profile already exists for this wallet address.");
    }

    const issuer = await prisma.issuer.create({
      data: {
        walletAddress: checksumAddress,
        name: data.name,
        description: data.description ?? null,
        website: data.website ?? null,
        socialLinks: (data.socialLinks as any) ?? undefined,
        verificationStatus: "PENDING",
      },
    });

    logger.info(`Issuer registered: ${issuer.id} (${issuer.name})`);
    return issuer;
  }

  static async getIssuerById(id: string) {
    const issuer = await prisma.issuer.findUnique({
      where: { id },
      include: {
        events: {
          where: { isActive: true },
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: {
            issuedCredentials: true,
          },
        },
      },
    });

    if (!issuer) {
      throw new Error("Issuer not found.");
    }

    return issuer;
  }

  static async getIssuerByWallet(walletAddress: string) {
    const checksumAddress = ethers.getAddress(walletAddress);
    return prisma.issuer.findUnique({
      where: { walletAddress: checksumAddress },
      include: {
        events: true,
        _count: {
          select: {
            issuedCredentials: true,
          },
        },
      },
    });
  }

  static async updateVerificationStatus(
    id: string,
    status: "PENDING" | "VERIFIED" | "REJECTED"
  ) {
    const issuer = await prisma.issuer.update({
      where: { id },
      data: { verificationStatus: status },
    });

    logger.info(`Issuer ${id} status updated to ${status}`);
    return issuer;
  }
}

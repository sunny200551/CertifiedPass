import { prisma } from "../utils/prisma.js";

export class ProfileService {
  /**
   * Look up user profile by wallet address or create placeholder if new.
   * Ensures details persist across all devices.
   */
  static async getProfileByWallet(walletAddress: string) {
    const checksum = walletAddress.trim();
    let user = await prisma.user.findFirst({
      where: {
        walletAddress: { equals: checksum, mode: "insensitive" },
      },
      include: {
        receivedCredentials: {
          where: { status: "ACTIVE" },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!user) {
      // Create user record in DB
      user = await prisma.user.create({
        data: {
          walletAddress: checksum,
          displayName: `PassHolder ${checksum.slice(0, 6)}...${checksum.slice(-4)}`,
        },
        include: {
          receivedCredentials: true,
        },
      });
    }

    return {
      id: user.id,
      walletAddress: user.walletAddress,
      username: user.username,
      displayName: user.displayName,
      bio: user.bio,
      avatarUrl: user.avatarUrl,
      isAdmin: user.isAdmin,
      credentialsCount: user.receivedCredentials.length,
    };
  }

  static async getPublicProfile(username: string) {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: { equals: username, mode: "insensitive" } },
          { walletAddress: { equals: username, mode: "insensitive" } },
        ],
      },
      include: {
        receivedCredentials: {
          where: { status: "ACTIVE" },
          orderBy: { createdAt: "desc" },
          include: {
            issuer: {
              select: {
                id: true,
                name: true,
                verificationStatus: true,
                logoUrl: true,
              },
            },
            event: {
              select: {
                name: true,
                eventType: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new Error(`Profile for user '${username}' not found.`);
    }

    // Category counts breakdown
    const stats = {
      totalCredentials: user.receivedCredentials.length,
      hackathons: user.receivedCredentials.filter((c) => c.credentialType === "HACKATHON").length,
      internships: user.receivedCredentials.filter((c) => c.credentialType === "INTERNSHIP").length,
      openSource: user.receivedCredentials.filter((c) => c.credentialType === "OPENSOURCE").length,
      competitions: user.receivedCredentials.filter((c) => c.credentialType === "COMPETITION").length,
      workshops: user.receivedCredentials.filter((c) => c.credentialType === "WORKSHOP").length,
      events: user.receivedCredentials.filter((c) => c.credentialType === "EVENT").length,
    };

    return {
      user: {
        id: user.id,
        walletAddress: user.walletAddress,
        username: user.username ?? username,
        displayName: user.displayName ?? username,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
        memberSince: user.createdAt.toISOString(),
      },
      stats,
      credentials: user.receivedCredentials.map((c) => ({
        id: c.id,
        credentialType: c.credentialType.toLowerCase(),
        title: (c.metadata as any)?.title ?? "Credential",
        holderName: (c.metadata as any)?.holderName ?? user.displayName ?? "Holder",
        issuedAt: c.issuedAt?.toISOString() ?? c.createdAt.toISOString(),
        metadata: c.metadata,
        issuer: c.issuer,
        event: c.event,
        txHash: c.txHash,
        credentialHash: c.credentialHash,
      })),
    };
  }

  static async updateProfile(
    userId: string,
    data: {
      username?: string;
      displayName?: string;
      bio?: string;
      avatarUrl?: string;
    }
  ) {
    return prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  static async upsertProfileByWallet(
    walletAddress: string,
    data: {
      username?: string;
      displayName?: string;
      bio?: string;
      avatarUrl?: string;
    }
  ) {
    const checksum = walletAddress.trim();
    return prisma.user.upsert({
      where: { walletAddress: checksum },
      update: data,
      create: {
        walletAddress: checksum,
        ...data,
      },
    });
  }
}

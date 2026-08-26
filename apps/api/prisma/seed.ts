import { PrismaClient } from "@prisma/client";
import { generateCredentialHash } from "@certifiedpass/utils";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding CertifiedPass Database...");

  // 1. Create Holder Users
  const holder1 = await prisma.user.upsert({
    where: { walletAddress: "0x71c845137f73612facb1c1e6e3e1a144e5904f2e" },
    update: {},
    create: {
      walletAddress: "0x71c845137f73612facb1c1e6e3e1a144e5904f2e",
      username: "alexrivera",
      displayName: "Alex Rivera",
      bio: "Full-stack Web3 engineer & smart contract architect building verifiable infrastructure on Polygon.",
    },
  });

  const holder2 = await prisma.user.upsert({
    where: { walletAddress: "0x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e7" },
    update: {},
    create: {
      walletAddress: "0x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e7",
      username: "elenarostova",
      displayName: "Elena Rostova",
      bio: "Zero-Knowledge cryptography researcher and Circom circuit developer.",
    },
  });

  // 2. Create Verified Issuers
  const issuerOrg1 = await prisma.issuer.upsert({
    where: { walletAddress: "0x51e2a819ba4f5b6c891e4a3f12c6a4f69b88793b" },
    update: {},
    create: {
      walletAddress: "0x51e2a819ba4f5b6c891e4a3f12c6a4f69b88793b",
      name: "ETHSF & Polygon Labs",
      slug: "ethsf",
      description: "Global community organizing high-impact blockchain hackathons, technical grants, and developer cohorts.",
      website: "https://polygon.technology",
      verificationStatus: "VERIFIED",
    },
  });

  const issuerOrg2 = await prisma.issuer.upsert({
    where: { walletAddress: "0x3e18a4751f893d5a2d8d87ea38340156d97c36f2" },
    update: {},
    create: {
      walletAddress: "0x3e18a4751f893d5a2d8d87ea38340156d97c36f2",
      name: "ConsenSys",
      slug: "consensys",
      description: "Leading Ethereum software company developing MetaMask, Infura, and Linea zkEVM.",
      website: "https://consensys.io",
      verificationStatus: "VERIFIED",
    },
  });

  // 3. Create Events
  const event1 = await prisma.event.upsert({
    where: { id: "ethsf-2026-summit" },
    update: {},
    create: {
      id: "ethsf-2026-summit",
      issuerId: issuerOrg1.id,
      name: "ETHSF Innovation Summit 2026",
      eventType: "HACKATHON",
      description: "Global hackathon building decentralized AI agents and scalable EVM infrastructure.",
      startDate: new Date("2026-08-15"),
      endDate: new Date("2026-08-20"),
    },
  });

  // 4. Create Sample Credentials
  const cred1Metadata = {
    credentialType: "hackathon",
    title: "1st Place Winner — Global Web3 AI Hackathon",
    holderName: "Alex Rivera",
    issuerName: "ETHSF & Polygon Labs",
    issuedAt: "2026-08-20",
    achievement: "1st Place Winner - Infrastructure Track",
    eventName: "ETHSF Innovation Summit 2026",
    skills: ["Solidity", "TypeScript", "Three.js", "Zod", "Ethers.js"],
  };

  const cred1Hash = generateCredentialHash(cred1Metadata);

  await prisma.credential.upsert({
    where: { id: "cp-hackathon-2026-ethsf" },
    update: {},
    create: {
      id: "cp-hackathon-2026-ethsf",
      issuerId: issuerOrg1.id,
      holderId: holder1.id,
      eventId: event1.id,
      credentialType: "HACKATHON",
      status: "ACTIVE",
      credentialHash: cred1Hash,
      metadata: cred1Metadata,
      txHash: "0x3e18a4751f893d5a2d8d87ea38340156d97c36f2e825dc63820ef0d9f4859a12",
      blockNumber: 8529310,
      chainId: 80002,
    },
  });

  console.log("✅ Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

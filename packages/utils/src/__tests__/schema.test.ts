import { describe, it, expect } from "vitest";
import {
  hackathonSchema,
  internshipSchema,
  openSourceSchema,
  credentialMetadataSchema,
  evmAddress,
} from "../schema.js";

describe("Credential Metadata Zod Schemas", () => {
  it("validates valid hackathon metadata", () => {
    const validData = {
      credentialType: "hackathon",
      title: "1st Place Winner — Global Web3 AI Hackathon",
      holderName: "Alex Rivera",
      issuerName: "ETHSF",
      issuedAt: "2026-08-20",
      achievement: "1st Place",
      eventName: "ETHSF 2026",
      skills: ["Solidity", "TypeScript"],
    };

    const result = hackathonSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("rejects invalid hackathon metadata missing required title", () => {
    const invalidData = {
      credentialType: "hackathon",
      holderName: "Alex Rivera",
      issuerName: "ETHSF",
      issuedAt: "2026-08-20",
    };

    const result = hackathonSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("validates valid EVM address format", () => {
    expect(evmAddress.safeParse("0x71C845137F73612FACb1C1E6e3e1A144e5904F2E").success).toBe(true);
    expect(evmAddress.safeParse("0xinvalid").success).toBe(false);
  });

  it("validates internship metadata schema", () => {
    const internshipData = {
      credentialType: "internship",
      title: "Software Engineer Intern",
      holderName: "Alex Rivera",
      issuerName: "ConsenSys",
      issuedAt: "2026-07-31",
      companyName: "ConsenSys",
      role: "Engineer",
      startDate: "2026-05-01",
      endDate: "2026-07-31",
      completionStatus: "completed",
    };

    const parsed = internshipSchema.safeParse(internshipData);
    expect(parsed.success).toBe(true);
  });
});

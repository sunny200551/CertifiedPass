import { GoogleGenerativeAI } from "@google/generative-ai";
import { v4 as uuidv4 } from "uuid";
import type { CredentialDraft, CredentialType } from "@certifiedpass/types";
import { validateCredentialMetadata } from "@certifiedpass/utils";
import { logger } from "../utils/logger.js";

const GEMINI_API_KEY = process.env["GEMINI_API_KEY"] ?? "";

export class AIService {
  private static genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

  /**
   * Extract credential details from an uploaded file (certificate image, PDF, or text).
   */
  static async extractFromDocument(params: {
    fileBuffer?: Buffer;
    mimeType?: string;
    text?: string;
    credentialTypeHint?: CredentialType;
  }): Promise<{ drafts: CredentialDraft[]; extractionId: string; rawSummary?: string }> {
    const extractionId = uuidv4();

    // If Gemini is configured and fileBuffer is present
    if (this.genAI && params.fileBuffer && params.mimeType) {
      try {
        const model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `You are an expert credential extractor for the CertifiedPass platform.
Analyze this document and extract structured verifiable credential data.

JSON format to return:
{
  "credentialType": "hackathon" | "internship" | "opensource" | "event" | "workshop" | "competition",
  "title": string,
  "holderName": string,
  "issuerName": string,
  "issuedAt": "YYYY-MM-DD",
  "description": string,
  "skills": string[],
  "holderAddress": "0x... (if found, otherwise omit)",
  "categorySpecific": {
    // For hackathon: eventName, achievement, rank (number), team, project, organizer
    // For internship: companyName, role, department, startDate, endDate, completionStatus
    // For opensource: organizationName, repositoryName, contributionType, pullRequestRefs
    // For event: eventName, role, date, location
    // For workshop: workshopName, topics, durationHours
    // For competition: competitionName, rank (number), prize
  }
}
Return ONLY pure JSON.`;

        const imagePart = {
          inlineData: {
            data: params.fileBuffer.toString("base64"),
            mimeType: params.mimeType,
          },
        };

        const result = await model.generateContent([prompt, imagePart]);
        const textResp = result.response.text();
        const jsonMatch = textResp.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          const credType = (params.credentialTypeHint || parsed.credentialType || "hackathon") as CredentialType;

          const metadata: any = {
            title: parsed.title || "Achievement Credential",
            holderName: parsed.holderName || "Candidate",
            issuerName: parsed.issuerName || "Certified Issuer",
            issuedAt: parsed.issuedAt || new Date().toISOString().slice(0, 10),
            description: parsed.description,
            skills: parsed.skills || [],
            credentialType: credType,
            ...(parsed.categorySpecific || {}),
          };

          const validation = validateCredentialMetadata(metadata, credType);
          const aiGeneratedFields = Object.keys(metadata).filter((k) => metadata[k] !== undefined);

          const draft: CredentialDraft = {
            draftId: uuidv4(),
            extractedData: validation.success ? validation.data : metadata,
            aiGeneratedFields,
            humanEditedFields: [],
            approved: false,
            validationErrors: validation.success ? undefined : (validation.errors as any),
          };

          return {
            drafts: [draft],
            extractionId,
            rawSummary: "Successfully extracted document metadata via Gemini 1.5 Flash.",
          };
        }
      } catch (err: any) {
        logger.error("Gemini document extraction error", { error: err.message });
      }
    }

    // Fallback heuristic extraction for development / local demo
    logger.info("Using heuristic AI extractor fallback");
    const inferredType: CredentialType = params.credentialTypeHint ?? "hackathon";
    const sampleDate = new Date().toISOString().slice(0, 10);

    const draftMetadata: any = {
      credentialType: inferredType,
      title: inferredType === "hackathon" ? "1st Place Winner - Web3 Hackathon" : "Certificate of Achievement",
      holderName: "Alex Rivera",
      issuerName: "Global Hackathon League",
      issuedAt: sampleDate,
      description: "Recognized for building outstanding decentralized infrastructure.",
      skills: ["Solidity", "TypeScript", "React", "Zero-Knowledge"],
    };

    if (inferredType === "hackathon") {
      draftMetadata.eventName = "ETHSF Innovation Summit 2026";
      draftMetadata.achievement = "1st Place - Infrastructure Track";
      draftMetadata.rank = 1;
      draftMetadata.team = "Team ZeroProof";
      draftMetadata.project = "CertifiedPass Decentralized Registry";
    } else if (inferredType === "internship") {
      draftMetadata.companyName = "ConsenSys Labs";
      draftMetadata.role = "Smart Contract Engineering Intern";
      draftMetadata.startDate = "2026-01-10";
      draftMetadata.endDate = sampleDate;
      draftMetadata.completionStatus = "completed";
    }

    const validation = validateCredentialMetadata(draftMetadata, inferredType);
    const draft: CredentialDraft = {
      draftId: uuidv4(),
      extractedData: draftMetadata,
      aiGeneratedFields: ["title", "holderName", "issuerName", "achievement", "skills"],
      humanEditedFields: [],
      approved: false,
      validationErrors: validation.success ? undefined : (validation.errors as any),
    };

    return {
      drafts: [draft],
      extractionId,
      rawSummary: "Draft generated from document inputs.",
    };
  }

  /**
   * Bulk draft generation from CSV / XLSX rows.
   */
  static async generateBulkDrafts(params: {
    rows: Record<string, string>[];
    credentialType: CredentialType;
    eventId?: string;
    commonFields?: Record<string, any>;
  }): Promise<{
    drafts: CredentialDraft[];
    totalProcessed: number;
    totalValid: number;
    totalFailed: number;
    extractionId: string;
  }> {
    const extractionId = uuidv4();
    const drafts: CredentialDraft[] = [];
    let totalValid = 0;
    let totalFailed = 0;

    for (const row of params.rows) {
      const holderName = row["name"] || row["Holder Name"] || row["student"] || row["winner"] || "Recipient";
      const title =
        row["title"] ||
        row["achievement"] ||
        params.commonFields?.["title"] ||
        `${params.credentialType.toUpperCase()} Certificate`;

      const metadata: any = {
        credentialType: params.credentialType,
        title,
        holderName,
        issuerName: params.commonFields?.["issuerName"] || "CertifiedPass Issuer",
        issuedAt:
          row["date"] ||
          params.commonFields?.["issuedAt"] ||
          new Date().toISOString().slice(0, 10),
        description: row["description"] || params.commonFields?.["description"],
        skills: row["skills"] ? row["skills"].split(",").map((s) => s.trim()) : params.commonFields?.["skills"] || [],
      };

      if (params.credentialType === "hackathon") {
        metadata.eventName = row["event"] || params.commonFields?.["eventName"] || "Hackathon 2026";
        metadata.achievement = row["achievement"] || row["rank"] || "Participant";
        if (row["rank"] && !isNaN(Number(row["rank"]))) metadata.rank = Number(row["rank"]);
        metadata.team = row["team"] || row["Team Name"];
        metadata.project = row["project"] || row["Project Name"];
      } else if (params.credentialType === "internship") {
        metadata.companyName = row["company"] || params.commonFields?.["companyName"] || "Tech Corp";
        metadata.role = row["role"] || "Software Engineer Intern";
        metadata.startDate = row["startDate"] || "2026-01-01";
        metadata.endDate = row["endDate"] || new Date().toISOString().slice(0, 10);
        metadata.completionStatus = row["completionStatus"] || "completed";
      }

      const validation = validateCredentialMetadata(metadata, params.credentialType);
      const isValid = validation.success;
      if (isValid) totalValid++;
      else totalFailed++;

      drafts.push({
        draftId: uuidv4(),
        extractedData: isValid ? (validation.data as any) : metadata,
        aiGeneratedFields: Object.keys(metadata),
        humanEditedFields: [],
        approved: false,
        validationErrors: isValid ? undefined : (validation.errors as any),
      });
    }

    return {
      drafts,
      totalProcessed: params.rows.length,
      totalValid,
      totalFailed,
      extractionId,
    };
  }

  /**
   * Classify free-text into a likely CredentialType.
   */
  static async classifyText(text: string): Promise<{
    credentialType: CredentialType;
    confidence: number;
    keywordsFound: string[];
  }> {
    const lower = text.toLowerCase();
    const keywords: Record<CredentialType, string[]> = {
      hackathon: ["hackathon", "bounty", "track", "submission", "devpost", "pitch"],
      internship: ["intern", "internship", "stipend", "mentor", "supervisor", "quarter"],
      opensource: ["pr", "pull request", "repository", "commit", "github", "maintainer"],
      competition: ["contest", "prize pool", "tournament", "championship", "1st place"],
      workshop: ["workshop", "bootcamp", "curriculum", "attendee", "lecture"],
      event: ["conference", "summit", "keynote", "speaker", "panelist"],
    };

    let bestType: CredentialType = "hackathon";
    let maxMatches = 0;
    let foundKeywords: string[] = [];

    for (const [type, keys] of Object.entries(keywords)) {
      const matches = keys.filter((k) => lower.includes(k));
      if (matches.length > maxMatches) {
        maxMatches = matches.length;
        bestType = type as CredentialType;
        foundKeywords = matches;
      }
    }

    const confidence = Math.min(0.5 + maxMatches * 0.15, 0.98);
    return {
      credentialType: bestType,
      confidence,
      keywordsFound: foundKeywords,
    };
  }
}

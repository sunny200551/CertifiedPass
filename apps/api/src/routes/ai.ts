import { Router, type Request, type Response } from "express";
import { requireAuth, requireIssuer } from "../middleware/auth.js";
import { aiRateLimiter } from "../middleware/rateLimiter.js";
import { documentUpload } from "../middleware/upload.js";
import { validate } from "../middleware/validate.js";
import { aiExtractSchema, aiGenerateSchema } from "@certifiedpass/utils";
import { AIService } from "../services/AIService.js";

export const aiRouter: Router = Router();

/**
 * POST /api/v1/ai/extract — upload a document, get credential drafts.
 */
aiRouter.post(
  "/extract",
  requireAuth,
  requireIssuer,
  aiRateLimiter,
  documentUpload.single("file"),
  validate({ body: aiExtractSchema.shape.body }),
  async (req: Request, res: Response) => {
    try {
      const file = req.file;
      const result = await AIService.extractFromDocument({
        ...(file?.buffer ? { fileBuffer: file.buffer } : {}),
        ...(file?.mimetype ? { mimeType: file.mimetype } : {}),
        ...(req.body?.text ? { text: req.body.text } : {}),
        ...(req.body?.credentialTypeHint ? { credentialTypeHint: req.body.credentialTypeHint } : {}),
      });

      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(400).json({ success: false, error: { code: "EXTRACTION_FAILED", message: err.message } });
    }
  }
);

/**
 * POST /api/v1/ai/generate-credentials — bulk draft generation from tabular data.
 */
aiRouter.post(
  "/generate-credentials",
  requireAuth,
  requireIssuer,
  aiRateLimiter,
  validate({ body: aiGenerateSchema.shape.body }),
  async (req: Request, res: Response) => {
    try {
      const result = await AIService.generateBulkDrafts({
        rows: req.body.rows,
        credentialType: req.body.credentialType,
        ...(req.body.eventId ? { eventId: req.body.eventId } : {}),
        ...(req.body.commonFields ? { commonFields: req.body.commonFields } : {}),
      });

      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(400).json({ success: false, error: { code: "BULK_GENERATION_FAILED", message: err.message } });
    }
  }
);

/**
 * POST /api/v1/ai/classify — classify text into a credential type.
 */
aiRouter.post(
  "/classify",
  requireAuth,
  requireIssuer,
  aiRateLimiter,
  async (req: Request, res: Response) => {
    try {
      const text = req.body.text ?? "";
      const result = await AIService.classifyText(text);
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(400).json({ success: false, error: { code: "CLASSIFICATION_FAILED", message: err.message } });
    }
  }
);

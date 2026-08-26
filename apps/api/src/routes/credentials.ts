import { Router, type Request, type Response } from "express";
import { requireAuth, requireIssuer } from "../middleware/auth.js";
import { publicVerifyRateLimiter } from "../middleware/rateLimiter.js";
import { validate } from "../middleware/validate.js";
import { createCredentialSchema, revokeCredentialSchema } from "@certifiedpass/utils";
import { CredentialService } from "../services/CredentialService.js";
import { VerificationService } from "../services/VerificationService.js";

export const credentialsRouter: Router = Router();

/**
 * GET /api/v1/credentials — list credentials.
 */
credentialsRouter.get("/", async (req: Request, res: Response) => {
  try {
    const list = await CredentialService.listCredentials({
      ...(typeof req.query["issuerId"] === "string" ? { issuerId: req.query["issuerId"] } : {}),
      ...(typeof req.query["holderAddress"] === "string" ? { holderAddress: req.query["holderAddress"] } : {}),
      ...(typeof req.query["eventId"] === "string" ? { eventId: req.query["eventId"] } : {}),
      ...(typeof req.query["status"] === "string" ? { status: req.query["status"] } : {}),
      ...(req.query["limit"] ? { limit: parseInt(req.query["limit"] as string, 10) } : {}),
      ...(req.query["offset"] ? { offset: parseInt(req.query["offset"] as string, 10) } : {}),
    });
    res.json({ success: true, data: list });
  } catch (err: any) {
    res.status(400).json({ success: false, error: { code: "LIST_FAILED", message: err.message } });
  }
});

/**
 * POST /api/v1/credentials — issue a new credential.
 */
credentialsRouter.post(
  "/",
  requireAuth,
  requireIssuer,
  validate({ body: createCredentialSchema.shape.body }),
  async (req: Request, res: Response) => {
    try {
      const credential = await CredentialService.issueCredential(
        req.user!.issuerId!,
        req.body
      );
      res.status(201).json({ success: true, data: credential });
    } catch (err: any) {
      res.status(400).json({ success: false, error: { code: "ISSUANCE_FAILED", message: err.message } });
    }
  }
);

/**
 * GET /api/v1/credentials/:id — get single credential record.
 */
credentialsRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params["id"] as string;
    const credential = await CredentialService.getCredential(id);
    res.json({ success: true, data: credential });
  } catch (err: any) {
    res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: err.message } });
  }
});

/**
 * GET /api/v1/credentials/:id/verify — public verification endpoint.
 * NO WALLET OR LOGIN REQUIRED.
 */
credentialsRouter.get(
  "/:id/verify",
  publicVerifyRateLimiter,
  async (req: Request, res: Response) => {
    try {
      const id = req.params["id"] as string;
      const result = await VerificationService.verify(id);
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(404).json({ success: false, error: { code: "VERIFICATION_FAILED", message: err.message } });
    }
  }
);

/**
 * POST /api/v1/credentials/:id/revoke — revoke a credential.
 */
credentialsRouter.post(
  "/:id/revoke",
  requireAuth,
  requireIssuer,
  validate({
    body: revokeCredentialSchema.shape.body,
    params: revokeCredentialSchema.shape.params,
  }),
  async (req: Request, res: Response) => {
    try {
      const id = req.params["id"] as string;
      const result = await CredentialService.revokeCredential(
        id,
        req.user!.issuerId!,
        req.body.reason
      );
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(400).json({ success: false, error: { code: "REVOCATION_FAILED", message: err.message } });
    }
  }
);

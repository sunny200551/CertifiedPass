import { Router, type Request, type Response } from "express";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createIssuerSchema } from "@certifiedpass/utils";
import { IssuerService } from "../services/IssuerService.js";

export const issuersRouter: Router = Router();

/** GET /api/v1/issuers/:id — public issuer profile */
issuersRouter.get("/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params["id"] as string;
    const issuer = await IssuerService.getIssuerById(id);
    res.json({ success: true, data: issuer });
  } catch (err: any) {
    res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: err.message } });
  }
});

/** POST /api/v1/issuers — register as a new issuer */
issuersRouter.post(
  "/",
  requireAuth,
  validate({ body: createIssuerSchema.shape.body }),
  async (req: Request, res: Response) => {
    try {
      const issuer = await IssuerService.createIssuer(req.user!.walletAddress, req.body);
      res.status(201).json({ success: true, data: issuer });
    } catch (err: any) {
      res.status(400).json({ success: false, error: { code: "CREATION_FAILED", message: err.message } });
    }
  }
);

/** PATCH /api/v1/issuers/:id/verification — admin updates verification status */
issuersRouter.patch(
  "/:id/verification",
  requireAuth,
  requireAdmin,
  async (req: Request, res: Response) => {
    try {
      const id = req.params["id"] as string;
      const issuer = await IssuerService.updateVerificationStatus(id, req.body.status);
      res.json({ success: true, data: issuer });
    } catch (err: any) {
      res.status(400).json({ success: false, error: { code: "UPDATE_FAILED", message: err.message } });
    }
  }
);

import { Router, type Request, type Response } from "express";
import { publicVerifyRateLimiter } from "../middleware/rateLimiter.js";
import { PolyLanceVerificationService } from "../services/PolyLanceVerificationService.js";

export const polylanceRouter: Router = Router();

/**
 * GET /api/v1/polylance/verify/:id — verify a PolyLance certificate by ID or URL component
 */
polylanceRouter.get(
  "/verify/:id",
  publicVerifyRateLimiter,
  async (req: Request, res: Response) => {
    try {
      const id = req.params["id"] as string;
      const clientIp = req.ip || req.socket.remoteAddress;
      const result = await PolyLanceVerificationService.verifyCertificate(
        id,
        "CertifiedPass",
        clientIp
      );
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: {
          code: "POLYLANCE_VERIFICATION_FAILED",
          message: err.message,
        },
      });
    }
  }
);

/**
 * POST /api/v1/polylance/verify — verify by body (supports full URL or raw string)
 */
polylanceRouter.post(
  "/verify",
  publicVerifyRateLimiter,
  async (req: Request, res: Response) => {
    try {
      const input = (req.body?.input || req.body?.certId || req.body?.url || "") as string;
      if (!input.trim()) {
        res.status(400).json({
          success: false,
          error: {
            code: "INVALID_INPUT",
            message: "Certificate ID or verification URL is required.",
          },
        });
        return;
      }
      const clientIp = req.ip || req.socket.remoteAddress;
      const result = await PolyLanceVerificationService.verifyCertificate(
        input,
        "CertifiedPass",
        clientIp
      );
      res.json({ success: true, data: result });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        error: {
          code: "POLYLANCE_VERIFICATION_FAILED",
          message: err.message,
        },
      });
    }
  }
);

/**
 * GET /api/v1/polylance/records/sample — fetch sample records for UI testing / preview
 */
polylanceRouter.get("/records/sample", async (_req: Request, res: Response) => {
  try {
    const data = await PolyLanceVerificationService.getSampleRecords();
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: { code: "FETCH_FAILED", message: err.message },
    });
  }
});

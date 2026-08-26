import { Router, type Request, type Response } from "express";
import { authRateLimiter } from "../middleware/rateLimiter.js";
import { validate } from "../middleware/validate.js";
import { verifySignatureSchema } from "@certifiedpass/utils";
import { AuthService } from "../services/AuthService.js";

export const authRouter: Router = Router();

/**
 * GET /api/v1/auth/nonce
 * Issues a one-time nonce for the wallet to sign.
 * Nonce expires after 5 minutes.
 */
authRouter.get(
  "/nonce",
  authRateLimiter,
  async (req: Request, res: Response) => {
    try {
      const walletAddress = req.query["wallet"] as string;
      if (!walletAddress) {
        res.status(400).json({
          success: false,
          error: { code: "BAD_REQUEST", message: "Query parameter 'wallet' is required." },
        });
        return;
      }

      const nonceData = AuthService.generateNonce(walletAddress);
      res.json({
        success: true,
        data: nonceData,
      });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        error: { code: "INVALID_WALLET_ADDRESS", message: err.message },
      });
    }
  }
);

/**
 * POST /api/v1/auth/verify
 * Verifies an EIP-191 personal_sign signature against the nonce.
 * Issues a JWT on success.
 */
authRouter.post(
  "/verify",
  authRateLimiter,
  validate({ body: verifySignatureSchema.shape.body }),
  async (req: Request, res: Response) => {
    try {
      const authResult = await AuthService.verifySignature({
        walletAddress: req.body.walletAddress,
        signature: req.body.signature,
        nonce: req.body.nonce,
      });

      res.json({
        success: true,
        data: authResult,
      });
    } catch (err: any) {
      res.status(401).json({
        success: false,
        error: { code: "AUTHENTICATION_FAILED", message: err.message },
      });
    }
  }
);

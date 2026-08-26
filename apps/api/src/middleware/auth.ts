/**
 * CertifiedPass — JWT Authentication Middleware
 *
 * Verifies the Bearer token on protected routes.
 * Attaches decoded user context to req.user.
 *
 * Usage:
 *   router.get('/protected', requireAuth, handler)
 */

import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AuthUser {
  walletAddress: string;
  issuerId?: string | undefined;
  isAdmin?: boolean | undefined;
}

// Extend Express Request type to include user
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------

const JWT_SECRET = process.env["JWT_SECRET"] ?? "dev-secret-change-me";

/**
 * Require a valid JWT. Responds 401 if missing or invalid.
 */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      error: { code: "UNAUTHORIZED", message: "Missing or invalid Authorization header" },
    });
    return;
  }

  const token = authHeader.slice(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as Record<string, any>;
    req.user = {
      walletAddress: decoded["walletAddress"],
      issuerId: decoded["issuerId"] ?? undefined,
      isAdmin: decoded["isAdmin"] ?? undefined,
    };
    next();
  } catch {
    res.status(401).json({
      success: false,
      error: { code: "TOKEN_EXPIRED_OR_INVALID", message: "Token is expired or invalid" },
    });
  }
}

/**
 * Require the authenticated user to also be an issuer.
 * Must come after requireAuth in the middleware chain.
 */
export function requireIssuer(req: Request, res: Response, next: NextFunction): void {
  if (!req.user?.issuerId) {
    res.status(403).json({
      success: false,
      error: { code: "FORBIDDEN", message: "Issuer account required" },
    });
    return;
  }
  next();
}

/**
 * Require the authenticated user to be an admin.
 * Must come after requireAuth in the middleware chain.
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!req.user?.isAdmin) {
    res.status(403).json({
      success: false,
      error: { code: "FORBIDDEN", message: "Admin access required" },
    });
    return;
  }
  next();
}

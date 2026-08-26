/**
 * CertifiedPass — Rate Limiters
 *
 * Four tiers:
 *   1. globalRateLimiter       — applied to all routes (100 req / 15 min)
 *   2. authRateLimiter         — stricter for auth endpoints (20 req / 15 min)
 *   3. aiRateLimiter           — for AI extraction (20 req / hour)
 *   4. publicVerifyRateLimiter — for public credential verification (120 req / min)
 */

import rateLimit from "express-rate-limit";

const WINDOW_MS = parseInt(process.env["RATE_LIMIT_WINDOW_MS"] ?? "900000", 10); // 15 min
const MAX_REQUESTS = parseInt(process.env["RATE_LIMIT_MAX_REQUESTS"] ?? "100", 10);
const AI_WINDOW_MS = parseInt(process.env["AI_RATE_LIMIT_WINDOW_MS"] ?? "3600000", 10); // 1 hour
const AI_MAX_REQUESTS = parseInt(process.env["AI_RATE_LIMIT_MAX_REQUESTS"] ?? "20", 10);

const standardHeaders = true;
const legacyHeaders = false;

export const globalRateLimiter = rateLimit({
  windowMs: WINDOW_MS,
  max: MAX_REQUESTS,
  standardHeaders,
  legacyHeaders,
  message: {
    success: false,
    error: {
      code: "RATE_LIMITED",
      message: "Too many requests — please try again later",
    },
  },
});

export const authRateLimiter = rateLimit({
  windowMs: WINDOW_MS,
  max: 20,
  standardHeaders,
  legacyHeaders,
  message: {
    success: false,
    error: {
      code: "RATE_LIMITED",
      message: "Too many auth attempts — please wait before trying again",
    },
  },
});

export const aiRateLimiter = rateLimit({
  windowMs: AI_WINDOW_MS,
  max: AI_MAX_REQUESTS,
  standardHeaders,
  legacyHeaders,
  message: {
    success: false,
    error: {
      code: "RATE_LIMITED",
      message: "AI extraction rate limit reached — you can run up to 20 extractions per hour",
    },
  },
});

export const publicVerifyRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 120, // 120 verification requests per minute
  standardHeaders,
  legacyHeaders,
  message: {
    success: false,
    error: {
      code: "RATE_LIMITED",
      message: "Verification rate limit exceeded — please slow down",
    },
  },
});

/**
 * CertifiedPass API — Express Application Entry Point
 *
 * Responsibilities:
 *   - Configure Express middleware (security, parsing, logging, CORS)
 *   - Mount all route modules
 *   - Register global error handler
 *   - Start HTTP server
 *
 * Architecture rule: NO business logic in this file.
 * All logic lives in services/. Routes call services, not the other way around.
 */

import cors from "cors";
import express, {
  type Application,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import helmet from "helmet";
import morgan from "morgan";

import { authRouter } from "./routes/auth.js";
import { aiRouter } from "./routes/ai.js";
import { credentialsRouter } from "./routes/credentials.js";
import { eventsRouter } from "./routes/events.js";
import { issuersRouter } from "./routes/issuers.js";
import { profilesRouter } from "./routes/profiles.js";
import { globalRateLimiter } from "./middleware/rateLimiter.js";
import { logger } from "./utils/logger.js";

// ---------------------------------------------------------------------------
// Environment
// ---------------------------------------------------------------------------
const PORT = parseInt(process.env["PORT"] ?? "3001", 10);
const NODE_ENV = process.env["NODE_ENV"] ?? "development";
const CORS_ORIGINS = (process.env["CORS_ORIGINS"] ?? "http://localhost:5173")
  .split(",")
  .map((o) => o.trim());

// ---------------------------------------------------------------------------
// App factory
// ---------------------------------------------------------------------------

function createApp(): Application {
  const app = express();

  // -------------------------------------------------------------------------
  // Security headers
  // -------------------------------------------------------------------------
  app.use(
    helmet({
      contentSecurityPolicy: NODE_ENV === "production",
      crossOriginEmbedderPolicy: false, // Allow embedding for QR pages
    })
  );

  // -------------------------------------------------------------------------
  // CORS — allow only configured origins
  // -------------------------------------------------------------------------
  app.use(
    cors({
      origin: CORS_ORIGINS,
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Request-ID"],
    })
  );

  // -------------------------------------------------------------------------
  // Request logging
  // -------------------------------------------------------------------------
  app.use(
    morgan(NODE_ENV === "production" ? "combined" : "dev", {
      stream: {
        write: (msg) => logger.http(msg.trim()),
      },
    })
  );

  // -------------------------------------------------------------------------
  // Body parsing
  // -------------------------------------------------------------------------
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));

  // -------------------------------------------------------------------------
  // Global rate limiter (per-route limiters applied in route files)
  // -------------------------------------------------------------------------
  app.use(globalRateLimiter);

  // -------------------------------------------------------------------------
  // Health check — unauthenticated, no rate limiting
  // -------------------------------------------------------------------------
  app.get("/health", (_req: Request, res: Response) => {
    res.json({
      status: "ok",
      service: "certifiedpass-api",
      version: "0.1.0",
      timestamp: new Date().toISOString(),
      environment: NODE_ENV,
    });
  });

  // -------------------------------------------------------------------------
  // API routes — all under /api/v1
  // -------------------------------------------------------------------------
  const api = express.Router();

  api.use("/auth",        authRouter);
  api.use("/issuers",     issuersRouter);
  api.use("/events",      eventsRouter);
  api.use("/credentials", credentialsRouter);
  api.use("/ai",          aiRouter);
  api.use("/profiles",    profilesRouter);

  app.use("/api/v1", api);

  // -------------------------------------------------------------------------
  // 404 handler — must come after all routes
  // -------------------------------------------------------------------------
  app.use((_req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      error: { code: "NOT_FOUND", message: "Route not found" },
    });
  });

  // -------------------------------------------------------------------------
  // Global error handler — must have 4 params to be recognized by Express
  // -------------------------------------------------------------------------
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    logger.error("Unhandled error", {
      message: err.message,
      stack: NODE_ENV !== "production" ? err.stack : undefined,
    });

    const statusCode =
      "statusCode" in err && typeof (err as { statusCode: unknown }).statusCode === "number"
        ? (err as { statusCode: number }).statusCode
        : 500;

    res.status(statusCode).json({
      success: false,
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message:
          NODE_ENV === "production"
            ? "An unexpected error occurred"
            : err.message,
      },
    });
  });

  return app;
}

// ---------------------------------------------------------------------------
// Bootstrap
// ---------------------------------------------------------------------------

async function bootstrap() {
  const app = createApp();

  const server = app.listen(PORT, () => {
    logger.info(`CertifiedPass API started`, {
      port: PORT,
      environment: NODE_ENV,
      pid: process.pid,
    });
  });

  // Graceful shutdown
  const shutdown = (signal: string) => {
    logger.info(`${signal} received — shutting down gracefully`);
    server.close(() => {
      logger.info("HTTP server closed");
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT",  () => shutdown("SIGINT"));

  process.on("unhandledRejection", (reason) => {
    logger.error("Unhandled promise rejection", { reason });
    // Don't crash in production — log and continue
  });
}

bootstrap().catch((err) => {
  console.error("Failed to start API server:", err);
  process.exit(1);
});

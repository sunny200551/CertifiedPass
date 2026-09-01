import pg from "pg";
import { logger } from "./logger.js";

const { Pool } = pg;

const DEFAULT_POLYLANCE_DB_URL =
  "postgresql://certified_pass_polylance_audit_data_user:waw2eHfvEgMB7fdwTXxH5QO93ECDRky1@dpg-dabe8ess728c73aetv5g-a.ohio-postgres.render.com/certified_pass_polylance_audit_data?sslmode=require";

const connectionString =
  process.env["POLYLANCE_DATABASE_URL"] ||
  process.env["DATABASE_URL"] ||
  DEFAULT_POLYLANCE_DB_URL;

declare global {
  // eslint-disable-next-line no-var
  var polylancePgPool: pg.Pool | undefined;
}

export const polylancePool =
  globalThis.polylancePgPool ??
  new Pool({
    connectionString,
    ssl: connectionString.includes("sslmode=require") || connectionString.includes("render.com")
      ? { rejectUnauthorized: false }
      : undefined,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });

if (process.env["NODE_ENV"] !== "production") {
  globalThis.polylancePgPool = polylancePool;
}

polylancePool.on("error", (err) => {
  logger.error("Unexpected error on idle PolyLance PostgreSQL client", {
    error: err.message,
  });
});

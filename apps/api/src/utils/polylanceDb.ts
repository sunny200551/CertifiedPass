import pg from "pg";
import { logger } from "./logger.js";

const { Pool } = pg;

const DEFAULT_POLYLANCE_DB_URL =
  "postgresql://polylance_database_primary_db_secured_user:HOp73Emv0bu1uIU6ORIFh82wgy8t2Vdl@dpg-dap3q3btqb8s73f8375g-a.oregon-postgres.render.com/polylance_database_primary_db_secured?sslmode=require";

let rawConnectionString =
  process.env["POLYLANCE_DATABASE_URL"] ||
  process.env["DATABASE_URL"] ||
  DEFAULT_POLYLANCE_DB_URL;

// Auto-resolve render internal host to external host if needed outside render private network
if (
  rawConnectionString.includes("@dpg-dap3q3btqb8s73f8375g-a/") ||
  rawConnectionString.includes("@dpg-dap3q3btqb8s73f8375g-a?")
) {
  rawConnectionString = rawConnectionString.replace(
    "@dpg-dap3q3btqb8s73f8375g-a",
    "@dpg-dap3q3btqb8s73f8375g-a.oregon-postgres.render.com"
  );
  if (!rawConnectionString.includes("sslmode=")) {
    rawConnectionString += (rawConnectionString.includes("?") ? "&" : "?") + "sslmode=require";
  }
}

declare global {
  // eslint-disable-next-line no-var
  var polylancePgPool: pg.Pool | undefined;
}

export const polylancePool =
  globalThis.polylancePgPool ??
  new Pool({
    connectionString: rawConnectionString,
    ssl: rawConnectionString.includes("sslmode=") || rawConnectionString.includes("render.com")
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

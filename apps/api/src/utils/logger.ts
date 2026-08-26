/**
 * CertifiedPass — Winston Logger
 */

import winston from "winston";

const LOG_LEVEL = process.env["LOG_LEVEL"] ?? "info";
const LOG_FORMAT = process.env["LOG_FORMAT"] ?? "pretty";
const NODE_ENV = process.env["NODE_ENV"] ?? "development";

const jsonFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const prettyFormat = winston.format.combine(
  winston.format.timestamp({ format: "HH:mm:ss" }),
  winston.format.colorize(),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length
      ? `\n${JSON.stringify(meta, null, 2)}`
      : "";
    return `${timestamp} [${level}]: ${message}${metaStr}`;
  })
);

export const logger = winston.createLogger({
  level: LOG_LEVEL,
  format: NODE_ENV === "production" || LOG_FORMAT === "json" ? jsonFormat : prettyFormat,
  transports: [
    new winston.transports.Console(),
  ],
  exceptionHandlers: [
    new winston.transports.Console(),
  ],
});

// Add http level for Morgan
winston.addColors({ http: "magenta" });

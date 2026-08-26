/**
 * CertifiedPass — Multer Upload Configuration
 *
 * Used by the AI extraction endpoint for document uploads.
 *
 * Security rules:
 *   - File size hard limit: 10 MB
 *   - MIME type whitelist enforced (PDF, images, CSV, XLSX)
 *   - Files stored in memory buffer (not disk) for security
 *   - All AI extraction happens server-side before any storage
 */

import type { Request } from "express";
import multer, { type FileFilterCallback } from "multer";

const MAX_SIZE_BYTES = parseInt(
  process.env["MAX_UPLOAD_SIZE"] ?? String(10 * 1024 * 1024),
  10
);

const ALLOWED_MIMES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "text/csv",
  "text/plain",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  "application/vnd.ms-excel", // .xls
]);

function fileFilter(
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void {
  if (ALLOWED_MIMES.has(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Unsupported file type: ${file.mimetype}. Allowed: PDF, JPEG, PNG, WebP, CSV, XLSX`
      )
    );
  }
}

/**
 * Memory storage upload for AI document extraction.
 * Files are held in req.file.buffer — never written to disk.
 */
export const documentUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_SIZE_BYTES,
    files: 1, // Only one file per request
  },
  fileFilter,
});

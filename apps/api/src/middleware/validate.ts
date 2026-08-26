/**
 * CertifiedPass — Zod Request Validation Middleware
 *
 * Creates an Express middleware that validates request body, params,
 * and query against a Zod schema. Returns 422 on failure with structured errors.
 *
 * Usage:
 *   router.post('/credentials', requireAuth, validate(createCredentialSchema), handler)
 */

import type { NextFunction, Request, Response } from "express";
import { type ZodSchema, ZodError } from "zod";

interface ValidateSchemas {
  body?: ZodSchema;
  params?: ZodSchema;
  query?: ZodSchema;
}

/**
 * Creates a validation middleware from one or more Zod schemas.
 * Each schema validates the corresponding part of the request object.
 * All validations run before any rejection (collect all errors).
 */
export function validate(schemas: ValidateSchemas) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: Record<string, string[]> = {};

    const parts = [
      { key: "body", schema: schemas.body, data: req.body },
      { key: "params", schema: schemas.params, data: req.params },
      { key: "query", schema: schemas.query, data: req.query },
    ] as const;

    let hasErrors = false;

    for (const { key, schema, data } of parts) {
      if (!schema) continue;

      const result = schema.safeParse(data);
      if (!result.success) {
        hasErrors = true;
        for (const issue of result.error.issues) {
          const path = `${key}.${issue.path.join(".")}`;
          if (!errors[path]) errors[path] = [];
          errors[path]!.push(issue.message);
        }
      }
    }

    if (hasErrors) {
      res.status(422).json({
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Request validation failed",
          details: errors,
        },
      });
      return;
    }

    next();
  };
}

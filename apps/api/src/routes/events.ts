import { Router, type Request, type Response } from "express";
import { requireAuth, requireIssuer } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createEventSchema } from "@certifiedpass/utils";
import { EventService } from "../services/EventService.js";

export const eventsRouter: Router = Router();

/** GET /api/v1/events — list events for current authenticated issuer */
eventsRouter.get(
  "/",
  requireAuth,
  requireIssuer,
  async (req: Request, res: Response) => {
    try {
      const events = await EventService.listEvents(req.user!.issuerId!);
      res.json({ success: true, data: events });
    } catch (err: any) {
      res.status(400).json({ success: false, error: { code: "FETCH_FAILED", message: err.message } });
    }
  }
);

/** POST /api/v1/events — create an event/program */
eventsRouter.post(
  "/",
  requireAuth,
  requireIssuer,
  validate({ body: createEventSchema.shape.body }),
  async (req: Request, res: Response) => {
    try {
      const event = await EventService.createEvent(req.user!.issuerId!, req.body);
      res.status(201).json({ success: true, data: event });
    } catch (err: any) {
      res.status(400).json({ success: false, error: { code: "CREATION_FAILED", message: err.message } });
    }
  }
);

/** GET /api/v1/events/:id — event detail */
eventsRouter.get(
  "/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    try {
      const id = req.params["id"] as string;
      const event = await EventService.getEvent(id, req.user?.issuerId);
      res.json({ success: true, data: event });
    } catch (err: any) {
      res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: err.message } });
    }
  }
);

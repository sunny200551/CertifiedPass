import { Router, type Request, type Response } from "express";
import { requireAuth } from "../middleware/auth.js";
import { ProfileService } from "../services/ProfileService.js";

export const profilesRouter: Router = Router();

/** GET /api/v1/profiles/:username — public holder proof profile */
profilesRouter.get("/:username", async (req: Request, res: Response) => {
  try {
    const username = req.params["username"] as string;
    const profile = await ProfileService.getPublicProfile(username);
    res.json({ success: true, data: profile });
  } catch (err: any) {
    res.status(404).json({ success: false, error: { code: "NOT_FOUND", message: err.message } });
  }
});

/** PATCH /api/v1/profiles/me — update current user profile */
profilesRouter.patch("/me", requireAuth, async (req: Request, res: Response) => {
  try {
    const updated = await ProfileService.updateProfile((req.user as any).userId, req.body);
    res.json({ success: true, data: updated });
  } catch (err: any) {
    res.status(400).json({ success: false, error: { code: "UPDATE_FAILED", message: err.message } });
  }
});

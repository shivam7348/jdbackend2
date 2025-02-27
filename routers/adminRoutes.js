import { Router } from "express";
import {
  getAnnouncements,
  postAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
} from "../controllers/announcementController.js";

const router = Router();
router.get("/get/announcements", getAnnouncements); // Get all announcements
router.post("/post/announcements", postAnnouncements); // Create a new announcement
router.put("/update/announcements/:id", updateAnnouncement); // Update an announcement
router.delete("/delete/announcements/:id", deleteAnnouncement); // Delete an announcement

export default router;

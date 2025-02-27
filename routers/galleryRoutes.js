import express from "express";
import upload from "../middleware/upload.js";
import {
  deleteGallery,
  galleryUpload,
  getGallery,
  updateGallery,
} from "../controllers/galleryController.js";

const router = express.Router();

router.get("/get", getGallery);
router.post("/post", upload.single("image"), galleryUpload);
router.put("/edit/:id", upload.single("image"), updateGallery);
router.delete("/delete/:id", deleteGallery);

export default router;

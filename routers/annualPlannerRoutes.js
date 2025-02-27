import express from "express";
import upload from "../middleware/upload.js";
import {
  AnnualPlannerUpload,
  deleteAnnualPlanner,
  getAnnualPlanner,
  updateAnnualPlanner,
} from "../controllers/annualPlannerController.js";

const router = express.Router();

router.post("/post", upload.single("image"), AnnualPlannerUpload);

router.get("/get", getAnnualPlanner);
router.put("/edit/:id", upload.single("image"), updateAnnualPlanner);
router.delete("/delete/:id", deleteAnnualPlanner);

export default router;

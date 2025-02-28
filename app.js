import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import connectDB from "./config/connectDB.js";
import adminUserRoutes from "./routers/adminUserRoutes.js";
import adminRoutes from "./routers/adminRoutes.js";
import activityRoutes from "./routers/activityRoutes.js";
import galleryRoutes from "./routers/galleryRoutes.js";
import annualPlannerRoutes from "./routers/annualPlannerRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Connect to Database
connectDB();

// Routes
app.use("/api/admin", adminUserRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/annualPlanner", annualPlannerRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

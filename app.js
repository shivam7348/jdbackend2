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
const __dirname = path.resolve();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://your-deployed-frontend-url.com"],
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));

// Connect to Database
connectDB();

// Routes
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/annualPlanner", annualPlannerRoutes);

// Serve frontend
app.use(express.static(path.join(__dirname, "client/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/dist", "index.html"));
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

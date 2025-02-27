import { Router } from "express";
import { loginAdminUser, registerAdminUser } from "../controllers/admin/adminUserController.js";


const router = Router();

router.post("/register", registerAdminUser);

router.post("/login", loginAdminUser);

// router.get("/profile", authMiddleware("admin"), getAdminUserProfile);

export default router;

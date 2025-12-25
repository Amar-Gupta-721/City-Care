import express from "express";
import {
  registerOfficer,
  officerOnboarding,
  getOfficerProfile,
  listOfficerRequests,
  approveOfficer,
  denyOfficer,
  solveComplaint,
  officerLogin
} from "../controllers/officerController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

import multer from "multer";
const upload = multer({ dest: "uploads/" });

const router = express.Router();

// Officer create own account
router.post("/register", registerOfficer);

// Officer login
router.post("/login", officerLogin);

// Officer onboarding (after signup)
router.post(
  "/onboarding",
  protect,
  authorizeRoles("officer"),
  upload.single("idImage"),   // <<< THIS IS REQUIRED
  officerOnboarding
);


// Officer dashboard & profile
router.get("/me", protect, getOfficerProfile);

// Admin sees pending requests
router.get("/requests", protect, authorizeRoles("admin"), listOfficerRequests);

// Admin approves officer
router.put("/approve/:id", protect, authorizeRoles("admin"), approveOfficer);

// Admin denies officer
router.delete("/deny/:id", protect, authorizeRoles("admin"), denyOfficer);

// Solve Complaint
router.put("/solve/:id", protect, solveComplaint);

export default router;

import express from "express";
import {
  addExperience,
  deleteExperience,
  getAllExperiences,
  updateExperience,
} from "../controller/experienceController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET all experiences
router.get("/get-experience", getAllExperiences);

// POST add a new experience
router.post("/add", isAuthenticated, addExperience);

// PUT update an existing experience
router.put("/update/:id", isAuthenticated, updateExperience);

// DELETE remove an experience
router.delete("/delete/:id", isAuthenticated, deleteExperience);

export default router;

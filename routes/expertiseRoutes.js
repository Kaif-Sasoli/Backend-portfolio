import express from "express";
import {
  createExpertise,
  deleteExpertise,
  getAllExpertise,
  getExpertiseById,
  updateExpertise,
} from "../controller/expertiseController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

// CRUD Routes
router.get("/get-expertise", getAllExpertise);
router.get("/get-expertise/:id", getExpertiseById);
router.post("/add-expertise", isAuthenticated, createExpertise);
router.put("/update-expertise/:id", isAuthenticated, updateExpertise);
router.delete("/delete-expertise/:id", isAuthenticated, deleteExpertise);

export default router;
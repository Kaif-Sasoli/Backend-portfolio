import express from "express";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import {
  addDegree,
  deleteDegree,
  getAllDegrees,
  updateDegree,
} from "../controller/educationController.js";

const router = express.Router();

router.get("/get-degrees", getAllDegrees);

router.post("/add", isAuthenticated, addDegree);
router.post("/update/:id", isAuthenticated, updateDegree);
router.delete("/delete/:id", isAuthenticated, deleteDegree);

export default router;

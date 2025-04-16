import express from "express";
import multer from "multer";
import {
  createProject,
  getProjects,
  updateProject,
  deleteProject,
} from "../controller/projectController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // Use in-memory storage

router.post(
  "/add-project",
  isAuthenticated,
  upload.single("image"),
  createProject
);
router.get("/get-all", getProjects);
router.put(
  "/update-project/:id",
  isAuthenticated,
  upload.single("image"),
  updateProject
);
router.delete("/delete-project/:id", isAuthenticated, deleteProject);

export default router;

import express from "express";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import {
  addCourse,
  deleteCourse,
  getAllCourses,
  updateCourse,
} from "../controller/courseController.js";

const router = express.Router();

router.get("/get-courses", getAllCourses);

router.post("/add", isAuthenticated, addCourse);
router.post("/update/:id", isAuthenticated, updateCourse);
router.delete("/delete/:id", isAuthenticated, deleteCourse);

export default router;

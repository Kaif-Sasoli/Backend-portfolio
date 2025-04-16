import express from "express";
import {
  getUser,
  login,
  logoutUser,
  updateUser,
} from "../controller/userController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/login", login);

// Protected routes
router.get("/profile", isAuthenticated, getUser);
router.put("/update-profile", isAuthenticated, updateUser);
router.get("/logout", isAuthenticated, logoutUser);

export default router;

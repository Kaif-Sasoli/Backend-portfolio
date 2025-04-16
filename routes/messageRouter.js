// routes/messageRouter.js
import express from "express";
import {
  sendMessage,
  getAllMessages,
  deleteMessage,
} from "../controller/messageController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Route to send a message
router.post("/send", sendMessage);

router.get("/get-messages", isAuthenticated, getAllMessages);
router.delete("/delete/:id", isAuthenticated, deleteMessage);

export default router; 
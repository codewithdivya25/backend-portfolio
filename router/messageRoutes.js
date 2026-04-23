import express from "express";
import {
  getAllMessages,
  sendMessage,
  deleteMessage,
} from "../controller/messageController.js";

import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// Send Message
router.post("/send", sendMessage);

// Get All Messages
router.get("/getall", getAllMessages);

// Delete Message
router.delete("/delete/:id", isAuthenticated, deleteMessage);

export default router;
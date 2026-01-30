import express from "express";
import {getAllmessges, sendMessage, deleteMessage } from "../controller/messageController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// POST /api/message/send
router.post("/send", sendMessage);
router.get("/getall", getAllmessges )
router.delete("/delete/:id", isAuthenticated,  deleteMessage);
export default router;

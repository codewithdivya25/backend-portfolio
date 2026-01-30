import express from "express";
import { PostTimeLine, deleteTimeLine, getAllTimeLine } from "../controller/timeLineController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// POST /api/message/send
router.post("/add", isAuthenticated, PostTimeLine);
router.delete("/delete/:id", isAuthenticated, deleteTimeLine );
router.get("/getall", getAllTimeLine )
export default router;

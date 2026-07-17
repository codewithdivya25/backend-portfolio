console.log("Software Application Route Loaded");
import express from "express";
import { addNewApplication, deleteApplication,  getAllApplication } from "../controller/softwareApplicationController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// POST /api/message/send
router.post("/add", isAuthenticated, addNewApplication);
router.delete("/delete/:id", isAuthenticated, deleteApplication);
router.get("/getall", getAllApplication)

export default router;

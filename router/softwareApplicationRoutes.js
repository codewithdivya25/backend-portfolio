import express from "express";
import { addNewApplications, deleteApplications,  getAllApplications } from "../controller/softwareApplicationController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// POST /api/message/send
router.post("/add", isAuthenticated, addNewApplications);
router.delete("/delete/:id", isAuthenticated, deleteApplications );
router.get("/getall", getAllApplications )
export default router;

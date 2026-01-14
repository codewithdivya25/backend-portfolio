import express from "express";
import { getUser, login, register, UpdateProfile, logout } from "../controller/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// POST /api/message/send
router.post("/register", register);
router.post("/Login", login);
router.get("/logout",  isAuthenticated,logout)
router.get("/me", isAuthenticated, getUser)
router.put("/update/me", isAuthenticated,UpdateProfile)


export default router;

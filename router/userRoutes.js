import express from "express";
import { getUser, login, register, UpdateProfile, logout, updatePassword, getUserForPortfolio, forgotPassword, resetPassword, } from "../controller/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// POST /api/message/send
router.post("/register", register);
router.post("/Login", login);
router.get("/logout",  isAuthenticated,logout)
router.get("/me", isAuthenticated, getUser)
router.put("/update/me", isAuthenticated,UpdateProfile)
router.put("/update/password", isAuthenticated,updatePassword)
router.get("/me/portfolio", getUserForPortfolio)
router.post("/password/forgot", forgotPassword)
router.put("/password/reset/:token", resetPassword)



export default router;

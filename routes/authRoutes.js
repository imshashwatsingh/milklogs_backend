import express from "express";
import { register, verifyOTP, login, loginVerifyOTP } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.post("/login-verify-otp", loginVerifyOTP);

export default router;
import express from "express";
import { register, verifyOTP, login, loginVerifyOTP, authenticate } from "../controllers/authController.js";
import { getuser } from "../controllers/userController.js";
const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.post("/login-verify-otp", loginVerifyOTP);
// fixed post to get
router.get("/getuser", authenticate, getuser);

export default router;
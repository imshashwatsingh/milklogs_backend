import express from "express";
import { register, verifyOTP, login, loginVerifyOTP, authenticate } from "../controllers/authController.js";
import { getuser } from "../controllers/userController.js";
const router = express.Router();

router.patch("/profileupdate", authenticate,);
/*
    req.body - default milk quantity, default milk price
*/
router.put("/add", authenticate,);
router.patch("/update", authenticate,);

router.get("/getentry:date", authenticate,); // for a specific date
router.get("/getallentry:year", authenticate,); // for all entries 


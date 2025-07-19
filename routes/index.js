import express from "express";
import { home } from "../controllers/homeController.js";
import { testDB } from "../config/database.config.js";

const router = express.Router();

router.get("/", home);
router.get("/db", testDB);

export default router;
import express from "express";
import { authenticate } from "../controllers/authController.js";
import {
  updateProfile,
  addData,
  updateData,
  getEntry,
  getAllEntry,
} from "../controllers/dashController.js";
const router = express.Router();

router.patch("/profileupdate", authenticate, updateProfile);
/*
    req.body - default milk quantity, default milk price
*/
router.put("/add", authenticate, addData); // done
router.patch("/update", authenticate, updateData); // done

router.get("/getentry/:date", authenticate, getEntry); // for a specific date

router.get("/getallentry/:year", authenticate, getAllEntry); // for all entries

export default router;

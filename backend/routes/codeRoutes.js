import express from "express";
import { uploadCode } from "../controllers/codeController.js";

const router = express.Router();
router.post("/upload", uploadCode);
export default router;
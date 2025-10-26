import express from "express";
import { generateAIReview, getReviews } from "../controllers/reviewController.js";

const router = express.Router();
router.post("/auto", generateAIReview);
router.get("/:codeId", getReviews);
export default router;
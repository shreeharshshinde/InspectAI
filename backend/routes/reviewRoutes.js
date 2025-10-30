import express from "express";
import { generateAIReview, getReviews, generateGeminiReview} from "../controllers/reviewController.js";

const router = express.Router();
router.post("/generateReview", generateAIReview);
router.get("/:codeId", getReviews);

// gemini test
router.post("/generateReviewG" , generateGeminiReview) ;

export default router;
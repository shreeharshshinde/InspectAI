const express = require("express");
const { generateAIReview, getReviews, generateGeminiReview } = require("../controllers/reviewController");

const router = express.Router();

router.post("/review", generateAIReview);
router.get("/:codeId", getReviews);

// gemini test
router.post("/generateReviewG", generateGeminiReview);

module.exports = router;

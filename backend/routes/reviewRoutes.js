import express from "express";
import { getReviews, generateReview} from "../controllers/reviewController.js";

const router = express.Router();

router.get("/:codeId", getReviews);
router.post("/generateReviewG" , generateReview) ;

export default router;


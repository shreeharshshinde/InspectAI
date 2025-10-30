import express from "express";
import { getIssue , createIssue } from "../controllers/issueController.js";

const router = express.Router();
router.post("/createIssue", createIssue);
router.get("/getIssue", getIssue);


export default router;
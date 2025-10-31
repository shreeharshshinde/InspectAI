// server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import axios from "axios";

import codeRoutes from "./routes/codeRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log(err));

// Existing routes
app.use("/api/code", codeRoutes);
app.use("/api/review", reviewRoutes);

// --- JIRA Integration Routes ---
const JIRA_BASE_URL = process.env.JIRA_BASE_URL;
const JIRA_USER = process.env.JIRA_USER;
const JIRA_PASS = process.env.JIRA_PASS;
const PROJECT_KEY = process.env.PROJECT_KEY || "IAI";

// Fetch issues
app.get("/issues", async (req, res) => {
  try {
    const response = await axios.get(`${JIRA_BASE_URL}/search`, {
      params: { jql: `project = "${PROJECT_KEY}"` },
      auth: { username: JIRA_USER, password: JIRA_PASS },
    });
    res.json(response.data);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// Create issue
app.post("/create-issue", async (req, res) => {
  try {
    const { summary, description, issueType, priority } = req.body;

    const response = await axios.post(
      `${JIRA_BASE_URL}/issue`,
      {
        fields: {
          project: { key: PROJECT_KEY },
          summary,
          description,
          issuetype: { name: issueType || "Task" },
          priority: { name: priority || "Medium" },
        },
      },
      {
        auth: { username: JIRA_USER, password: JIRA_PASS },
      }
    );

    res.json({ message: "Issue created successfully!", data: response.data });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

// --- Start Server ---
app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));

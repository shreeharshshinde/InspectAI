// server.js
import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const JIRA_BASE_URL = process.env.JIRA_BASE_URL;
const JIRA_USER = process.env.JIRA_USER;
const JIRA_PASS = process.env.JIRA_PASS;
const PROJECT_KEY = process.env.PROJECT_KEY || "IAI";
const PORT = process.env.PORT || 5000;

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

app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));

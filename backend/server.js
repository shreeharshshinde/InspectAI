// server.js
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json()); // parse JSON bodies

// ✅ Jira Configuration
const JIRA_BASE_URL = "http://localhost:2990/jira/rest/api/latest";
const AUTH = {
  username: "admin", // replace with your Jira username
  password: "admin", // replace with your Jira password or API token
};

// ✅ GET all issues
app.get("/issues", async (req, res) => {
  try {
    const response = await axios.get(`${JIRA_BASE_URL}/search`, {
      params: { jql: 'project = "IAI"' },
      auth: AUTH,
    });

    // Jira returns { issues: [...] }
    res.json(response.data);
  } catch (err) {
    console.error("❌ Error fetching issues from Jira:");
    if (err.response) {
      console.error(err.response.data);
      res.status(err.response.status).json({
        error: err.response.data,
        message: err.response.data?.errorMessages || "Failed to fetch issues",
      });
    } else {
      console.error(err.message);
      res.status(500).json({ error: err.message });
    }
  }
});

// ✅ POST create issue
app.post("/create-issue", async (req, res) => {
  try {
    const { summary, description, assignee, priority, issueType } = req.body;

    const fields = {
      project: { key: "IAI" },
      summary,
      description,
      issuetype: { name: issueType || "Task" },
      priority: { name: priority || "Medium" },
    };

    // only add assignee if provided
    if (assignee) fields.assignee = { name: assignee };

    const response = await axios.post(
      `${JIRA_BASE_URL}/issue`,
      { fields },
      { auth: AUTH }
    );

    res.json({ message: "✅ Issue created successfully!", data: response.data });
  } catch (err) {
    console.error("❌ Jira Error while creating issue:");
    if (err.response) {
      console.error(JSON.stringify(err.response.data, null, 2));
      res.status(err.response.status).json({
        error: err.response.data,
        message: err.response.data?.errorMessages || "Failed to create issue",
      });
    } else {
      console.error(err.message);
      res.status(500).json({ error: err.message });
    }
  }
});

app.listen(5000, () => console.log("✅ Proxy running on port 5000"));

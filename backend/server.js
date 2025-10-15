// server.js
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json()); // to parse JSON bodies

// Get issues
app.get("/issues", async (req, res) => {
  try {
    const response = await axios.get(
      "http://localhost:2990/jira/rest/api/2/search",
      {
        params: { jql: 'project = "IAI"' },
        auth: { username: "admin", password: "admin" },
      }
    );
    res.json(response.data);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Create new issue
app.post("/create-issue", async (req, res) => {
  try {
    const { summary, description, issueType } = req.body;

    const response = await axios.post(
      "http://localhost:2990/jira/rest/api/2/issue",
      {
        fields: {
          project: { key: "IAI" }, // change "IN" to your project key
          summary: summary,
          description: description,
          issuetype: { name: issueType || "Task" }, // e.g., "Bug", "Story", "Task"
        },
      },
      {
        auth: { username: "admin", password: "admin" },
      }
    );

    res.json({ message: "Issue created successfully!", data: response.data });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

app.listen(5000, () => console.log("Proxy running on port 5000"));
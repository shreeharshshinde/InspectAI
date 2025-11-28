// // server.js
// const express = require("express");
// const axios = require("axios");
// const cors = require("cors");
// require("dotenv").config(); // Load environment variables
// const codeRoutes =require("./routes/codeRoutes");
// const reviewRoutes=require("./routes/reviewRoutes");
// const { connectDB } = require("./config/db");

// const app = express();
// app.use(cors());
// app.use(express.json());

// app.use("/api",codeRoutes);
// app.use("/api",reviewRoutes);


// // Use variables from .env
// const JIRA_BASE_URL = process.env.JIRA_BASE_URL;
// const JIRA_USER = process.env.JIRA_USER;
// const JIRA_PASS = process.env.JIRA_PASS;
// const PROJECT_KEY = process.env.PROJECT_KEY || "IAI";
// const PORT = process.env.PORT || 5000;

// // Get issues
// app.get("/issues", async (req, res) => {
//   try {
//     const response = await axios.get(`${JIRA_BASE_URL}/search`, {
//       params: { jql: `project = "${PROJECT_KEY}"` },
//       auth: { username: JIRA_USER, password: JIRA_PASS },
//     });
//     console.log(response.data)
//     response.data.issues.forEach((issue, index) => {
//       console.log("──────── ISSUE", index + 1, "────────");
//       console.log("Key:", issue.key);
//       console.log("Status name:", issue.fields?.status?.name ?? "NO_STATUS");
//     });
//     res.json(response.data);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ error: err.message });
//   }
// });

// // Create new issue
// app.post("/create-issue", async (req, res) => {
//   try {
//     const { summary, description, issueType, priority } = req.body;

//     const response = await axios.post(
//       `${JIRA_BASE_URL}/issue`,
//       {
//         fields: {
//           project: { key: PROJECT_KEY },
//           summary: summary,
//           description: description,
//           issuetype: { name: issueType || "Task" },
//           priority: { name: priority || "Medium" },
//         },
//       },
//       {
//         auth: { username: JIRA_USER, password: JIRA_PASS },
//       }
//     );
//     console.log("data" , response)

//     res.json({ message: "Issue created successfully!", data: response.data });
//   } catch (err) {
//     console.error(err.response?.data || err.message);
//     res.status(500).json({ error: err.response?.data || err.message });
//   }
// });

// app.get("/user", async (req, res) => {
//   try {
//     const response = await axios.get(
//       "http://localhost:8080/rest/api/2/myself",
//       {
//         auth: {
//           username:JIRA_USER ,
//           password:JIRA_PASS,
//         },
//       }
//     );

//     res.json({
//       name: response.data.displayName,
//       email: response.data.emailAddress,
//       jiraAccountId: response.data.accountId,
//       avatar: response.data.avatarUrls["48x48"],
//     });
//   } catch (error) {
//     console.error("Error fetching Jira user:", error.response?.data || error);
//     res.status(500).json({ message: "Failed to fetch Jira user" });
//   }
// });

// app.use("/api/code" , codeRoutes) ;
// app.use("/api/review" , reviewRoutes) ;

// connectDB();

// app.listen(PORT, () =>
//   console.log(`Proxy running on port ${PORT}`),
// );


// server.js
const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config(); // Load environment variables
const codeRoutes = require("./routes/codeRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const { connectDB } = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", codeRoutes);
app.use("/api", reviewRoutes);

// Use variables from .env
const JIRA_BASE_URL = process.env.JIRA_BASE_URL; // e.g. http://localhost:8080/rest/api/2
const JIRA_USER = process.env.JIRA_USER;
const JIRA_PASS = process.env.JIRA_PASS;
const PROJECT_KEY = process.env.PROJECT_KEY || "IAI";
const PORT = process.env.PORT || 5000;

const authCfg = { auth: { username: JIRA_USER, password: JIRA_PASS } };

/**
 * SEARCH /issues - returns search results (use fields=*all to ensure status is included)
 */
app.get("/issues", async (req, res) => {
  try {
    const response = await axios.get(`${JIRA_BASE_URL}/search`, {
      params: {
        jql: `project = "${PROJECT_KEY}"`,
        maxResults: 200,
        fields: "*all",
      },
      auth: { username: JIRA_USER, password: JIRA_PASS },
    });

    // debug: print each issue's key + status
    response.data.issues.forEach((issue, index) => {
      console.log("──────── ISSUE", index + 1, "────────");
      console.log("Key:", issue.key);
      console.log("Status name:", issue.fields?.status?.name ?? "NO_STATUS");
    });

    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

/**
 * GET single issue (fresh)
 */
app.get("/issue/:key", async (req, res) => {
  try {
    const resp = await axios.get(`${JIRA_BASE_URL}/issue/${req.params.key}`, {
      auth: { username: JIRA_USER, password: JIRA_PASS },
      params: { expand: "renderedFields,changelog", fields: "*all" },
    });

    console.log(`${req.params.key} status:`, resp.data.fields?.status?.name, "updated:", resp.data.fields?.updated);
    res.json(resp.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

/**
 * Get available transitions for an issue
 * Response shape: { transitions: [ { id, name, to: { name } } ] }
 */
app.get("/issue/:key/transitions", async (req, res) => {
  try {
    const resp = await axios.get(`${JIRA_BASE_URL}/issue/${req.params.key}/transitions`, authCfg);
    res.json({ transitions: resp.data.transitions || [] });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

/**
 * Apply a transition (change status)
 * Body: { transitionId: "<id>" }
 * Returns the updated issue
 */
app.post("/issue/:key/transition", async (req, res) => {
  try {
    const { transitionId } = req.body;
    const key = req.params.key;

    if (!transitionId) return res.status(400).json({ error: "transitionId required" });

    // apply transition
    await axios.post(
      `${JIRA_BASE_URL}/issue/${key}/transitions`,
      { transition: { id: transitionId } },
      authCfg
    );

    // return fresh issue
    const updated = await axios.get(`${JIRA_BASE_URL}/issue/${key}`, authCfg);
    console.log(`Transition applied on ${key}. New status:`, updated.data.fields?.status?.name);

    res.json({ message: "Transition applied", issue: updated.data });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

app.post("/create-issue", async (req, res) => {
  try {
    const { summary, description, issueType, priority, desiredStatusName } = req.body;

    const createResp = await axios.post(
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
      authCfg
    );

    const issueKey = createResp.data.key;
    console.log("Created issue:", issueKey);

    // If desiredStatusName provided, attempt to transition
    if (desiredStatusName) {
      try {
        const transitionsResp = await axios.get(
          `${JIRA_BASE_URL}/issue/${issueKey}/transitions`,
          authCfg
        );

        const match = (transitionsResp.data.transitions || []).find(
          (t) => t.to && t.to.name === desiredStatusName
        );

        if (match) {
          await axios.post(
            `${JIRA_BASE_URL}/issue/${issueKey}/transitions`,
            { transition: { id: match.id } },
            authCfg
          );
          console.log(`Issue ${issueKey} transitioned to ${desiredStatusName} (id:${match.id})`);
        } else {
          console.warn(`No transition matching "${desiredStatusName}" for ${issueKey}`);
        }
      } catch (err) {
        console.warn("Transition attempt failed:", err.response?.data || err.message);
      }
    }

    // fetch the created (and possibly transitioned) issue to return full fields
    const issueResp = await axios.get(`${JIRA_BASE_URL}/issue/${issueKey}`, authCfg);
    res.json({ message: "Issue created successfully!", data: issueResp.data });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

app.post("/webhook/jira", async (req, res) => {
  try {
    // Example payload includes payload.issue.key
    const payload = req.body;
    const issueKey = payload.issue?.key;
    if (!issueKey) return res.status(400).send("No issue key in webhook payload");

    // fetch fresh issue
    const updated = await axios.get(`${JIRA_BASE_URL}/issue/${issueKey}`, authCfg);

    // for now, just log and respond; you can later broadcast to clients via socket.io
    console.log(`Webhook: issue ${issueKey} updated. New status:`, updated.data.fields?.status?.name);

    res.json({ ok: true });
  } catch (err) {
    console.error("Webhook error:", err.response?.data || err.message);
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

app.get("/user", async (req, res) => {
  try {
    const response = await axios.get(`${JIRA_BASE_URL}/myself`, {
      auth: { username: JIRA_USER, password: JIRA_PASS },
    });

    res.json({
      name: response.data.displayName,
      email: response.data.emailAddress,
      jiraAccountId: response.data.accountId,
      avatar: response.data.avatarUrls["48x48"],
    });
  } catch (error) {
    console.error("Error fetching Jira user:", error.response?.data || error);
    res.status(500).json({ message: "Failed to fetch Jira user" });
  }
});

connectDB();

app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));

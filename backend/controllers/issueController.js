import axios from "axios";

const JIRA_BASE_URL = process.env.JIRA_BASE_URL;
const JIRA_USER = process.env.JIRA_USER;
const JIRA_PASS = process.env.JIRA_PASS;
const PROJECT_KEY = process.env.PROJECT_KEY || "IAI";



export const createIssue = async (req, res) => {
    try {
        const { summary, description, issueType, priority } = req.body;

        const response = await axios.post(
            `${JIRA_BASE_URL}/issue`,
            {
                fields: {
                    project: { key: PROJECT_KEY },
                    summary: summary,
                    description: description,
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
};


export const getIssue = async (req, res) => {
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
};


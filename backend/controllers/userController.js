import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const JIRA_USER = process.env.JIRA_USER;
const JIRA_PASS = process.env.JIRA_PASS;


export const uploadCode = async (req, res) => {
    try {
        const response = await axios.get(
            "http://localhost:8080/rest/api/2/myself",
            {
                auth: {
                    username: JIRA_USER,
                    password: JIRA_PASS,
                },
            }
        );

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
};
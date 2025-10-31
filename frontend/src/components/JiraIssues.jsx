import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


const JiraIssues = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newIssue, setNewIssue] = useState({
    summary: "",
    description: "",
    assignee: "",
    priority: "",
  });

  // Fetch issues
  const fetchIssues = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/issues`, {
        headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
      });
      setIssues(response.data.issues || []);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const handleChange = (e) => {
    setNewIssue({ ...newIssue, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalIssue = {
      ...newIssue,
      priority: newIssue.priority || "Medium",
    };

    try {
      await axios.post(`${API_BASE_URL}/create-issue`, finalIssue);
      fetchIssues(); // refresh issues
      setShowModal(false);
      setNewIssue({ summary: "", description: "", assignee: "", priority: "" }); // reset
    } catch (err) {
      alert(
        "❌ Failed to create issue: " +
        (err.response?.data?.error || err.message)
      );
    }
  };

  if (loading)
    return (
      <div className="text-center text-gray-400 text-lg mt-10">
        Loading issues...
      </div>
    );
  if (error)
    return (
      <div className="text-red-500 text-center text-lg mt-10">
        Error: {error}
      </div>
    );

  return (
    <div className="min-h-screen py-10 px-6 bg-gray-900 text-gray-200">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-indigo-400 mb-6 text-center">
          Jira Issues for Project <span className="text-indigo-300">IN</span>
        </h1>

        {/* Add Issue Button */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-2 rounded-lg font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all duration-300"
          >
            + Add New Issue
          </button>
        </div>

        {/* Issue List */}
        {issues.length === 0 ? (
          <p className="text-center text-gray-400 text-lg">
            No open issues found.
          </p>
        ) : (
          <ul className="space-y-3">
            {issues.map((issue) => (
              <li
                key={issue.key}
                className="bg-gray-800 border border-gray-700 p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold text-gray-200">
                    {issue.key}: {issue.fields.summary}
                  </p>
                  <p className="text-sm text-gray-400">
                    Status:{" "}
                    <span className="font-medium text-indigo-400">
                      {issue.fields.status.name}
                    </span>
                  </p>
                </div>
                <span
                  className={`text-xs px-3 py-1 rounded-full ${issue.fields.priority?.name === "High"
                      ? "bg-red-700 text-red-100"
                      : "bg-indigo-700 text-indigo-100"
                    }`}
                >
                  {issue.fields.priority?.name || "Medium"}
                </span>
              </li>
            ))}
          </ul>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
            <div className="bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-6 relative">
              {/* Close Button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl font-bold"
              >
                ×
              </button>

              <h2 className="text-2xl font-semibold text-indigo-400 mb-4 text-center">
                Add New Issue
              </h2>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="summary"
                  placeholder="Issue Summary"
                  value={newIssue.summary}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none text-gray-200 placeholder-gray-400"
                />
                <textarea
                  name="description"
                  placeholder="Issue Description"
                  value={newIssue.description}
                  onChange={handleChange}
                  required
                  rows="3"
                  className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none text-gray-200 placeholder-gray-400"
                />
                <input
                  type="text"
                  name="assignee"
                  placeholder="Assignee (optional)"
                  value={newIssue.assignee}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none text-gray-200 placeholder-gray-400"
                />

                <select
                  name="priority"
                  value={newIssue.priority}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none text-gray-200"
                >
                  <option value="">Select Priority</option>
                  <option value="Highest">Highest</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                  <option value="Lowest">Lowest</option>
                </select>

                <button
                  type="submit"
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium transition-all duration-300"
                >
                  Create Issue
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JiraIssues;

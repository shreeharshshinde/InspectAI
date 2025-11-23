import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000";

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

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/issues`);
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
    try {
      await axios.post(`${API_BASE_URL}/create-issue`, newIssue);
      fetchIssues();
      setShowModal(false);
      setNewIssue({ summary: "", description: "", assignee: "", priority: "" });
    } catch (err) {
      alert("❌ Failed: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-gray-200 py-10 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-extrabold text-center text-white drop-shadow-lg">
          🚀 InspectAI Jira Board
        </h1>
        <p className="text-center text-indigo-300 mt-2 text-lg">
          Project: <span className="font-semibold text-pink-400">IAI</span>
        </p>

        {/* Add Button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-pink-600 hover:bg-pink-700 font-bold rounded-xl shadow-md hover:shadow-pink-500 transition-all text-white"
          >
            + Create Issue
          </button>
        </div>

        {/* Loading & Error */}
        {loading && (
          <p className="text-center text-gray-300 mt-10 animate-pulse text-lg">
            Loading issues...
          </p>
        )}
        {error && (
          <p className="text-center text-red-400 font-semibold mt-10 text-lg">
            Error: {error}
          </p>
        )}

        {/* Issue List */}
        {!loading && issues.length > 0 && (
          <ul className="mt-10 space-y-4">
            {issues.map((issue) => (
              <li
                key={issue.key}
                className="bg-white bg-opacity-10 backdrop-blur-md p-5 rounded-xl shadow-lg border border-white/10 hover:border-pink-400 transition-all duration-200"
              >
                <p className="text-lg font-semibold text-white">
                  {issue.key} — {issue.fields.summary}
                </p>

                <div className="flex justify-between items-center mt-1">
                  <p className="text-sm text-gray-300">
                    Status:{" "}
                    <span className="text-green-300 font-semibold">
                      {issue.fields.status.name}
                    </span>
                  </p>

                  <span
                    className={`text-xs px-3 py-1 rounded-full font-semibold ${
                      issue.fields.priority?.name === "High"
                        ? "bg-red-600 text-white"
                        : "bg-gray-700 text-gray-200"
                    }`}
                  >
                    {issue.fields.priority?.name || "Medium"}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}

        {!loading && issues.length === 0 && (
          <p className="text-center text-gray-300 mt-16 text-lg">
            🎉 No open issues! You’re awesome.
          </p>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
            <div className="bg-blue-900/80 backdrop-blur-lg p-8 rounded-xl w-full max-w-md border border-white/20">
              <h2 className="text-2xl text-pink-400 font-bold text-center mb-4">
                Create Issue
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {["summary", "description", "assignee"].map((field) => (
                  <input
                    key={field}
                    type="text"
                    name={field}
                    value={newIssue[field]}
                    onChange={handleChange}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-pink-400 text-white"
                    required={field !== "assignee"}
                  />
                ))}

                <select
                  name="priority"
                  value={newIssue.priority}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-white/10 border border-white/20 focus:ring-2 focus:ring-indigo-400 text-white"
                >
                  <option value="">Priority</option>
                  {["Highest", "High", "Medium", "Low", "Lowest"].map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-green-500 hover:bg-green-600 py-2 rounded-lg font-bold"
                  >
                    ✔ Create
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 py-2 rounded-lg font-bold"
                  >
                    ✖ Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JiraIssues;

import React, { useState } from "react";
import axios from "axios";

const RaiseIssue = () => {
  const [issue, setIssue] = useState({
    summary: "",
    description: "",
    issueType: "Task",
    priority: "Medium",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setIssue({ ...issue, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post("http://localhost:5000/create-issue", issue);
      setMessage("✅ Issue created successfully!");
      setIssue({
        summary: "",
        description: "",
        issueType: "Task",
        priority: "Medium",
      });
    } catch (err) {
      console.error("Error creating issue:", err.response?.data || err.message);
      setMessage("❌ Failed to create issue. Check your Jira connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center justify-center px-6 py-4">
      <div className="w-full max-w-2xl bg-gray-800 border border-gray-700 p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-indigo-400 mb-6 text-center">
          Raise a New Issue 🚀
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Summary */}
          <div>
            <label className="block mb-2 text-sm text-gray-400">Summary</label>
            <input
              type="text"
              name="summary"
              value={issue.summary}
              onChange={handleChange}
              required
              placeholder="Enter issue title..."
              className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none text-gray-200 placeholder-gray-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-2 text-sm text-gray-400">Description</label>
            <textarea
              name="description"
              value={issue.description}
              onChange={handleChange}
              required
              rows="4"
              placeholder="Describe the issue in detail..."
              className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none text-gray-200 placeholder-gray-500"
            />
          </div>

          {/* Issue Type */}
          <div>
            <label className="block mb-2 text-sm text-gray-400">Issue Type</label>
            <select
              name="issueType"
              value={issue.issueType}
              onChange={handleChange}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none text-gray-200"
            >
              <option value="Task">Task</option>
              <option value="Bug">Bug</option>
              <option value="Story">Story</option>
              <option value="Epic">Epic</option>
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block mb-2 text-sm text-gray-400">Priority</label>
            <select
              name="priority"
              value={issue.priority}
              onChange={handleChange}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-indigo-400 focus:outline-none text-gray-200"
            >
              <option value="Highest">Highest</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
              <option value="Lowest">Lowest</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold transition-all duration-300"
          >
            {loading ? "Creating Issue..." : "Create Issue"}
          </button>
        </form>

        {/* Result Message */}
        {message && (
          <p
            className={`mt-5 text-center font-medium ${
              message.includes("✅") ? "text-green-400" : "text-red-400"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default RaiseIssue;
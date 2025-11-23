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
      setMessage("success: Issue created successfully!");
      setIssue({
        summary: "",
        description: "",
        issueType: "Task",
        priority: "Medium",
      });
    } catch (err) {
      console.error("Error creating issue:", err.response?.data || err.message);
      setMessage("error: Failed to create issue. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Highest": return "bg-red-500";
      case "High": return "bg-orange-500";
      case "Medium": return "bg-yellow-500";
      case "Low": return "bg-green-500";
      case "Lowest": return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  const getIssueTypeIcon = (type) => {
    switch (type) {
      case "Bug": return "🐛";
      case "Story": return "📖";
      case "Epic": return "🎯";
      case "Task": return "✅";
      default: return "📝";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
              <span className="text-white font-bold text-xl">+</span>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Create New Issue
            </h1>
          </div>
          <p className="text-gray-400 text-lg">
            Quickly raise and track new tasks, bugs, or stories
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-6 border-b border-slate-600">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">📋</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Issue Details</h2>
                <p className="text-gray-400 text-sm">Fill in the required information below</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Summary Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300 flex items-center">
                <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded mr-2">Required</span>
                Issue Title
              </label>
              <input
                type="text"
                name="summary"
                value={issue.summary}
                onChange={handleChange}
                required
                placeholder="What needs to be done? e.g., 'Fix login page responsive layout'"
                className="w-full p-4 bg-slate-900 border border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-white placeholder-gray-500 transition-all duration-300"
              />
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300 flex items-center">
                <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded mr-2">Required</span>
                Description
              </label>
              <textarea
                name="description"
                value={issue.description}
                onChange={handleChange}
                required
                rows="5"
                placeholder="Describe the issue in detail. Include steps to reproduce, expected behavior, and actual behavior..."
                className="w-full p-4 bg-slate-900 border border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-white placeholder-gray-500 resize-none transition-all duration-300"
              />
            </div>

            {/* Type and Priority Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Issue Type */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Issue Type
                </label>
                <div className="relative">
                  <select
                    name="issueType"
                    value={issue.issueType}
                    onChange={handleChange}
                    className="w-full p-4 bg-slate-900 border border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-white appearance-none transition-all duration-300"
                  >
                    <option value="Task">Task</option>
                    <option value="Bug">Bug</option>
                    <option value="Story">Story</option>
                    <option value="Epic">Epic</option>
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <span className="text-lg">{getIssueTypeIcon(issue.issueType)}</span>
                  </div>
                </div>
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Priority
                </label>
                <div className="relative">
                  <select
                    name="priority"
                    value={issue.priority}
                    onChange={handleChange}
                    className="w-full p-4 bg-slate-900 border border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-white appearance-none transition-all duration-300"
                  >
                    <option value="Highest">Highest</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                    <option value="Lowest">Lowest</option>
                  </select>
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className={`w-3 h-3 rounded-full ${getPriorityColor(issue.priority)}`}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Card */}
            {(issue.summary || issue.description) && (
              <div className="bg-slate-700/50 border border-slate-600 rounded-xl p-4 mt-4">
                <h3 className="text-sm font-medium text-gray-300 mb-3">Preview</h3>
                <div className="space-y-2">
                  {issue.summary && (
                    <div className="flex items-start space-x-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span className="text-white text-sm">{issue.summary}</span>
                    </div>
                  )}
                  {issue.description && (
                    <div className="flex items-start space-x-2">
                      <span className="text-gray-500 mt-1">•</span>
                      <span className="text-gray-400 text-sm">{issue.description}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Issue...</span>
                </>
              ) : (
                <>
                  <span>🚀</span>
                  <span>Create Issue</span>
                </>
              )}
            </button>
          </form>

          {/* Result Message */}
          {message && (
            <div className={`px-6 pb-6 ${message.startsWith("success:") ? 'animate-pulse' : ''}`}>
              <div className={`p-4 rounded-xl border ${
                message.startsWith("success:") 
                  ? 'bg-green-500/20 border-green-500 text-green-400' 
                  : 'bg-red-500/20 border-red-500 text-red-400'
              }`}>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">
                    {message.startsWith("success:") ? '✅' : '❌'}
                  </span>
                  <span className="font-medium">
                    {message.replace(/^(success|error):\s*/, "")}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Tips */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            💡 Tip: Be specific and include reproduction steps for bugs
          </p>
        </div>
      </div>
    </div>
  );
};

export default RaiseIssue;
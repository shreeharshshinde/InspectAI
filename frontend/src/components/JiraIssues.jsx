
import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  FiPlus, 
  FiAlertCircle, 
  FiCheckCircle, 
  FiClock, 
  FiUser, 
  FiX,
  FiTrendingUp,
  FiArchive,
  FiFlag,
  FiList
} from "react-icons/fi";

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
      fetchIssues();
      setShowModal(false);
      setNewIssue({ summary: "", description: "", assignee: "", priority: "" });
    } catch (err) {
      alert(
        "❌ Failed to create issue: " +
        (err.response?.data?.error || err.message)
      );
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Highest": return "bg-gradient-to-r from-pink-500 to-rose-600 border-pink-500/30";
      case "High": return "bg-gradient-to-r from-amber-500 to-yellow-600 border-amber-500/30";
      case "Medium": return "bg-gradient-to-r from-purple-500 to-indigo-600 border-purple-500/30";
      case "Low": return "bg-gradient-to-r from-blue-500 to-cyan-600 border-blue-500/30";
      case "Lowest": return "bg-gradient-to-r from-gray-500 to-slate-600 border-gray-500/30";
      default: return "bg-gradient-to-r from-purple-500 to-indigo-600 border-purple-500/30";
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "Highest": return <FiFlag className="text-pink-300" />;
      case "High": return <FiAlertCircle className="text-amber-300" />;
      case "Medium": return <FiClock className="text-purple-300" />;
      case "Low": return <FiTrendingUp className="text-blue-300" />;
      case "Lowest": return <FiArchive className="text-gray-300" />;
      default: return <FiClock className="text-purple-300" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Done": return "bg-green-500/20 text-green-300 border-green-500/30";
      case "In Progress": return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "To Do": return "bg-gray-500/20 text-gray-300 border-gray-500/30";
      default: return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-3 text-gray-400">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-pink-500 border-t-transparent"></div>
          <span className="text-lg">Loading issues...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <FiAlertCircle className="text-pink-400 text-4xl mx-auto mb-3" />
          <p className="text-pink-300 text-lg">Error loading issues</p>
          <p className="text-gray-400 text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 h-full overflow-hidden">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-3 rounded-2xl shadow-lg">
            <FiList className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-200 to-purple-200 bg-clip-text text-transparent">
              Jira Issues
            </h1>
            <p className="text-gray-400 mt-1">Project IN - Issue Tracking</p>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-6">
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 hover:border-pink-500/30 transition-colors">
            <div className="text-2xl font-bold text-pink-100">{issues.length}</div>
            <div className="text-xs text-gray-400">Total Issues</div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 hover:border-yellow-500/30 transition-colors">
            <div className="text-2xl font-bold text-yellow-100">
              {issues.filter(issue => issue.fields.status.name === "In Progress").length}
            </div>
            <div className="text-xs text-gray-400">In Progress</div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 hover:border-green-500/30 transition-colors">
            <div className="text-2xl font-bold text-green-100">
              {issues.filter(issue => issue.fields.status.name === "Done").length}
            </div>
            <div className="text-xs text-gray-400">Completed</div>
          </div>
        </div>
      </div>

  

      {/* Issues List */}
      {issues.length === 0 ? (
        <div className="text-center py-16 bg-gray-800/30 rounded-2xl border border-gray-700/50">
          <FiCheckCircle className="text-green-400 text-4xl mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-300 mb-2">No Issues Found</h3>
          <p className="text-gray-400">Get started by creating your first issue</p>
        </div>
      ) : (
        <div className="space-y-4 max-w-4xl mx-auto max-h-96 overflow-y-auto custom-scrollbar">
          {issues.map((issue) => (
            <div
              key={issue.key}
              className="bg-gray-800/30 rounded-xl border border-gray-700/50 p-6 
              hover:border-pink-500/30 transition-all duration-300 group hover:shadow-lg"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border 
                      ${getPriorityColor(issue.fields.priority?.name)} text-white text-sm font-medium`}>
                      {getPriorityIcon(issue.fields.priority?.name)}
                      {issue.fields.priority?.name || "Medium"}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(issue.fields.status.name)}`}>
                      {issue.fields.status.name}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-200 mb-2 group-hover:text-pink-100 transition-colors">
                    {issue.key}: {issue.fields.summary}
                  </h3>
                  
                  {issue.fields.description && (
                    <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                      {issue.fields.description}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    {issue.fields.assignee && (
                      <div className="flex items-center gap-1">
                        <FiUser className="text-gray-400" />
                        <span>{issue.fields.assignee.displayName}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <FiClock className="text-gray-400" />
                      <span>Created: {new Date(issue.fields.created).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

     

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(55, 65, 81, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.4);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.6);
        }
      `}</style>
    </div>
  );
};

export default JiraIssues;

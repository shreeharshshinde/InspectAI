import React, { useState } from "react";
import axios from "axios";

const CodeReview = () => {
  const [formData, setFormData] = useState({
    title: "",
    language: "",
    content: "",
  });
  const [reviewResult, setReviewResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit code for review
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setReviewResult(null);

    try {
      // Send to backend (you’ll later create /review endpoint)
      const response = await axios.post("http://localhost:5000/review", formData);
      setReviewResult(response.data.review || "✅ Code review generated successfully!");
    } catch (err) {
      setReviewResult("❌ Failed to generate code review.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 text-gray-200 p-4">
      <div className="max-w-3xl mx-auto bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-700">
        <h1 className="text-3xl font-bold text-indigo-400 mb-6 text-center">
          Code Review Assistant
        </h1>

        {/* Code Review Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-400">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none text-gray-200"
              placeholder="Enter code title..."
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-400">Language</label>
            <select
              name="language"
              value={formData.language}
              onChange={handleChange}
              required
              className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none text-gray-200"
            >
              <option value="">Select a language</option>
              <option value="JavaScript">JavaScript</option>
              <option value="Python">Python</option>
              <option value="C++">C++</option>
              <option value="Java">Java</option>
              <option value="C">C</option>
              <option value="TypeScript">TypeScript</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-400">Content</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows="8"
              className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none text-gray-200"
              placeholder="Paste your code here..."
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition-all duration-300"
          >
            {loading ? "Analyzing Code..." : "Submit for Review"}
          </button>
        </form>

        {/* Review Result */}
        {reviewResult && (
          <div className="mt-8 bg-gray-900 border border-gray-700 rounded-lg p-4 text-gray-300">
            <h2 className="text-lg font-semibold text-indigo-400 mb-2">Review Result:</h2>
            <pre className="whitespace-pre-wrap">{reviewResult}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeReview;

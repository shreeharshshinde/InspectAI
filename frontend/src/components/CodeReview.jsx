import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiCode,
  FiStar,
  FiUser,
  FiClock,
  FiCopy,
  FiCheck,
  FiAlertCircle,
  FiCheckCircle,
  FiZap
} from "react-icons/fi";

const CodeReview = () => {
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("");
  const [content, setContent] = useState("");
  const [reviewResult, setReviewResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [codeId, setCodeId] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [copied, setCopied] = useState(false);

  const copyCodeId = () => {
    if (!codeId) return;
    navigator.clipboard.writeText(codeId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getRatingColor = (rating) => {
    if (rating >= 8) return "text-aurora-green";
    if (rating >= 6) return "text-aurora-yellow";
    if (rating >= 4) return "text-aurora-orange";
    return "text-aurora-red";
  };

  const getRatingBg = (rating) => {
    if (rating >= 8) return "bg-aurora-green-soft border-aurora-green-soft";
    if (rating >= 6) return "bg-aurora-yellow-soft border-aurora-yellow-soft";
    if (rating >= 4) return "bg-aurora-orange-soft border-aurora-orange-soft";
    return "bg-aurora-red-soft border-aurora-red-soft";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setReviewResult(null);
    setReviews([]);

    try {
      const uploadRes = await axios.post("http://localhost:5000/api/code/upload", {
        title,
        language,
        content,
      });

      const uploadedCode = uploadRes.data;
      const newCodeId = uploadedCode._id;
      setCodeId(newCodeId);

      await axios.post("http://localhost:5000/api/review/generateReviewG", {
        codeId: newCodeId,
      });

      // short delay for backend persistence
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const reviewFetchRes = await axios.get(
        `http://localhost:5000/api/review/${newCodeId}`
      );

      const fetchedReviews = reviewFetchRes.data;
      setReviews(fetchedReviews);

      if (fetchedReviews.length > 0) {
        const latestReview = fetchedReviews[fetchedReviews.length - 1];
        setReviewResult(latestReview.feedback);
      } else {
        setReviewResult("✅ Code uploaded, but no review found.");
      }
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      setReviewResult("❌ Failed to upload or review code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen aurora-bg p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header card */}
        <div className="card-aurora p-4 rounded-2xl border-aurora/20 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-md hover:bg-aurora-hover transition"
              >
                <FiArrowLeft className="text-white" />
                <span className="text-sm text-white">Back to Dashboard</span>
              </Link>
              <div className="flex items-center gap-3 ml-2">
                <div className="logo-aurora w-11 h-11 flex items-center justify-center">
                  <FiCode className="text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-white">Code Review</h1>
                  <p className="text-xs text-white">AI-Powered Code Analysis</p>
                </div>
              </div>
            </div>

            <div className="text-right text-white text-sm">
              <div>InspectAI</div>
              <div className="text-xs">v2.1.0</div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="stat-card flex items-center gap-4 p-4">
            <div className="stat-icon bg-aurora-blue-soft">
              <FiCode className="text-aurora-blue" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{reviews.length}</p>
              <p className="text-xs text-white">Reviews Generated</p>
            </div>
          </div>

          <div className="stat-card flex items-center gap-4 p-4">
            <div className="stat-icon bg-aurora-green-soft">
              <FiCheckCircle className="text-aurora-green" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {reviews.filter((r) => r.rating >= 7).length}
              </p>
              <p className="text-xs text-white">High Quality Code</p>
            </div>
          </div>

          <div className="stat-card flex items-center gap-4 p-4">
            <div className="stat-icon bg-aurora-yellow-soft">
              <FiZap className="text-aurora-yellow" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {(
                  reviews.reduce((acc, curr) => acc + (curr.rating || 0), 0) /
                  (reviews.length || 1)
                ).toFixed(1)}
              </p>
              <p className="text-xs text-white">Avg Rating</p>
            </div>
          </div>
        </div>

        {/* Upload form */}
        <div className="card-aurora p-6 rounded-2xl border-aurora/20 mb-6">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-semibold text-white">AI Code Review</h2>
            <p className="text-sm text-white">Get intelligent feedback on your code</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-white mb-2 block flex items-center gap-2">
                  <FiUser className="text-aurora-blue" /> Project Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="Enter project title..."
                  className="input-aurora"
                />
              </div>

              <div>
                <label className="text-xs text-white mb-2 block flex items-center gap-2">
                  <FiCode className="text-aurora-purple" /> Programming Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  required
                  className="input-aurora"
                >
                  <option value="">Select a language</option>
                  <option value="JavaScript"  className="text-black">JavaScript</option>
                  <option value="Python"  className="text-black">Python</option>
                  <option value="C++"  className="text-black">C++</option>
                  <option value="Java"  className="text-black">Java</option>
                  <option value="C"  className="text-black">C</option>
                  <option value="TypeScript"  className="text-black">TypeScript</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-white mb-2 block flex items-center gap-2">
                <FiCode className="text-aurora-blue" /> Code Content
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows="12"
                placeholder="Paste your code here for AI analysis..."
                className="input-aurora font-mono text-sm min-h-[220px] whitespace-pre-wrap"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="btn-aurora w-full"
              >
                {loading ? (
                  <>
                    <div className="loader-aurora mr-2" />
                    Analyzing Code...
                  </>
                ) : (
                  <>
                    <FiCode />
                    <span className="text-white">Submit for AI Review</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Reviews results */}
        {reviews.length > 0 && (
          <div className="card-aurora p-6 rounded-2xl border-aurora/20 mb-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-white">Review Results</h3>
              <p className="text-sm text-white">AI-generated feedback and analysis</p>
            </div>

            <div className="space-y-4">
              {reviews.map((rev, idx) => (
                <div key={rev._id || idx} className="rounded-xl p-4 border border-aurora/10 bg-transparent">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${getRatingBg(rev.rating)}`}>
                        <FiStar className={`text-lg ${getRatingColor(rev.rating)}`} />
                      </div>
                      <div>
                        <span className={`text-sm font-semibold ${getRatingColor(rev.rating)}`}>
                          Rating: {rev.rating}/10
                        </span>
                        <div className="mt-1">
                          <span className="text-xs px-2 py-1 bg-gray-900 rounded-full text-white">
                            {rev.reviewType === "AI" ? "🤖 AI Generated" : "👤 Manual Review"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-white flex items-center gap-2">
                      <FiClock />
                      {new Date(rev.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <div className="bg-gray-900/30 rounded-lg p-4 border border-aurora/6">
                    <pre className="whitespace-pre-wrap text-sm text-white leading-relaxed">
                      {rev.feedback}
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Code ID and status */}
        {codeId && (
          <div className="card-aurora p-4 rounded-xl border-aurora/20 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FiCheckCircle className="text-aurora-green text-xl" />
              <div>
                <p className="text-sm font-semibold text-white">Code ID</p>
                <p className="text-xs text-white font-mono">{codeId}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={copyCodeId}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-md hover:bg-aurora-hover transition"
              >
                {copied ? <FiCheck className="text-aurora-green" /> : <FiCopy className="text-white" />}
                <span className="text-sm text-white">{copied ? "Copied!" : "Copy ID"}</span>
              </button>
            </div>
          </div>
        )}

        {/* status message if no reviews */}
        {reviewResult && reviews.length === 0 && (
          <div className="card-aurora p-4 rounded-xl border-aurora/20">
            <div className="flex items-center gap-3">
              <FiAlertCircle className="text-aurora-yellow" />
              <div>
                <p className="text-sm font-semibold text-white">Status</p>
                <p className="text-xs text-white">{reviewResult}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CodeReview;

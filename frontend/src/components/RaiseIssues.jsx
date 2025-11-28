// import React, { useState } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import {
//   FiArrowLeft,
//   FiAlertCircle,
//   FiFlag,
//   FiFileText,
//   FiSend,
//   FiCheckCircle,
//   FiXCircle,
//   FiType,
//   FiBarChart2
// } from "react-icons/fi";

// const RaiseIssue = () => {
//   const [issue, setIssue] = useState({
//     summary: "",
//     description: "",
//     issueType: "Task",
//     priority: "Medium",
//   });
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");

//   const handleChange = (e) => {
//     setIssue({ ...issue, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage("");

//     try {
//       await axios.post("http://localhost:5000/create-issue", issue);
//       setMessage("✅ Issue created successfully!");
//       setIssue({
//         summary: "",
//         description: "",
//         issueType: "Task",
//         priority: "Medium",
//       });
//     } catch (err) {
//       console.error("Error creating issue:", err.response?.data || err.message);
//       setMessage("❌ Failed to create issue. Check your Jira connection.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const success = message.includes("✅");

//   return (
//     <div className="min-h-screen aurora-bg p-6">
//       <div className="max-w-3xl mx-auto">
//         <div className="card-aurora p-6 rounded-2xl border-aurora/20">
//           {/* Header */}
//           <div className="flex items-center gap-4 mb-6">
//             <Link
//               to="/"
//               className="inline-flex items-center gap-2 px-3 py-2 rounded-md hover:bg-aurora-hover transition"
//             >
//               <FiArrowLeft className="text-aurora-muted" />
//               <span className="text-sm text-aurora-muted">Back to Dashboard</span>
//             </Link>

//             <div className="ml-auto flex items-center gap-3">
//               <div className="w-12 h-12 rounded-lg logo-aurora flex items-center justify-center">
//                 <FiFlag className="text-white" />
//               </div>
//               <div>
//                 <h2 className="text-lg font-semibold">Raise Issue</h2>
//                 <p className="text-xs text-aurora-muted">Create new project issues</p>
//               </div>
//             </div>
//           </div>

//           {/* Form */}
//           <div className="mb-6 text-center">
//             <div className="w-16 h-16 rounded-lg mx-auto mb-3 flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500">
//               <FiAlertCircle className="text-white text-2xl" />
//             </div>
//             <h3 className="text-2xl font-bold mb-1 text-white">Raise New Issue</h3>
//             <p className="text-sm text-aurora-muted">Create and track new project issues</p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-5">
//             {/* Summary */}
//             <div>
//               <label className="text-sm text-aurora-muted mb-2 block flex items-center gap-2">
//                 <FiFileText /> Issue Summary
//               </label>
//               <input
//                 name="summary"
//                 value={issue.summary}
//                 onChange={handleChange}
//                 required
//                 placeholder="What's the issue about?"
//                 className="input-aurora"
//               />
//             </div>

//             {/* Description */}
//             <div>
//               <label className="text-sm text-aurora-muted mb-2 block flex items-center gap-2">
//                 <FiType /> Description
//               </label>
//               <textarea
//                 name="description"
//                 value={issue.description}
//                 onChange={handleChange}
//                 required
//                 rows="5"
//                 placeholder="Describe the issue in detail..."
//                 className="input-aurora min-h-[120px] resize-y"
//               />
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="text-sm text-aurora-muted mb-2 block flex items-center gap-2">
//                   <FiBarChart2 /> Issue Type
//                 </label>
//                 <select
//                   name="issueType"
//                   value={issue.issueType}
//                   onChange={handleChange}
//                   className="input-aurora"
//                 >
//                   <option value="Task"  className="text-black">📝 Task</option>
//                   <option value="Bug"  className="text-black">🐛 Bug</option>
//                   <option value="Story"  className="text-black">📖 Story</option>
//                   <option value="Epic"  className="text-black">🎯 Epic</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="text-sm text-aurora-muted mb-2 block flex items-center gap-2">
//                   <FiFlag /> Priority
//                 </label>
//                 <select
//                   name="priority"
//                   value={issue.priority}
//                   onChange={handleChange}
//                   className="input-aurora"
//                 >
//                   <option value="Highest"  className="text-black">🔴 Highest</option>
//                   <option value="High"  className="text-black">🟠 High</option>
//                   <option value="Medium"  className="text-black">🔵 Medium</option>
//                   <option value="Low"  className="text-black">🟢 Low</option>
//                   <option value="Lowest"  className="text-black">⚪ Lowest</option>
//                 </select>
//               </div>
//             </div>

//             {/* Submit */}
//             <div>
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="btn-aurora w-full"
//               >
//                 {loading ? (
//                   <>
//                     <div className="loader-aurora mr-2" />
//                     Creating Issue...
//                   </>
//                 ) : (
//                   <>
//                     <FiSend className="mr-2" />
//                     Create Issue
//                   </>
//                 )}
//               </button>
//             </div>
//           </form>

//           {/* Message */}
//           {message && (
//             <div className={`mt-5 p-4 rounded-lg border ${success ? "bg-emerald-800/20 border-aurora-green" : "bg-rose-800/18 border-aurora-red"}`}>
//               <div className="flex items-start gap-3">
//                 {success ? (
//                   <FiCheckCircle className="text-aurora-green text-xl" />
//                 ) : (
//                   <FiXCircle className="text-aurora-red text-xl" />
//                 )}
//                 <div>
//                   <p className="font-medium">{message}</p>
//                   {success && <p className="text-xs text-aurora-muted mt-1">Issue has been created and tracked.</p>}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Preview */}
//           {(issue.summary || issue.description) && (
//             <div className="preview-card mt-6">
//               <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
//                 <FiFileText /> Issue Preview
//               </h4>
//               <div className="text-aurora-muted">
//                 {issue.summary && <p className="font-medium text-white">{issue.summary}</p>}
//                 {issue.description && <p className="mt-1 text-sm">{issue.description}</p>}
//                 <div className="mt-3 text-xs flex gap-4 text-aurora-muted">
//                   <span>Type: {issue.issueType}</span>
//                   <span>Priority: {issue.priority}</span>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RaiseIssue;


import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  FiArrowLeft,
  FiAlertCircle,
  FiFlag,
  FiFileText,
  FiSend,
  FiCheckCircle,
  FiXCircle,
  FiType,
  FiBarChart2
} from "react-icons/fi";

const RaiseIssue = () => {
  const [issue, setIssue] = useState({
    summary: "",
    description: "",
    issueType: "Task",
    priority: "Medium",
    status: "To Do", // <-- new status field
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [createdIssueKey, setCreatedIssueKey] = useState(null);

  const handleChange = (e) => {
    setIssue({ ...issue, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setCreatedIssueKey(null);

    try {
      // include desiredStatusName so server will try to transition after create
      const payload = {
        summary: issue.summary,
        description: issue.description,
        issueType: issue.issueType,
        priority: issue.priority,
        desiredStatusName: issue.status,
      };

      const resp = await axios.post("http://localhost:5000/create-issue", payload);
      // server returns created issue in resp.data.data (based on server code)
      const created = resp.data?.data;
      const key = created?.key || created?.id || null;

      setMessage("✅ Issue created successfully!");
      setCreatedIssueKey(key || created?.fields?.summary || null);

      setIssue({
        summary: "",
        description: "",
        issueType: "Task",
        priority: "Medium",
        status: "To Do",
      });
    } catch (err) {
      console.error("Error creating issue:", err.response?.data || err.message);
      setMessage("❌ Failed to create issue. Check your Jira connection.");
    } finally {
      setLoading(false);
    }
  };

  const success = message.includes("✅");

  return (
    <div className="min-h-screen aurora-bg p-6">
      <div className="max-w-3xl mx-auto">
        <div className="card-aurora p-6 rounded-2xl border-aurora/20">
          <div className="flex items-center gap-4 mb-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md hover:bg-aurora-hover transition"
            >
              <FiArrowLeft className="text-aurora-muted" />
              <span className="text-sm text-aurora-muted">Back to Dashboard</span>
            </Link>

            <div className="ml-auto flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg logo-aurora flex items-center justify-center">
                <FiFlag className="text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Raise Issue</h2>
                <p className="text-xs text-aurora-muted">Create new project issues</p>
              </div>
            </div>
          </div>

          <div className="mb-6 text-center">
            <div className="w-16 h-16 rounded-lg mx-auto mb-3 flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500">
              <FiAlertCircle className="text-white text-2xl" />
            </div>
            <h3 className="text-2xl font-bold mb-1 text-white">Raise New Issue</h3>
            <p className="text-sm text-aurora-muted">Create and track new project issues</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm text-aurora-muted mb-2 block flex items-center gap-2">
                <FiFileText /> Issue Summary
              </label>
              <input
                name="summary"
                value={issue.summary}
                onChange={handleChange}
                required
                placeholder="What's the issue about?"
                className="input-aurora"
              />
            </div>

            <div>
              <label className="text-sm text-aurora-muted mb-2 block flex items-center gap-2">
                <FiType /> Description
              </label>
              <textarea
                name="description"
                value={issue.description}
                onChange={handleChange}
                required
                rows="5"
                placeholder="Describe the issue in detail..."
                className="input-aurora min-h-[120px] resize-y"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-aurora-muted mb-2 block flex items-center gap-2">
                  <FiBarChart2 /> Issue Type
                </label>
                <select
                  name="issueType"
                  value={issue.issueType}
                  onChange={handleChange}
                  className="input-aurora"
                >
                  <option value="Task" className="text-black ">Task</option>
                  <option value="Bug" className="text-black ">Bug</option>
                  <option value="Story" className="text-black ">Story</option>
                  <option value="Epic" className="text-black ">Epic</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-aurora-muted mb-2 block flex items-center gap-2">
                  <FiFlag /> Priority
                </label>
                <select
                  name="priority"
                  value={issue.priority}
                  onChange={handleChange}
                  className="input-aurora"
                >
                  <option value="Highest" className="text-black ">Highest</option>
                  <option value="High" className="text-black ">High</option>
                  <option value="Medium" className="text-black ">Medium</option>
                  <option value="Low" className="text-black ">Low</option>
                  <option value="Lowest" className="text-black ">Lowest</option>
                </select>
              </div>

              <div>
                <label className="  text-sm text-aurora-muted mb-2 block flex items-center gap-2">
                  <FiFlag /> Desired Status
                </label>
                <select 
                  name="status"
                  value={issue.status}
                  onChange={handleChange}
                  className="input-aurora "
                >
                  <option value="To Do"  className="text-black ">To Do</option>
                  <option value="In Progress" className="text-black ">In Progress</option>
                  <option value="Done" className="text-black ">Done</option>
                </select>
              </div>
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
                    Creating Issue...
                  </>
                ) : (
                  <>
                    <FiSend className="mr-2" />
                    Create Issue
                  </>
                )}
              </button>
            </div>
          </form>

          {message && (
            <div className={`mt-5 p-4 rounded-lg border ${success ? "bg-emerald-800/20 border-aurora-green" : "bg-rose-800/18 border-aurora-red"}`}>
              <div className="flex items-start gap-3">
                {success ? (
                  <FiCheckCircle className="text-aurora-green text-xl" />
                ) : (
                  <FiXCircle className="text-aurora-red text-xl" />
                )}
                <div>
                  <p className="font-medium">{message}</p>
                  {success && createdIssueKey && (
                    <p className="text-xs text-aurora-muted mt-1">Created: {createdIssueKey}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {(issue.summary || issue.description) && (
            <div className="preview-card mt-6">
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <FiFileText /> Issue Preview
              </h4>
              <div className="text-aurora-muted">
                {issue.summary && <p className="font-medium text-white">{issue.summary}</p>}
                {issue.description && <p className="mt-1 text-sm">{issue.description}</p>}
                <div className="mt-3 text-xs flex gap-4 text-aurora-muted">
                  <span>Type: {issue.issueType}</span>
                  <span>Priority: {issue.priority}</span>
                  <span>Status: {issue.status}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RaiseIssue;

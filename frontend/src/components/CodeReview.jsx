
// import React, { useState } from "react";
// import axios from "axios";

// const CodeReview = () => {
//   const [title, setTitle] = useState("");
//   const [language, setLanguage] = useState("");
//   const [content, setContent] = useState("");
//   const [reviewResult, setReviewResult] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [codeId, setCodeId] = useState(null);

//   // Submit code and trigger AI review flow
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setReviewResult(null);

//     try {
//       // STEP 1: Upload code
//       const uploadRes = await axios.post("http://localhost:5000/api/code/upload", {
//         title,
//         language,
//         content,
//       });

//       const uploadedCode = uploadRes.data;
//       const newCodeId = uploadedCode._id;
//       setCodeId(newCodeId);

//       // STEP 2: Generate Gemini Review
//       const reviewGenRes = await axios.post(
//         "http://localhost:5000/api/review/generateReviewG",
//         { codeId: newCodeId }
//       );

//       console.log("Generated Review:", reviewGenRes.data);

//       // STEP 3: Fetch all reviews for this code
//       const reviewFetchRes = await axios.get(
//         `http://localhost:5000/api/review/${newCodeId}`
//       );

//       console.log("Fetched Reviews:", reviewFetchRes.data);

//       // Display review feedback
//       if (reviewFetchRes.data && reviewFetchRes.data.length > 0) {
//         const latestReview = reviewFetchRes.data[reviewFetchRes.data.length - 1];
//         setReviewResult(latestReview.feedback);
//       } else {
//         setReviewResult("✅ Code uploaded, but no review found.");
//       }
//     } catch (err) {
//       console.error("Error:", err.response?.data || err.message);
//       setReviewResult("❌ Failed to upload or review code.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="bg-gray-900 text-gray-200 p-4 min-h-screen">
//       <div className="max-w-3xl mx-auto bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-700">
//         <h1 className="text-3xl font-bold text-indigo-400 mb-6 text-center">
//           Code Review Assistant
//         </h1>

//         {/* Code Upload Form */}
//         <form onSubmit={handleSubmit} className="space-y-5">
//           {/* Title Field */}
//           <div>
//             <label className="block mb-2 text-sm font-medium text-gray-400">
//               Title
//             </label>
//             <input
//               type="text"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               required
//               className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg 
//               focus:ring-2 focus:ring-indigo-400 focus:outline-none text-gray-200"
//               placeholder="Enter code title..."
//             />
//           </div>

//           {/* Language Field */}
//           <div>
//             <label className="block mb-2 text-sm font-medium text-gray-400">
//               Language
//             </label>
//             <select
//               value={language}
//               onChange={(e) => setLanguage(e.target.value)}
//               required
//               className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg 
//               focus:ring-2 focus:ring-indigo-400 focus:outline-none text-gray-200"
//             >
//               <option value="">Select a language</option>
//               <option value="JavaScript">JavaScript</option>
//               <option value="Python">Python</option>
//               <option value="C++">C++</option>
//               <option value="Java">Java</option>
//               <option value="C">C</option>
//               <option value="TypeScript">TypeScript</option>
//             </select>
//           </div>

//           {/* Code Content */}
//           <div>
//             <label className="block mb-2 text-sm font-medium text-gray-400">
//               Content
//             </label>
//             <textarea
//               value={content}
//               onChange={(e) => setContent(e.target.value)}
//               required
//               rows="8"
//               className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg 
//               focus:ring-2 focus:ring-indigo-400 focus:outline-none text-gray-200"
//               placeholder="Paste your code here..."
//             ></textarea>
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-indigo-600 hover:bg-indigo-700 
//             text-white font-semibold py-2 rounded-lg transition-all duration-300"
//           >
//             {loading ? "Processing..." : "Submit for AI Review"}
//           </button>
//         </form>

//         {/* Review Result */}
//         {reviewResult && (
//           <div className="mt-8 bg-gray-900 border border-gray-700 rounded-lg p-4 text-gray-300">
//             <h2 className="text-lg font-semibold text-indigo-400 mb-2">
//               Review Result:
//             </h2>
//             <pre className="whitespace-pre-wrap">{reviewResult}</pre>
//           </div>
//         )}

//         {/* Display code ID */}
//         {codeId && (
//           <p className="text-sm text-gray-500 mt-4 text-center">
//             <strong>Code ID:</strong> {codeId}
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CodeReview;




import React, { useState } from "react";
import axios from "axios";

const CodeReview = () => {
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("");
  const [content, setContent] = useState("");
  const [reviewResult, setReviewResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [codeId, setCodeId] = useState(null);
  const [reviews, setReviews] = useState([]); // ✅ store all reviews

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setReviewResult(null);
    setReviews([]); // clear previous results

    try {
      // STEP 1: Upload code
      const uploadRes = await axios.post("http://localhost:5000/api/code/upload", {
        title,
        language,
        content,
      });

      const uploadedCode = uploadRes.data;
      const newCodeId = uploadedCode._id;
      setCodeId(newCodeId);

      // STEP 2: Generate Gemini Review
      await axios.post("http://localhost:5000/api/review/generateReviewG", {
        codeId: newCodeId,
      });

      // ✅ Small delay to let the backend save review
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // STEP 3: Fetch all reviews for this code
      const reviewFetchRes = await axios.get(
        `http://localhost:5000/api/review/${newCodeId}`
      );

      const fetchedReviews = reviewFetchRes.data;
      setReviews(fetchedReviews);
      console.log("reviews" , fetchedReviews) ;

      // ✅ Show the latest review’s feedback
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
    <div className="bg-gray-900 text-gray-200 p-4 min-h-screen">
      <div className="max-w-3xl mx-auto bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-700">
        <h1 className="text-3xl font-bold text-indigo-400 mb-6 text-center">
          Code Review Assistant
        </h1>

        {/* Code Upload Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title Field */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-400">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg 
              focus:ring-2 focus:ring-indigo-400 focus:outline-none text-gray-200"
              placeholder="Enter code title..."
            />
          </div>

          {/* Language Field */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-400">
              Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              required
              className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg 
              focus:ring-2 focus:ring-indigo-400 focus:outline-none text-gray-200"
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

          {/* Code Content */}
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-400">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows="8"
              className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg 
              focus:ring-2 focus:ring-indigo-400 focus:outline-none text-gray-200"
              placeholder="Paste your code here..."
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 
            text-white font-semibold py-2 rounded-lg transition-all duration-300"
          >
            {loading ? "Processing..." : "Submit for AI Review"}
          </button>
        </form>

        {/* Review Result */}
        {reviewResult && (
          <div className="mt-8 bg-gray-900 border border-gray-700 rounded-lg p-4 text-gray-300">
            <h2 className="text-lg font-semibold text-indigo-400 mb-2">
              Latest Review Result:
            </h2>
            <pre className="whitespace-pre-wrap">{reviewResult}</pre>
          </div>
        )}

        {/* ✅ Display Review Results */}
{reviews.length > 0 && (
  <div className="mt-8 bg-gray-800 border border-gray-700 rounded-lg p-6">
    <h2 className="text-xl font-semibold text-indigo-400 mb-4 text-center">
      AI Review Feedback
    </h2>

    {reviews.map((rev, idx) => (
      <div
        key={rev._id || idx}
        className="mb-6 last:mb-0 bg-gray-900 rounded-lg p-4 shadow-md border border-gray-700"
      >
        <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
          {rev.feedback}
        </p>
        <div className="mt-3 text-xs text-gray-500 flex justify-between">
          <span>
            ⭐ <strong>{rev.rating}/10</strong>
          </span>
          <span>{rev.reviewType === "AI" ? "🤖 AI Generated" : "👤 Manual"}</span>
          <span>{new Date(rev.createdAt).toLocaleString()}</span>
        </div>
      </div>
    ))}
  </div>
)}

        {/* Display code ID */}
        {codeId && (
          <p className="text-sm text-gray-500 mt-4 text-center">
            <strong>Code ID:</strong> {codeId}
          </p>
        )}
      </div>
    </div>
  );
};

export default CodeReview;

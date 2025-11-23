import React, { useState } from "react";
import axios from "axios";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFetchUser = async () => {
    try {
      setLoading(true);
      setError("");
      setUser(null);

      const res = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/user`
      );

      setUser(res.data);
    } catch (err) {
      console.error("Error fetching Jira user:", err);
      setError("❌ Failed to fetch Jira user details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center justify-center px-6 py-6">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-700">
        <h1 className="text-2xl font-bold text-indigo-400 text-center mb-6">
          Jira User Profile 👤
        </h1>

        <button
          onClick={handleFetchUser}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 font-semibold py-2 rounded-lg transition-all duration-300 mb-4"
        >
          {loading ? "Fetching..." : "Fetch Jira User"}
        </button>

        {error && (
          <p className="text-red-400 text-center font-medium">{error}</p>
        )}

        {user && (
          <div className="text-center">
            <img
              src={
                user.avatar ||
                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt="avatar"
              className="rounded-full w-24 h-24 mx-auto mb-4 border-2 border-indigo-500"
            />
            <h2 className="text-xl font-semibold text-indigo-300">
              {user.name}
            </h2>
            <p className="text-gray-400 mt-1">{user.email}</p>
            <div className="mt-4 bg-gray-900 rounded-lg p-4 border border-gray-700 text-left">
              <p><strong>Account ID:</strong> {user.jiraAccountId}</p>
              <p><strong>Time Zone:</strong> {user.timeZone || "N/A"}</p>
              <p><strong>Locale:</strong> {user.locale || "N/A"}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;

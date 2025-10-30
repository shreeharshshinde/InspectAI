import React, { useState } from "react";
import axios from "axios";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  const handleFetchUser = async () => {
    try {
      setError("");
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/user`);
      setUser(res.data);
    } catch (err) {
      console.error("Error fetching Jira user:", err);
      setError("Failed to fetch Jira user. Please check backend or credentials.");
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-96">
      <button
        onClick={handleFetchUser}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded mb-4 w-full"
      >
        Fetch Jira User
      </button>

      {error && <p className="text-red-600">{error}</p>}

      {user && (
        <div className="flex flex-col items-center">
          <img
            src={user.avatar}
            alt="avatar"
            className="rounded-full w-20 h-20 mb-3"
          />
          <h2 className="text-xl font-bold">{user.name}</h2>
          <p className="text-gray-600">{user.email}</p>
          <p className="text-sm text-gray-500 mt-1">Account ID: {user.jiraAccountId}</p>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
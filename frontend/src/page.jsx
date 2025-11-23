import React, { useEffect, useState } from "react";
import { FiPlus, FiSearch, FiFolder, FiMic, FiSend, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import JiraIssues from "./components/JiraIssues";
import { Link } from "react-router-dom";
import axios from "axios";

const Page = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchJiraUser = async () => {
      try {
        const response = await axios.get("http://localhost:5000/user");
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching Jira user:", error);
      }
    };

    fetchJiraUser();
  }, []);

  return (
    <div className="flex h-screen bg-gray-900 text-gray-200 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="p-4 text-xl font-semibold border-b border-gray-700">
            Inspect-AI
          </div>
          
          {/* Quick Actions */}
          <div className="space-y-2 p-3">
            <button className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-700 transition-colors">
              <FiPlus className="text-lg" /> 
              New chat
            </button>
            <button className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-700 transition-colors">
              <FiSearch className="text-lg" /> 
              Search chats
            </button>
            <button className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-700 transition-colors">
              <FiFolder className="text-lg" /> 
              Library
            </button>
            <button className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-700 transition-colors">
              <FiFolder className="text-lg" /> 
              Projects
            </button>

            <Link to='/code-review'>
              <button className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-700 transition-colors">
                <FiCheckCircle className="text-lg" /> 
                Code Review
              </button>
            </Link>
            <Link to='/raise-issues'>
              <button className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-700 transition-colors">
                <FiAlertCircle className="text-lg" /> 
                Raise Issues
              </button>
            </Link>
          </div>

          {/* Recent Chats */}
          <div className="mt-6 border-t border-gray-700 mx-3 pt-4 space-y-1">
            <p className="text-sm font-semibold text-gray-400 px-2 mb-2">Recent Chats</p>
            {["Code correction suggestions", "Upper and lower bound map", "Check string score balance"].map((item, index) => (
              <button
                key={index}
                className="block w-full text-left text-sm text-gray-300 truncate p-2 rounded-lg hover:bg-gray-700 transition-colors px-3"
                title={item}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* ✅ Dynamic User Profile */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {user && user.avatar ? (
                <img
                  src={user.avatar}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-semibold">
                  {user ? user.name.charAt(0) : "?"}
                </div>
              )}
              <div>
                <p className="text-sm font-semibold">
                  {user ? user.name : "Loading..."}
                </p>
                <p className="text-xs text-gray-400">
                  {user ? user.email : ""}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
          
        {/* Jira Issues */}
        <div className="flex-1 flex flex-col overflow-y-auto">
          <JiraIssues />
        </div>

        {/* Footer */}
        <div className="p-4 text-center text-xs text-gray-500">
          Inspect-AI can make mistakes. Consider checking important information.
        </div>
      </div>
    </div>
  );
};

export default Page;

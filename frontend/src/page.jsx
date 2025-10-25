import React from "react";
import { FiPlus, FiSearch, FiFolder, FiMic, FiSend, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import JiraIssues from "./components/JiraIssues";
import { Link } from "react-router-dom";

const Page = () => {
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

            {/* New Buttons */}
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
            {[
              "Code correction suggestions",
              "Upper and lower bound map",
              "Check string score balance",
            ].map((item, index) => (
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

        {/* User Profile */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-semibold">
                V
              </div>
              <div>
                <p className="text-sm font-semibold">Vrushali Sangale</p>
                <p className="text-xs text-gray-400">Free Plan</p>
              </div>
            </div>
            <button className="text-xs px-3 py-1 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors">
              Upgrade
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Upgrade Banner */}
        <div className="flex justify-center p-4">
          <button className="bg-indigo-800 text-sm px-4 py-2 rounded-full hover:bg-indigo-700 transition-colors">
            ✨ Upgrade to Inspect-AI Plus
          </button>
        </div>

        {/* Welcome Area */}
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="text-center max-w-2xl">
            <h1 className="text-4xl font-semibold mb-6 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              What would you like to explore today?
            </h1>
            
            {/* Input Area */}
            <div className="flex items-center bg-gray-800 px-6 py-4 rounded-2xl w-full max-w-2xl shadow-lg border border-gray-700">
              <FiPlus className="text-gray-400 text-lg mr-3" />
              <input
                type="text"
                placeholder="Ask anything..."
                className="flex-1 bg-transparent border-none outline-none text-gray-200 placeholder-gray-400 text-lg"
              />
              <div className="flex gap-3">
                <FiMic className="text-gray-400 text-lg cursor-pointer hover:text-white transition-colors" />
                <FiSend className="text-gray-400 text-lg cursor-pointer hover:text-white transition-colors" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-y-auto">
            {/* Jira Issues Component */}
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

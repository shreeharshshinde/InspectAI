import React from "react";
import { useParams } from "react-router-dom";

const ChatPage = () => {
  const { id } = useParams();

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-200 p-6">
      <h1 className="text-2xl font-semibold mb-4">
        Chat Session: {id}
      </h1>
      <div className="flex-1 bg-gray-800 rounded-xl p-4">
        <p className="text-gray-400">
          Here you can show messages, responses, and AI suggestions for this chat.
        </p>
      </div>
    </div>
  );
};

export default ChatPage;
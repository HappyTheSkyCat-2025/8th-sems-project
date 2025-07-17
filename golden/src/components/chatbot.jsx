import React, { useState } from "react";
import { FaCommentDots } from "react-icons/fa";
import "../styles/chatbot.css";

export default function Chatbot() {
  const [chatOpen, setChatOpen] = useState(false);

  const toggleChat = () => setChatOpen((prev) => !prev);

  return (
    <>
      <button
        className="chatbot-button"
        onClick={toggleChat}
        aria-label="Chat with us"
      >
        <FaCommentDots size={24} />
      </button>

      {chatOpen && (
        <div className="chatbox">
          <div className="chatbox-header">
            <h4>Chat with us</h4>
            <button className="chatbox-close" onClick={toggleChat}>
              ×
            </button>
          </div>
          <div className="chatbox-body">
            <p>Hi! How can we help you today?</p>
          </div>
        </div>
      )}
    </>
  );
}

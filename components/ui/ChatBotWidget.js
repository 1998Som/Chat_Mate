"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatBotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Floating button highlight animation
  const [highlight, setHighlight] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setHighlight(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/create/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.content }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch response from server");
      }

      const data = await res.json();

      const assistantMessage = {
        role: "assistant",
        content: data.reply || "No response from AI 🤖",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Error: " + err.message },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
        onClick={() => setOpen(!open)}
        className={`fixed bottom-4 right-4 px-5 py-4 rounded-full shadow-2xl text-white 
          bg-gradient-to-r from-purple-500 via-pink-500 to-red-500
          hover:scale-110 transform transition-all duration-300 z-[9999]
          ${highlight ? "animate-pulse ring-4 ring-purple-400 ring-opacity-60" : ""}`}
      >
        💬
      </motion.button>

      {/* Chatbox */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed bottom-20 right-4 w-80 h-[400px] 
              bg-black/90 backdrop-blur-xl border border-gray-700
              rounded-2xl shadow-2xl flex flex-col overflow-hidden z-[9999]"
          >
            {/* Header */}
            <div className="p-3 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 
              text-white font-bold rounded-t-2xl flex items-center justify-between shadow-md">
              ChatMate AI ✨
              <button
                onClick={() => setOpen(false)}
                className="text-white text-sm hover:text-gray-300 transition"
              >
                ✖
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto text-sm space-y-3">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: msg.role === "user" ? 50 : -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-lg 
                    ${
                      msg.role === "user"
                        ? "ml-auto bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                        : "mr-auto bg-gray-800 text-gray-200 border border-gray-700"
                    }`}
                >
                  {msg.content}
                </motion.div>
              ))}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mr-auto bg-gray-800 text-gray-400 px-4 py-2 rounded-2xl text-sm animate-pulse"
                >
                  ⏳ Thinking...
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 flex border-t border-gray-700 bg-black/80">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-gray-900 text-white border border-gray-700 rounded-full 
                  px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Ask me anything..."
              />
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={sendMessage}
                disabled={loading}
                className="ml-2 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 
                  text-white px-4 py-2 rounded-full text-sm shadow hover:scale-105 transform 
                  transition disabled:opacity-50"
              >
                Send
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

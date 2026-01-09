import React, { useEffect, useMemo, useRef, useState } from "react";
import { FaUserCircle, FaRobot } from "react-icons/fa";

const API_BASE = "http://localhost:8000";

type Message = {
  role: "user" | "assistant";
  content: string;
  sources?: string[];
};

type ApiResponse = {
  answer: string;
  sources?: string[];
};

const COMMON_QUESTIONS = [
  "What schemes are available for students?",
  "How to apply for a pension?",
  "Eligibility for health insurance?",
  "Subsidy schemes for farmers?",
];

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const canSend = useMemo(
    () => input.trim().length > 0 && !loading,
    [input, loading]
  );

  const send = async (question?: string) => {
    const userQuestion = question ?? input.trim();
    if (!userQuestion) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userQuestion }]);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userQuestion }),
      });

      if (!res.ok) throw new Error(`Request failed: ${res.status}`);

      const data: ApiResponse = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.answer,
          sources:
            data.sources && data.sources.length > 0
              ? data.sources
              : undefined,
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `⚠️ Error: ${err.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-2 sm:p-4">
      <div className="w-full sm:max-w-4xl bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-white/20">
        
        {/* Header */}
        <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-4 sm:px-6 py-6 sm:py-8 flex flex-col overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
          <div className="relative z-10">
            <div className="text-2xl sm:text-3xl font-black tracking-tight">
              SchemesConnect
            </div>
            <div className="text-xs sm:text-sm font-medium text-white/90 mt-2 flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Your one-stop portal for government schemes & citizen services
            </div>
          </div>
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        {/* Common Questions Toolbar */}
        <div className="p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 border-b border-gray-200/50 flex flex-wrap gap-2 sm:gap-3 justify-center sm:justify-start">
          {COMMON_QUESTIONS.map((q, i) => (
            <button
              key={i}
              onClick={() => send(q)}
              className="group relative px-4 sm:px-6 py-2 sm:py-2.5 bg-white text-indigo-700 text-[10px] sm:text-sm rounded-full font-semibold hover:bg-indigo-600 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 border border-indigo-200"
            >
              <span className="relative z-10">{q}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="absolute inset-0 rounded-full bg-white opacity-100 group-hover:opacity-0 transition-opacity duration-300"></span>
            </button>
          ))}
        </div>

        {/* Messages */}
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3 sm:space-y-4 bg-gradient-to-b from-gray-50/50 to-white/50"
          style={{ minHeight: "400px" }}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-start gap-2 sm:gap-3 ${
                msg.role === "user" ? "justify-end" : "justify-start"
              } animate-fadeIn`}
            >
              {msg.role === "assistant" && (
                <div className="flex-shrink-0 text-xl sm:text-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-2xl shadow-lg">
                  <FaRobot className="text-white" />
                </div>
              )}

              <div
                className={`px-4 sm:px-5 py-3 sm:py-4 rounded-3xl max-w-[85%] sm:max-w-[75%] break-words text-xs sm:text-base shadow-lg transition-all duration-300 hover:shadow-xl ${
                  msg.role === "user"
                    ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-br-md border border-indigo-400/30"
                    : "bg-white text-gray-800 rounded-bl-md border border-gray-200/50"
                }`}
              >
                {msg.content}

                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-300/30 text-[9px] sm:text-xs text-gray-600 flex flex-wrap gap-1.5">
                    {msg.sources.map((s, j) => (
                      <span
                        key={j}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 rounded-full font-medium border border-indigo-200/50"
                      >
                        <span className="w-1 h-1 bg-indigo-500 rounded-full"></span>
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {msg.role === "user" && (
                <div className="flex-shrink-0 text-xl sm:text-2xl bg-gradient-to-br from-pink-500 to-purple-600 p-2 rounded-2xl shadow-lg">
                  <FaUserCircle className="text-white" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 sm:gap-3 justify-start animate-fadeIn">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-2xl shadow-lg">
                <FaRobot className="text-white text-xl sm:text-2xl" />
              </div>
              <div className="flex space-x-1.5 bg-white px-4 py-3 rounded-3xl shadow-lg border border-gray-200/50">
                <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-bounce"></span>
                <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-bounce" style={{animationDelay: '0.15s'}}></span>
                <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 bg-gradient-to-r from-pink-500 to-indigo-500 rounded-full animate-bounce" style={{animationDelay: '0.3s'}}></span>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-3 sm:p-4 border-t border-gray-200/50 bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-2 sm:gap-3 bg-gray-50/50 rounded-3xl p-2 sm:p-2 border border-gray-200/50 shadow-inner">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={1}
              placeholder="Type a message..."
              className="flex-1 resize-none bg-transparent rounded-2xl px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-base focus:outline-none placeholder:text-gray-400"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (canSend) send();
                }
              }}
            />
            <button
              type="submit"
              disabled={!canSend}
              onClick={(e) => {
                e.preventDefault();
                if (canSend) send();
              }}
              className="px-4 sm:px-8 py-2.5 sm:py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-xs sm:text-base font-bold hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
            >
              Send
            </button>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="text-[8px] sm:text-xs text-gray-500 text-center py-2 sm:py-3 bg-gradient-to-r from-gray-50/50 to-white/50 border-t border-gray-100">
          *SchemesConnect assistant may make mistakes. Always verify important information.
        </div>

      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );

}

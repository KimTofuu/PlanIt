"use client";

import { useState, useRef, useEffect } from "react";
import { useTrelloBoards } from "../../hooks/useTrello";
import { bytezService } from "../../services/bytezService";
import type { ChatMessage } from "../../interface/aiChat";
import toast from "react-hot-toast";

export default function AIChat() {
  const { data: boards, isLoading: boardsLoading } = useTrelloBoards();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Welcome message
  useEffect(() => {
    if (boards && boards.length > 0 && messages.length === 0) {
      const insights = bytezService.generateInsights(boards);
      setMessages([
        {
          role: "assistant",
          content: `👋 Hi! I'm your PlanIt AI Assistant. I can help you manage your Trello boards.\n\n${insights}\n\nWhat would you like to know about your boards?`,
        },
      ]);
    }
  }, [boards, messages.length]);

  const handleSendMessage = async () => {
    if (!input.trim() || isTyping) return;
    if (!boards || boards.length === 0) {
      toast.error("No Trello boards available");
      return;
    }

    const userMessage = input.trim();
    setInput("");

    // Add user message
    const newMessages: ChatMessage[] = [
      ...messages,
      { role: "user", content: userMessage },
    ];
    setMessages(newMessages);
    setIsTyping(true);

    try {
      // Get AI response (using basic board data only)
      const response = await bytezService.sendMessage(
        userMessage,
        boards,
        messages
      );

      if (response.error) {
        console.error("AI Error:", response.error);
        toast.error(response.error);
        setMessages([
          ...newMessages,
          {
            role: "assistant",
            content: "Sorry, I encountered an error. Please try again.",
          },
        ]);
      } else {
        setMessages([
          ...newMessages,
          { role: "assistant", content: response.message },
        ]);
      }
    } catch (err) {
      console.error("Chat Error:", err);
      toast.error("Failed to get AI response");
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const suggestedQuestions = [
    "What boards do I have?",
    "Tell me about my workspace",
    "How many boards are there?",
    "What projects am I working on?",
    "Give me an overview",
  ];

  if (boardsLoading) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-neutral-600 dark:text-neutral-400">
            Loading your boards...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[600px] bg-white dark:bg-neutral-900 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-800">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-gradient-to-r from-blue-500 to-purple-600">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
          <span className="text-2xl">🤖</span>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">
            PlanIt AI Assistant
          </h2>
          <p className="text-xs text-white/80">
            Ask me about your {boards?.length || 0} Trello board(s)
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              Start a conversation
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              Ask me anything about your Trello boards
            </p>
            <div className="flex flex-wrap gap-2 justify-center max-w-2xl mx-auto">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => setInput(q)}
                  className="px-4 py-2 text-sm bg-blue-50 dark:bg-neutral-800 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-neutral-700 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-3 ${
                  msg.role === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">🤖</span>
                    <span className="text-xs font-semibold opacity-70">
                      AI Assistant
                    </span>
                  </div>
                )}
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))
        )}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-neutral-200 dark:border-neutral-800 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Ask about your boards..."
            disabled={isTyping}
            className="flex-1 px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          />
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || isTyping}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-neutral-300 dark:disabled:bg-neutral-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:cursor-not-allowed"
          >
            <span>Send</span>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
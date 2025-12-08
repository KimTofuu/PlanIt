"use client";

import { useState, useRef, useEffect } from "react";
import { useTrelloBoards } from "../../hooks/useTrello";
import { bytezService } from "../../services/bytezService";
import type { ChatMessage } from "../../interface/aiChat";
import toast from "react-hot-toast";

// This component surfaces a modernized chat experience for the AI assistant.
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
          content: `Hi! I'm your PlanIt AI Assistant. I can help you manage your Trello boards.\n\n${insights}\n\nWhat would you like to know about your boards?`,
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
      <div className="flex h-[600px] items-center justify-center">
        <div className="flex flex-col items-center gap-3 rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] px-10 py-12 text-center shadow-sm">
          <i className="fa-solid fa-spinner fa-spin text-3xl text-[var(--brand-100)]" aria-hidden="true"></i>
          <p className="text-sm text-[var(--foreground-muted)]">
            Loading your boards...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[620px] flex-col overflow-hidden rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow)]">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-[var(--border)] bg-[var(--surface-alt)] px-6 py-5 text-[var(--foreground)]">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--brand-15)] text-xl text-[var(--brand-100)]">
          <i className="fa-solid fa-robot" aria-hidden="true"></i>
        </div>
        <div>
          <h2 className="text-lg font-semibold">PlanIt AI Assistant</h2>
          <p className="text-xs text-[var(--foreground-muted)]">
            Ask me about your {boards?.length ?? 0} Trello board{boards && boards.length === 1 ? "" : "s"}
          </p>
        </div>
        <div className="ml-auto inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-semibold text-[var(--foreground-muted)] shadow-sm">
          <span className="h-2 w-2 rounded-full bg-[var(--semantic-emerald)]"></span>
          Online
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto bg-[var(--surface)] p-6">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-6 rounded-[var(--radius-lg)] border border-dashed border-[var(--border)] bg-[var(--surface-alt)] p-10 text-center shadow-sm">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--brand-15)] text-3xl text-[var(--brand-100)]">
              <i className="fa-regular fa-comments" aria-hidden="true"></i>
            </span>
            <div>
              <h3 className="text-xl font-semibold text-[var(--foreground)]">Start a conversation</h3>
              <p className="mt-2 max-w-md text-sm text-[var(--foreground-muted)]">
                Ask me anything about your Trello boards to uncover quick insights or get a status snapshot.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => setInput(q)}
                  className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--foreground-muted)] transition-colors hover:border-[var(--brand-90)] hover:text-[var(--brand-100)]"
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
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm transition-colors ${
                  msg.role === "user"
                    ? "bg-[var(--brand-90)] text-white shadow-[0_10px_24px_-18px_rgba(59,130,246,0.75)]"
                    : "bg-[var(--surface-alt)] text-[var(--foreground)]"
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-[var(--foreground-muted)]">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--brand-15)] text-[var(--brand-100)]">
                      <i className="fa-solid fa-robot" aria-hidden="true"></i>
                    </span>
                    AI Assistant
                  </div>
                )}
                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))
        )}

        {isTyping && (
          <div className="flex justify-start">
            <div className="rounded-2xl bg-[var(--surface-alt)] px-4 py-3 text-[var(--foreground-muted)] shadow-sm">
              <div className="flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-current"></span>
                <span
                  className="h-2 w-2 animate-bounce rounded-full bg-current"
                  style={{ animationDelay: "100ms" }}
                ></span>
                <span
                  className="h-2 w-2 animate-bounce rounded-full bg-current"
                  style={{ animationDelay: "200ms" }}
                ></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-[var(--border)] bg-[var(--surface)] p-5 backdrop-blur-md">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Ask about your boards..."
            disabled={isTyping}
            className="flex-1 rounded-2xl border border-[var(--border)] bg-[var(--surface-alt)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] placeholder:opacity-70 shadow-sm transition-colors focus:outline-none focus:ring-4 focus:ring-[var(--brand-15)] focus:ring-offset-1 disabled:opacity-60"
          />
          <button
            onClick={handleSendMessage}
            disabled={!input.trim() || isTyping}
            className="inline-flex items-center gap-2 rounded-2xl bg-[var(--brand-100)] px-6 py-3 font-semibold text-white shadow-[0_20px_40px_-18px_rgba(61,139,253,0.6)] transition-all hover:-translate-y-[1px] hover:bg-[var(--brand-90)] hover:shadow-[0_22px_44px_-16px_rgba(61,139,253,0.65)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[rgba(71,181,255,0.38)] disabled:cursor-not-allowed disabled:bg-[var(--brand-45)] disabled:shadow-none"
          >
            <i className="fa-solid fa-paper-plane" aria-hidden="true"></i>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
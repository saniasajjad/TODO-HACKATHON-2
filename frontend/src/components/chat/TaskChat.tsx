/**
 * AI Task Chat interface with premium UI.
 *
 * [Task]: T054
 * [From]: specs/010-chatkit-migration/
 *
 * SSE-based streaming chat for AI-powered task management.
 */
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Send, Bot, User, Sparkles, Loader2, Wrench, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

interface ToolCall {
  tool: string;
  status: "starting" | "complete" | "error";
  message?: string;
}

interface TaskChatProps {
  userId: string;
  initialThreadId?: string;
  className?: string;
}

const suggestions = [
  "Create a task called Review PRs",
  "Show all my tasks",
  "What tasks are due today?",
  "Mark my latest task as complete",
];

export function TaskChat({ userId, initialThreadId, className = "" }: TaskChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTool, setCurrentTool] = useState<ToolCall | null>(null);
  const [threadId, setThreadId] = useState<string | undefined>(initialThreadId);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const API_URL = typeof window !== 'undefined'
    ? window.location.origin
    : process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + "px";
    }
  }, [input]);

  const sendMessage = async (text?: string) => {
    const messageText = (text || input).trim();
    if (!messageText || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);
    setCurrentTool(null);

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch("/api/chatkit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          event: "conversation_item_created",
          conversation_id: threadId || null,
          item: {
            type: "message",
            role: "user",
            content: [{ type: "text", text: messageText }],
          },
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: response.statusText }));
        throw new Error(errorData.detail || "Failed to connect to chat service");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let assistantMessage = "";
      const assistantMessageId = Date.now().toString() + "_assistant";

      setMessages((prev) => [
        ...prev,
        { id: assistantMessageId, role: "assistant", content: "", timestamp: new Date(), isStreaming: true },
      ]);

      setIsConnected(true);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (!line.trim() || !line.startsWith("data: ")) continue;
          const data = line.slice(6);
          try {
            const event = JSON.parse(data);

            if (event.type === "text" || event.event === "message_delta") {
              assistantMessage += event.text || "";
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantMessageId ? { ...msg, content: assistantMessage } : msg
                )
              );
            } else if (event.event === "tool_call_created" || event.tool) {
              setCurrentTool({
                tool: event.tool || event.function?.name || "tool",
                status: "starting",
                message: event.message || "Executing...",
              });
            } else if (event.event === "tool_call_done" || event.status === "complete") {
              setCurrentTool({
                tool: currentTool?.tool || "tool",
                status: "complete",
                message: "Done",
              });
              setTimeout(() => setCurrentTool(null), 1000);
            } else if (event.event === "message_done") {
              if (event.thread_id) setThreadId(event.thread_id);
            } else if (event.event === "error") {
              throw new Error(event.message || event.detail || "Unknown error");
            }
          } catch (e) {
            // Skip parse errors for non-JSON lines
          }
        }
      }

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId ? { ...msg, isStreaming: false } : msg
        )
      );
    } catch (err: any) {
      if (err.name !== "AbortError") {
        setError(err.message || "Failed to send message");
        setMessages((prev) => {
          const lastMsg = prev[prev.length - 1];
          if (lastMsg?.isStreaming) return prev.slice(0, -1);
          return prev;
        });
      }
    } finally {
      setIsLoading(false);
      setIsConnected(false);
      abortControllerRef.current = null;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className={cn("flex flex-col h-full w-full rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden shadow-sm", className)}>

      {/* ── Messages area ── */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center h-full px-6 py-12">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
              <MessageSquare className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-3">
              AI Task Assistant
            </h3>
            <p className="text-sm text-muted-foreground text-center max-w-sm leading-relaxed">
              Create, manage, and organize your tasks using natural language — just type what you need. Try something like
              {" "}<button onClick={() => sendMessage(suggestions[0])} className="text-primary hover:underline font-medium">&ldquo;{suggestions[0]}&rdquo;</button>,
              {" "}<button onClick={() => sendMessage(suggestions[1])} className="text-primary hover:underline font-medium">&ldquo;{suggestions[1]}&rdquo;</button>,
              {" "}<button onClick={() => sendMessage(suggestions[2])} className="text-primary hover:underline font-medium">&ldquo;{suggestions[2]}&rdquo;</button>, or
              {" "}<button onClick={() => sendMessage(suggestions[3])} className="text-primary hover:underline font-medium">&ldquo;{suggestions[3]}&rdquo;</button>.
            </p>
          </div>
        ) : (
          /* Message list */
          <div className="px-4 sm:px-6 py-5 space-y-5">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3 max-w-2xl",
                  message.role === "user" ? "ml-auto flex-row-reverse" : ""
                )}
              >
                {/* Avatar */}
                <div className={cn(
                  "flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center mt-0.5",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-primary/10 text-primary"
                )}>
                  {message.role === "user"
                    ? <User className="w-3.5 h-3.5" />
                    : <Bot className="w-3.5 h-3.5" />
                  }
                </div>

                {/* Bubble */}
                <div className={cn(
                  "rounded-2xl px-4 py-3 text-sm leading-relaxed",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-md"
                    : "bg-muted/60 text-foreground border border-border/30 rounded-tl-md"
                )}>
                  <p className="whitespace-pre-wrap break-words">
                    {message.content}
                    {message.isStreaming && (
                      <span className="inline-block w-1.5 h-4 bg-primary/60 rounded-sm ml-0.5 animate-pulse" />
                    )}
                  </p>
                  <p className={cn(
                    "text-[10px] mt-2",
                    message.role === "user" ? "text-primary-foreground/50" : "text-muted-foreground/60"
                  )}>
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}

            {/* Tool indicator */}
            {currentTool && (
              <div className="flex gap-3 max-w-2xl">
                <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center mt-0.5">
                  <Wrench className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <div className="rounded-2xl rounded-tl-md px-4 py-2.5 bg-amber-50 dark:bg-amber-900/10 border border-amber-200/30 dark:border-amber-800/20 flex items-center gap-2.5">
                  <Loader2 className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                  <span className="text-sm text-amber-700 dark:text-amber-400">
                    <span className="font-medium">{currentTool.tool}</span>
                    <span className="text-amber-600/60 dark:text-amber-400/60"> &middot; {currentTool.message}</span>
                  </span>
                </div>
              </div>
            )}

            {/* Thinking indicator */}
            {isLoading && !currentTool && messages[messages.length - 1]?.role === "user" && (
              <div className="flex gap-3 max-w-2xl">
                <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center mt-0.5">
                  <Bot className="w-3.5 h-3.5 text-primary" />
                </div>
                <div className="rounded-2xl rounded-tl-md px-4 py-3 bg-muted/60 border border-border/30">
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Error banner */}
      {error && (
        <div className="mx-4 mb-2 px-4 py-2.5 bg-destructive/8 border border-destructive/15 rounded-xl animate-fadeIn">
          <p className="text-xs text-destructive">{error}</p>
        </div>
      )}

      {/* ── Input area ── */}
      <div className="border-t border-border/40 bg-background/60 backdrop-blur-sm p-3 sm:p-4">
        <div className="flex items-end gap-2.5">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about your tasks..."
              disabled={isLoading}
              className={cn(
                "w-full px-4 py-3 pr-4 text-sm",
                "bg-card/80 border border-border/50 rounded-xl",
                "text-foreground placeholder:text-muted-foreground/50",
                "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40",
                "transition-all duration-200 resize-none",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "min-h-[44px] max-h-[160px]"
              )}
              rows={1}
            />
          </div>
          <button
            onClick={() => sendMessage()}
            disabled={isLoading || !input.trim()}
            className={cn(
              "flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center",
              "bg-primary text-primary-foreground",
              "hover:brightness-110 hover:shadow-md hover:shadow-primary/20",
              "disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none",
              "transition-all duration-200 active:scale-95"
            )}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground/40 mt-2 text-center">
          Enter to send &middot; Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}

export default TaskChat;

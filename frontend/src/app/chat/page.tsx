"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth";
import { TaskChat } from "@/components/chat/TaskChat";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Sparkles } from "lucide-react";

export default function ChatPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useSession();
  const [currentThreadId, setCurrentThreadId] = useState<string>();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <DashboardHeader />
        <main className="lg:pl-64 pt-14 lg:pt-0">
          <div className="flex items-center justify-center h-[calc(100vh-3.5rem)] lg:h-screen">
            <div className="text-center animate-scaleIn">
              <div className="w-12 h-12 border-3 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">Loading chat...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <DashboardHeader />

      <main className="lg:pl-64 pt-14 lg:pt-0 flex flex-col h-screen">
        {/* Chat header */}
        <div className="px-4 sm:px-6 lg:px-8 py-4 lg:py-5 border-b border-border/30">
          <div className="max-w-4xl mx-auto flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground tracking-tight">
                AI Assistant
              </h1>
              <p className="text-xs text-muted-foreground">
                Manage tasks with natural language
              </p>
            </div>
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 overflow-hidden px-4 sm:px-6 lg:px-8 py-4">
          <TaskChat
            userId={user?.id || ""}
            initialThreadId={currentThreadId}
            className="h-full w-full max-w-4xl mx-auto"
          />
        </div>
      </main>
    </div>
  );
}

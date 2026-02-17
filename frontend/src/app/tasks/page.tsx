"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { taskApi } from "@/lib/task-api";
import { TaskList } from "@/components/tasks/TaskList";
import { FilterBar } from "@/components/tasks/FilterBar";
import { Pagination } from "@/components/tasks/Pagination";
import { TaskForm } from "@/components/tasks/TaskForm";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import type { Task } from "@/types/task";

const ITEMS_PER_PAGE = 50;

export default function TasksPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const statusParam = searchParams.get("status");
      const searchParam = searchParams.get("search");
      const pageParam = searchParams.get("page");
      const page = pageParam ? parseInt(pageParam, 10) : 1;
      const offset = (page - 1) * ITEMS_PER_PAGE;

      const params: {
        limit: number;
        offset: number;
        completed?: boolean;
        search?: string;
      } = { limit: ITEMS_PER_PAGE, offset };

      if (statusParam === "active") params.completed = false;
      else if (statusParam === "completed") params.completed = true;
      if (searchParam) params.search = searchParam;

      const response = await taskApi.listTasks(params);
      setTasks(response.tasks);
      setTotal(response.total);
    } catch (err: any) {
      if (err.message === "Session expired") {
        router.push("/login");
        return;
      }
      setError(err.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: session, error } = await authClient.getSession();
        if (error || !session) { router.push("/login"); return; }
        loadTasks();
      } catch (err) {
        router.push("/login");
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    loadTasks();
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  const currentPage = searchParams.get("page")
    ? parseInt(searchParams.get("page")!, 10)
    : 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <DashboardHeader />

      <main className="lg:pl-64 pt-14 lg:pt-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
          {/* Page title */}
          <div className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">
              All Tasks
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Browse, filter, and manage your tasks
            </p>
          </div>

          <FilterBar />

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <LoadingSpinner size="lg" />
                <p className="mt-3 text-sm text-muted-foreground">Loading tasks...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive px-5 py-4 rounded-2xl animate-fadeIn">
              {error}
            </div>
          ) : (
            <>
              <TaskList tasks={tasks} />
              <Pagination total={total} limit={ITEMS_PER_PAGE} currentPage={currentPage} />
            </>
          )}
        </div>
      </main>

      {showCreateModal && (
        <TaskForm isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} mode="create" />
      )}
    </div>
  );
}

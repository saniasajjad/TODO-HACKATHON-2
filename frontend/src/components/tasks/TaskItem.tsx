"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { Task } from "@/types/task";
import { formatRelativeDate } from "@/lib/utils";
import { taskApi } from "@/lib/task-api";
import { TaskForm } from "./TaskForm";
import { PriorityBadge } from "./PriorityBadge";
import { TagBadgeGroup } from "./TagBadge";
import { DueDateBadge } from "./DueDateBadge";
import { RecurrenceBadge } from "./RecurrenceBadge";
import { Button } from "@/components/ui/Button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { cn } from "@/lib/utils";
import { useOptimisticAction } from "@/lib/hooks";
import { Check, Pencil, Trash2 } from "lucide-react";

interface TaskItemProps {
  task: Task;
  onDelete?: (taskId: string) => void;
}

const urgencyBorderColors = {
  overdue: "border-l-urgency-overdue",
  "due-today": "border-l-urgency-due-today",
  "due-soon": "border-l-urgency-due-soon",
  "due-later": "border-l-urgency-due-later",
  none: "border-l-transparent",
};

export function TaskItem({ task, onDelete }: TaskItemProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [localTask, setLocalTask] = useState(task);

  const { isPending: isToggling, executeOptimistic } = useOptimisticAction();
  const { isPending: isDeleting, executeOptimistic: executeDelete } = useOptimisticAction();

  const urgencyBorderColor = urgencyBorderColors[localTask.urgency || "none"];

  const handleToggleComplete = async () => {
    await executeOptimistic({
      optimisticUpdate: () => { setLocalTask((prev) => ({ ...prev, completed: !prev.completed })); },
      action: () => taskApi.toggleComplete(task.id),
      onSuccess: (updated) => { setLocalTask(updated); },
      onError: () => { setLocalTask(task); },
      successMessage: localTask.completed ? "Task marked as active" : "Task completed",
      errorMessage: "Failed to update task",
    });
  };

  const handleDelete = async () => {
    await executeDelete({
      optimisticUpdate: () => { setShowDeleteModal(false); },
      action: () => taskApi.deleteTask(task.id),
      onSuccess: () => { onDelete?.(task.id); setTimeout(() => window.location.reload(), 100); },
      onError: () => { setShowDeleteModal(true); },
      successMessage: "Task deleted",
      errorMessage: "Failed to delete task",
    });
  };

  const handleTaskUpdated = (updated: Task) => { setLocalTask(updated); };

  return (
    <>
      <div
        className={cn(
          "group relative bg-card/80 backdrop-blur-sm border border-border/50 rounded-2xl p-4 sm:p-5",
          "transition-all duration-300 ease-out",
          "hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 hover:-translate-y-0.5",
          "border-l-4",
          urgencyBorderColor,
          localTask.completed && "opacity-50",
        )}
      >
        <div className="flex items-start gap-3 sm:gap-4">
          {/* Checkbox */}
          <button
            onClick={handleToggleComplete}
            disabled={isToggling}
            className={cn(
              "mt-0.5 flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200",
              localTask.completed
                ? "bg-primary border-primary text-primary-foreground scale-100"
                : "border-muted-foreground/30 hover:border-primary hover:bg-primary/5 hover:scale-110",
              "disabled:opacity-50 disabled:cursor-not-allowed",
            )}
            aria-label={localTask.completed ? "Mark as incomplete" : "Mark as complete"}
          >
            {isToggling ? (
              <LoadingSpinner size="xs" className="border-primary-foreground" />
            ) : localTask.completed ? (
              <Check className="w-3.5 h-3.5" strokeWidth={3} />
            ) : null}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3
              className={cn(
                "text-base font-medium text-foreground leading-snug",
                "transition-all duration-200",
                localTask.completed && "line-through text-muted-foreground",
              )}
            >
              {localTask.title}
            </h3>

            {localTask.description && (
              <p
                className={cn(
                  "mt-1.5 text-sm text-muted-foreground line-clamp-2 leading-relaxed",
                  localTask.completed && "line-through text-muted-foreground/50",
                )}
              >
                {localTask.description}
              </p>
            )}

            {/* Meta badges */}
            <div className="flex flex-wrap items-center gap-1.5 mt-3">
              <PriorityBadge priority={localTask.priority} />
              <TagBadgeGroup tags={localTask.tags || []} />
              <RecurrenceBadge recurrence={localTask.recurrence} />
              <DueDateBadge dueDate={localTask.due_date} urgency={localTask.urgency} task={localTask} />
              <span className="text-xs text-muted-foreground/50 ml-auto">
                {formatRelativeDate(localTask.created_at)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-0.5 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-200">
            <button
              onClick={() => setShowEditModal(true)}
              className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200 hover:scale-110"
              aria-label="Edit task"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              disabled={isDeleting}
              className="p-2 rounded-xl hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all duration-200 hover:scale-110 disabled:opacity-50"
              aria-label="Delete task"
            >
              {isDeleting ? <LoadingSpinner size="xs" /> : <Trash2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Delete confirmation */}
      <AlertDialog open={showDeleteModal} onOpenChange={(open) => !open && setShowDeleteModal(false)}>
        <AlertDialogContent className="sm:max-w-[400px] md:max-w-[500px] rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{localTask.title}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="secondary">Cancel</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit modal */}
      {showEditModal && (
        <TaskForm isOpen={showEditModal} onClose={() => setShowEditModal(false)} task={localTask} mode="edit" onTaskUpdated={handleTaskUpdated} />
      )}
    </>
  );
}

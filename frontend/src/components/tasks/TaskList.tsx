'use client';

import { useSearchParams } from 'next/navigation';
import { ClipboardList, Search } from 'lucide-react';
import type { Task } from '@/types/task';
import { TaskItem } from './TaskItem';

interface TaskListProps {
  tasks: Task[];
}

export function TaskList({ tasks }: TaskListProps) {
  const searchParams = useSearchParams();
  const hasActiveFilters = searchParams.has('status') || searchParams.has('search');

  if (!tasks || tasks.length === 0) {
    if (hasActiveFilters) {
      return (
        <div className="text-center py-16 animate-fadeIn">
          <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
            <Search className="w-7 h-7 text-muted-foreground/50" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">No tasks match your filters</h3>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Try adjusting your filters or search query
          </p>
        </div>
      );
    }

    return (
      <div className="text-center py-16 animate-fadeIn">
        <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center mx-auto mb-4">
          <ClipboardList className="w-7 h-7 text-primary/40" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">No tasks yet</h3>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Get started by creating your first task
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
      {tasks.map((task, i) => (
        <div key={task.id} className="animate-fadeIn" style={{ animationDelay: `${i * 30}ms` }}>
          <TaskItem task={task} />
        </div>
      ))}
    </div>
  );
}

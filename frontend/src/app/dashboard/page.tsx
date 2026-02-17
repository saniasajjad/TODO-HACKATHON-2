import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { TaskListClient } from '@/components/tasks/TaskListClient';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { fetchTasks } from '@/lib/api/server';
import { getTaskUrgency } from '@/lib/utils';
import type { Task } from '@/types/task';

const ITEMS_PER_PAGE = 50;

async function DashboardContent() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('auth_token');

  if (!authToken) {
    redirect('/login');
  }

  let initialTasks: Task[] = [];
  let initialTotal = 0;

  try {
    const response = await fetchTasks({
      limit: ITEMS_PER_PAGE,
      offset: 0,
    });

    if (response) {
      initialTasks = response.tasks.map(task => ({
        ...task,
        urgency: getTaskUrgency(task.due_date),
      })) as Task[];
      initialTotal = response.total;
    }
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <DashboardHeader />

      {/* Main content - offset for sidebar on desktop, offset for header on mobile */}
      <main className="lg:pl-64 pt-14 lg:pt-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
          {/* Page title area */}
          <div className="mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground tracking-tight">
              Dashboard
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage and track all your tasks in one place
            </p>
          </div>

          <TaskListClient
            initialTasks={initialTasks}
            initialTotal={initialTotal}
          />
        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return <DashboardContent />;
}

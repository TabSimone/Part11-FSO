import { Task } from "@shared/schema";
import TaskItem from "@/components/TaskItem";
import { InboxIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type FilterType = "all" | "active" | "completed";

interface TaskListProps {
  tasks: Task[];
  filteredTasks: Task[];
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  activeTasksCount: number;
  completedTasksCount: number;
  isLoading: boolean;
}

export default function TaskList({
  tasks,
  filteredTasks,
  filter,
  setFilter,
  activeTasksCount,
  completedTasksCount,
  isLoading
}: TaskListProps) {
  return (
    <div className="bg-white shadow-sm rounded-lg mb-6 dark:bg-gray-800">
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex -mb-px">
          <button 
            className={`px-6 py-4 font-medium text-sm border-b-2 ${
              filter === "all"
                ? "border-primary text-primary dark:border-primary dark:text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600"
            }`}
            onClick={() => setFilter("all")}
            aria-current={filter === "all" ? "page" : undefined}
          >
            All
            <span className="ml-1 text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-1 dark:bg-gray-700 dark:text-gray-300">
              {tasks.length}
            </span>
          </button>
          <button 
            className={`px-6 py-4 font-medium text-sm border-b-2 ${
              filter === "active"
                ? "border-primary text-primary dark:border-primary dark:text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600"
            }`}
            onClick={() => setFilter("active")}
            aria-current={filter === "active" ? "page" : undefined}
          >
            Active
            <span className="ml-1 text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-1 dark:bg-gray-700 dark:text-gray-300">
              {activeTasksCount}
            </span>
          </button>
          <button 
            className={`px-6 py-4 font-medium text-sm border-b-2 ${
              filter === "completed"
                ? "border-primary text-primary dark:border-primary dark:text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600"
            }`}
            onClick={() => setFilter("completed")}
            aria-current={filter === "completed" ? "page" : undefined}
          >
            Completed
            <span className="ml-1 text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-1 dark:bg-gray-700 dark:text-gray-300">
              {completedTasksCount}
            </span>
          </button>
        </nav>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="p-4 sm:px-6">
              <div className="flex items-start space-x-4">
                <Skeleton className="h-5 w-5 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            </div>
          ))
        ) : filteredTasks.length > 0 ? (
          filteredTasks.map(task => (
            <TaskItem key={task.id} task={task} />
          ))
        ) : (
          <div className="py-12 px-4 text-center">
            <div className="inline-block p-3 rounded-full bg-gray-100 text-gray-500 mb-4 dark:bg-gray-700 dark:text-gray-400">
              <InboxIcon className="h-6 w-6" />
            </div>
            <h3 className="text-base font-medium text-gray-800 mb-1 dark:text-gray-200">No tasks found</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">There are no tasks matching your current filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}

import { Task } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Trash } from "lucide-react";
import { formatDistanceToNow } from "@/lib/dateUtils";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface TaskItemProps {
  task: Task;
}

export default function TaskItem({ task }: TaskItemProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const toggleTask = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("PATCH", `/api/tasks/${task.id}`, {
        completed: !task.completed,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to update task",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    },
  });

  const deleteTask = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/tasks/${task.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: "Task deleted",
        description: "The task has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete task",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    },
  });

  const createdTimeAgo = formatDistanceToNow(new Date(task.createdAt));

  return (
    <div className="p-4 sm:px-6 hover:bg-gray-50 transition-colors group dark:hover:bg-gray-750">
      <div className="flex items-start justify-between">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-1">
            <button 
              className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
                task.completed 
                  ? "border-secondary bg-secondary hover:bg-secondary/90" 
                  : "border-gray-300 hover:border-primary dark:border-gray-500"
              )}
              onClick={() => toggleTask.mutate()}
              aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
              disabled={toggleTask.isPending}
            >
              {task.completed && (
                <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          </div>
          <div className="ml-3">
            <h3 className={cn(
              "text-sm font-medium",
              task.completed 
                ? "text-gray-600 line-through dark:text-gray-400" 
                : "text-gray-800 dark:text-gray-200"
            )}>
              {task.title}
            </h3>
            {task.description && (
              <div className={cn(
                "mt-1 text-sm",
                task.completed 
                  ? "text-gray-500 line-through dark:text-gray-500" 
                  : "text-gray-600 dark:text-gray-400"
              )}>
                {task.description}
              </div>
            )}
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">
              {task.completed ? `Completed ${createdTimeAgo}` : `Added ${createdTimeAgo}`}
            </div>
          </div>
        </div>
        <div className="ml-4 flex-shrink-0">
          <button 
            className="text-gray-400 hover:text-red-500 focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity dark:text-gray-500 dark:hover:text-red-400"
            onClick={() => deleteTask.mutate()}
            aria-label="Delete task"
            disabled={deleteTask.isPending}
          >
            <Trash className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

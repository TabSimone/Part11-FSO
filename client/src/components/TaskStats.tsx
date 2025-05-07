import { Task } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TaskStatsProps {
  tasks: Task[];
  completedTasksCount: number;
  completionPercentage: number;
}

export default function TaskStats({ 
  tasks, 
  completedTasksCount,
  completionPercentage 
}: TaskStatsProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const clearCompleted = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", "/api/tasks");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: "Completed tasks cleared",
        description: "All completed tasks have been removed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to clear tasks",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    },
  });

  if (tasks.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4 shadow-sm dark:bg-gray-800">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-0">
          <span>{completedTasksCount}</span> of <span>{tasks.length}</span> tasks completed
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2 sm:w-32 dark:bg-gray-700">
            <div 
              className="bg-secondary h-1.5 rounded-full" 
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>
        {completedTasksCount > 0 && (
          <button 
            className="text-sm text-red-500 hover:text-red-700 focus:outline-none inline-flex items-center dark:text-red-400 dark:hover:text-red-300"
            onClick={() => clearCompleted.mutate()}
            disabled={clearCompleted.isPending}
          >
            <Trash className="h-4 w-4 mr-1" />
            Clear completed
          </button>
        )}
      </div>
    </div>
  );
}

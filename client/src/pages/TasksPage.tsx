import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Task } from "@shared/schema";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import TaskStats from "@/components/TaskStats";
import { useTheme } from "@/contexts/ThemeContext";
import { Check, Moon, Sun, Github, BookOpen, Settings } from "lucide-react";

type FilterType = "all" | "active" | "completed";

export default function TasksPage() {
  const [filter, setFilter] = useState<FilterType>("all");
  const { theme, toggleTheme } = useTheme();
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const filteredTasks = tasks.filter(task => {
    if (filter === "all") return true;
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  const activeTasksCount = tasks.filter(task => !task.completed).length;
  const completedTasksCount = tasks.filter(task => task.completed).length;
  const completionPercentage = tasks.length > 0 
    ? Math.round((completedTasksCount / tasks.length) * 100) 
    : 0;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <header className="bg-white shadow-sm dark:bg-gray-800 dark:shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center">
            <Check className="text-primary text-2xl mr-2" />
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">TaskMaster</h1>
          </div>
          <button 
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 flex items-center" 
            onClick={toggleTheme}
          >
            {theme === "dark" ? <Sun className="h-4 w-4 mr-1" /> : <Moon className="h-4 w-4 mr-1" />}
            <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
          </button>
        </div>
      </header>

      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          <TaskForm />
          
          <TaskList 
            tasks={tasks}
            filteredTasks={filteredTasks}
            filter={filter}
            setFilter={setFilter}
            activeTasksCount={activeTasksCount}
            completedTasksCount={completedTasksCount}
            isLoading={isLoading}
          />
          
          <TaskStats 
            tasks={tasks}
            completedTasksCount={completedTasksCount}
            completionPercentage={completionPercentage}
          />
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-auto dark:bg-gray-800 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6">
          <div className="flex flex-col items-center justify-between sm:flex-row">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-0">
              TaskMaster - A Simple Todo Application
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300" aria-label="GitHub repository">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300" aria-label="Documentation">
                <BookOpen className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300" aria-label="Settings">
                <Settings className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

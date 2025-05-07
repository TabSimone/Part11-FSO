import { Task } from "@shared/schema";

export function getCompletionStats(tasks: Task[]) {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  
  return {
    totalTasks: total,
    completedTasks: completed,
    activeTasks: total - completed,
    completionPercentage: total > 0 ? Math.round((completed / total) * 100) : 0
  };
}

export function filterTasks(tasks: Task[], filter: 'all' | 'active' | 'completed') {
  switch (filter) {
    case 'active':
      return tasks.filter(task => !task.completed);
    case 'completed':
      return tasks.filter(task => task.completed);
    case 'all':
    default:
      return tasks;
  }
}

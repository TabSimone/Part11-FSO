import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import TasksPage from "@/pages/TasksPage";
import { useTheme } from "./contexts/ThemeContext";

// Router component to handle routes
function Router() {
  return (
    <Switch>
      <Route path="/" component={TasksPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

// Main App component
function App() {
  // Get theme from context
  const { theme } = useTheme();
  
  return (
    <div className={theme}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
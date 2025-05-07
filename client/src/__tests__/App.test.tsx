import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '../contexts/ThemeContext';

// Mock the API requests
global.fetch = jest.fn();

const mockTasks = [
  {
    id: 1,
    title: 'Test task 1',
    description: 'Test description',
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Test task 2',
    description: null,
    completed: true,
    createdAt: new Date().toISOString()
  }
];

beforeEach(() => {
  jest.clearAllMocks();
  
  // Mock fetch to return tasks
  (global.fetch as jest.Mock).mockImplementation((url) => {
    if (url === '/api/tasks') {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockTasks)
      });
    }
    
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({})
    });
  });
});

function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  
  return render(
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    </ThemeProvider>
  );
}

describe('App', () => {
  test('renders the application header', async () => {
    renderWithProviders(<App />);
    expect(await screen.findByText('TaskMaster')).toBeInTheDocument();
  });

  test('renders the task form', async () => {
    renderWithProviders(<App />);
    expect(await screen.findByText('Add New Task')).toBeInTheDocument();
    expect(screen.getByLabelText(/Title/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Task/i })).toBeInTheDocument();
  });

  test('renders task list with filters', async () => {
    renderWithProviders(<App />);
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /All/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Active/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Completed/i })).toBeInTheDocument();
    });
  });

  test('can toggle dark mode', async () => {
    renderWithProviders(<App />);
    
    const darkModeToggle = await screen.findByText(/Dark Mode/i);
    expect(darkModeToggle).toBeInTheDocument();
    
    await userEvent.click(darkModeToggle);
    expect(screen.getByText(/Light Mode/i)).toBeInTheDocument();
  });
});

import express from 'express';
import request from 'supertest';
import { registerRoutes } from '../routes';
import { storage } from '../storage';

// Mock the storage methods
jest.mock('../storage', () => ({
  storage: {
    getAllTasks: jest.fn(),
    getTaskById: jest.fn(),
    createTask: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
    clearCompletedTasks: jest.fn(),
  },
}));

const mockedStorage = storage as jest.Mocked<typeof storage>;

describe('Task API Routes', () => {
  let app: express.Express;
  let server: any;

  beforeAll(async () => {
    app = express();
    app.use(express.json());
    server = await registerRoutes(app);
  });

  afterAll(() => {
    server.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/tasks', () => {
    it('should return all tasks', async () => {
      const mockTasks = [
        { id: 1, title: 'Task 1', completed: false, createdAt: new Date() },
        { id: 2, title: 'Task 2', completed: true, createdAt: new Date() },
      ];
      
      mockedStorage.getAllTasks.mockResolvedValue(mockTasks);
      
      const response = await request(app).get('/api/tasks');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockTasks);
      expect(mockedStorage.getAllTasks).toHaveBeenCalledTimes(1);
    });

    it('should handle errors', async () => {
      mockedStorage.getAllTasks.mockRejectedValue(new Error('Database error'));
      
      const response = await request(app).get('/api/tasks');
      
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const newTask = { title: 'New Task', description: 'Description' };
      const createdTask = { id: 1, ...newTask, completed: false, createdAt: new Date() };
      
      mockedStorage.createTask.mockResolvedValue(createdTask);
      
      const response = await request(app)
        .post('/api/tasks')
        .send(newTask);
      
      expect(response.status).toBe(201);
      expect(response.body).toEqual(createdTask);
      expect(mockedStorage.createTask).toHaveBeenCalledWith(expect.objectContaining(newTask));
    });

    it('should validate the request body', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ description: 'Missing title' });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(mockedStorage.createTask).not.toHaveBeenCalled();
    });
  });

  describe('PATCH /api/tasks/:id', () => {
    it('should update a task', async () => {
      const taskId = 1;
      const update = { completed: true };
      const updatedTask = { id: taskId, title: 'Task', ...update, createdAt: new Date() };
      
      mockedStorage.updateTask.mockResolvedValue(updatedTask);
      
      const response = await request(app)
        .patch(`/api/tasks/${taskId}`)
        .send(update);
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedTask);
      expect(mockedStorage.updateTask).toHaveBeenCalledWith(taskId, update);
    });

    it('should return 404 if task is not found', async () => {
      mockedStorage.updateTask.mockResolvedValue(undefined);
      
      const response = await request(app)
        .patch('/api/tasks/999')
        .send({ completed: true });
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete a task', async () => {
      const taskId = 1;
      
      mockedStorage.deleteTask.mockResolvedValue(true);
      
      const response = await request(app).delete(`/api/tasks/${taskId}`);
      
      expect(response.status).toBe(204);
      expect(mockedStorage.deleteTask).toHaveBeenCalledWith(taskId);
    });

    it('should return 404 if task is not found', async () => {
      mockedStorage.deleteTask.mockResolvedValue(false);
      
      const response = await request(app).delete('/api/tasks/999');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('DELETE /api/tasks (clear completed)', () => {
    it('should clear completed tasks', async () => {
      mockedStorage.clearCompletedTasks.mockResolvedValue(true);
      
      const response = await request(app).delete('/api/tasks');
      
      expect(response.status).toBe(204);
      expect(mockedStorage.clearCompletedTasks).toHaveBeenCalledTimes(1);
    });

    it('should return 404 if no completed tasks found', async () => {
      mockedStorage.clearCompletedTasks.mockResolvedValue(false);
      
      const response = await request(app).delete('/api/tasks');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message');
    });
  });
});

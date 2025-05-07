import { tasks, type Task, type InsertTask } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<any | undefined>;
  getUserByUsername(username: string): Promise<any | undefined>;
  createUser(user: any): Promise<any>;
  
  // Task related methods
  getAllTasks(): Promise<Task[]>;
  getTaskById(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: Partial<InsertTask>): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;
  clearCompletedTasks(): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, any>;
  private taskList: Map<number, Task>;
  private userCurrentId: number;
  private taskCurrentId: number;

  constructor() {
    this.users = new Map();
    this.taskList = new Map();
    this.userCurrentId = 1;
    this.taskCurrentId = 1;
  }

  async getUser(id: number): Promise<any | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<any | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: any): Promise<any> {
    const id = this.userCurrentId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllTasks(): Promise<Task[]> {
    return Array.from(this.taskList.values()).sort((a, b) => {
      // Sort by created date (newest first) and then by completion status
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  async getTaskById(id: number): Promise<Task | undefined> {
    return this.taskList.get(id);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = this.taskCurrentId++;
    const now = new Date();
    const task: Task = { 
      ...insertTask, 
      id,
      createdAt: now
    };
    this.taskList.set(id, task);
    return task;
  }

  async updateTask(id: number, taskUpdate: Partial<InsertTask>): Promise<Task | undefined> {
    const task = this.taskList.get(id);
    if (!task) return undefined;
    
    const updatedTask = { ...task, ...taskUpdate };
    this.taskList.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: number): Promise<boolean> {
    return this.taskList.delete(id);
  }

  async clearCompletedTasks(): Promise<boolean> {
    const tasks = Array.from(this.taskList.values());
    let deleted = false;
    
    tasks.forEach(task => {
      if (task.completed) {
        this.taskList.delete(task.id);
        deleted = true;
      }
    });
    
    return deleted;
  }
}

export const storage = new MemStorage();

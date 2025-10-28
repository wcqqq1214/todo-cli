import {
  Task,
  CreateTaskInput,
  UpdateTaskInput,
  Result,
  TaskFilter,
  TaskStatus,
} from '../types';
import { FileStorage } from './FileStorage';
import { generateTaskId } from '../utils/idGenerator';
import { validateTitle, validateDescription } from '../utils/validator';

/**
 * 任务管理器
 * 负责所有任务相关的业务逻辑
 */
export class TaskManager {
  private storage: FileStorage;

  constructor(storage: FileStorage) {
    this.storage = storage;
  }

  /**
   * 添加新任务
   */
  addTask(input: CreateTaskInput): Result<Task> {
    // 1. 验证输入
    const titleValidation = validateTitle(input.title);
    if (!titleValidation.success) {
      return titleValidation as Result<Task>;
    }

    if (input.description) {
      const descValidation = validateDescription(input.description);
      if (!descValidation.success) {
        return descValidation as Result<Task>;
      }
    }

    // 2. 创建任务对象
    const now = new Date();
    const newTask: Task = {
      ...input,
      id: generateTaskId(),
      createdAt: now,
      updatedAt: now,
    };

    // 3. 保存任务
    const tasks = this.storage.readTasks();
    tasks.push(newTask);

    const saveResult = this.storage.saveTasks(tasks);
    if (!saveResult.success) {
      return saveResult as Result<Task>;
    }

    return {
      success: true,
      data: newTask,
      message: '任务创建成功',
    };
  }

  /**
   * 获取所有任务
   */
  getAllTasks(): Task[] {
    return this.storage.readTasks();
  }

  /**
   * 根据 ID 获取任务
   */
  getTaskById(id: string): Result<Task> {
    const tasks = this.storage.readTasks();
    const task = tasks.find((t) => t.id === id);

    if (!task) {
      return { success: false, error: '任务不存在' };
    }

    return { success: true, data: task };
  }

  /**
   * 更新任务
   */
  updateTask(id: string, updates: UpdateTaskInput): Result<Task> {
    const tasks = this.storage.readTasks();
    const index = tasks.findIndex((t) => t.id === id);

    if (index === -1) {
      return { success: false, error: '任务不存在' };
    }

    // 验证更新的标题
    if (updates.title !== undefined) {
      const validation = validateTitle(updates.title);
      if (!validation.success) {
        return validation as Result<Task>;
      }
    }

    // 更新任务
    const updatedTask: Task = {
      ...tasks[index],
      ...updates,
      updatedAt: new Date(), // 更新时间戳
    };

    // 如果状态改为 done，记录完成时间
    if (updates.status === TaskStatus.Done && !tasks[index].completedAt) {
      updatedTask.completedAt = new Date();
    }

    tasks[index] = updatedTask;

    const saveResult = this.storage.saveTasks(tasks);
    if (!saveResult.success) {
      return saveResult as Result<Task>;
    }

    return {
      success: true,
      data: updatedTask,
      message: '任务更新成功',
    };
  }

  /**
   * 删除任务
   */
  deleteTask(id: string): Result<void> {
    const tasks = this.storage.readTasks();
    const index = tasks.findIndex((t) => t.id === id);

    if (index === -1) {
      return { success: false, error: '任务不存在' };
    }

    tasks.splice(index, 1);

    const saveResult = this.storage.saveTasks(tasks);
    if (!saveResult.success) {
      return saveResult;
    }

    return {
      success: true,
      data: undefined,
      message: '任务删除成功',
    };
  }

  /**
   * 搜索任务
   */
  searchTasks(keyword: string): Task[] {
    const tasks = this.storage.readTasks();
    const lowerKeyword = keyword.toLowerCase();

    return tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(lowerKeyword) ||
        task.description?.toLowerCase().includes(lowerKeyword) ||
        task.tags.some((tag) => tag.toLowerCase().includes(lowerKeyword))
    );
  }

  /**
   * 筛选任务
   */
  filterTasks(filter: TaskFilter): Task[] {
    let tasks = this.storage.readTasks();

    // 按状态筛选
    if (filter.status !== undefined) {
      tasks = tasks.filter((t) => t.status === filter.status);
    }

    // 按优先级筛选
    if (filter.priority !== undefined) {
      tasks = tasks.filter((t) => t.priority === filter.priority);
    }

    // 按标签筛选
    if (filter.tags && filter.tags.length > 0) {
      tasks = tasks.filter((t) =>
        filter.tags!.some((tag) => t.tags.includes(tag))
      );
    }

    // 按关键词筛选
    if (filter.keyword) {
      const keyword = filter.keyword.toLowerCase();
      tasks = tasks.filter(
        (t) =>
          t.title.toLowerCase().includes(keyword) ||
          t.description?.toLowerCase().includes(keyword)
      );
    }

    // 按逾期状态筛选
    if (filter.isOverdue) {
      tasks = tasks.filter(
        (t) =>
          t.dueDate && t.status !== TaskStatus.Done && t.dueDate < new Date()
      );
    }

    return tasks;
  }
}

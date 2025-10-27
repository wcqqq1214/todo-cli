/**
 * 任务状态枚举
 */
export enum TaskStatus {
  Todo = 'todo',
  InProgress = 'in_progress',
  Done = 'done',
}

/**
 * 任务优先级枚举
 */
export enum Priority {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

/**
 * 任务接口
 */
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  tags: string[];
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

/**
 * 任务筛选条件
 */
export interface TaskFilter {
  status?: TaskStatus;
  priority?: Priority;
  tags?: string[];
  keyword?: string;
  dueDateFrom?: Date;
  dueDateTo?: Date;
  isOverdue?: boolean;
}

/**
 * 任务统计信息
 */
export interface TaskStatistics {
  total: number;
  byStatus: Record<TaskStatus, number>;
  byPriority: Record<Priority, number>;
  completionRate: number;
  overdueCount: number;
  dueTodayCount: number;
  dueThisWeekCount: number;
}

/**
 * 统一的操作结果类型
 */
export type Result<T> =
  | { success: true; data: T; message?: string }
  | { success: false; error: string; details?: any };

/**
 * 创建任务输入类型（排除自动生成的字段）
 */
export type CreateTaskInput = Omit<
  Task,
  'id' | 'createdAt' | 'updatedAt' | 'completedAt'
>;

/**
 * 更新任务输入类型（所有字段可选）
 */
export type UpdateTaskInput = Partial<Omit<Task, 'id' | 'createdAt'>>;

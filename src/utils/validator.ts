import { Result, Task } from '../types';

/**
 * 验证任务标题
 */
export function validateTitle(title: string): Result<void> {
  if (!title || title.trim().length === 0) {
    return { success: false, error: '标题不能为空' };
  }

  if (title.length > 200) {
    return { success: false, error: '标题不能超过 200 个字符' };
  }

  return { success: true, data: undefined };
}

/**
 * 验证任务描述
 */
export function validateDescription(description: string): Result<void> {
  if (description.length > 1000) {
    return { success: false, error: '描述不能超过 1000 个字符' };
  }

  return { success: true, data: undefined };
}

/**
 * 验证日期字符串
 */
export function validateDateString(dateString: string): Result<Date> {
  if (!dateString) {
    return { success: true, data: new Date() };
  }

  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return { success: false, error: '无效的日期格式' };
  }

  return { success: true, data: date };
}

/**
 * 类型守卫：检查是否为有效的任务对象
 */
export function isValidTask(value: unknown): value is Task {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const obj = value as Record<string, unknown>;

  return (
    typeof obj.id === 'string' &&
    typeof obj.title === 'string' &&
    typeof obj.status === 'string' &&
    typeof obj.priority === 'string' &&
    Array.isArray(obj.tags)
  );
}

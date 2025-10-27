import { isAfter, isBefore, addDays, isSameDay } from 'date-fns';

/**
 * 检查任务是否逾期
 */
export function isOverdue(dueDate: Date | undefined, status: string): boolean {
  if (!dueDate || status === 'done') {
    return false;
  }

  return isBefore(dueDate, new Date());
}

/**
 * 检查任务是否在指定天数内到期
 */
export function isDueSoon(dueDate: Date | undefined, days: number): boolean {
  if (!dueDate) {
    return false;
  }

  const deadline = addDays(new Date(), days);
  return isBefore(dueDate, deadline) && isAfter(dueDate, new Date());
}

/**
 * 检查日期是否在今天
 */
export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

import chalk from 'chalk';
import { format } from 'date-fns';
import { TaskStatus, Priority } from '../types';

/**
 * 格式化任务状态显示
 */
export function formatStatus(status: TaskStatus): string {
  switch (status) {
    case TaskStatus.Todo:
      return chalk.yellow('⏳ 待办');
    case TaskStatus.InProgress:
      return chalk.blue('🔄 进行中');
    case TaskStatus.Done:
      return chalk.green('✅ 已完成');
  }
}

/**
 * 格式化优先级显示
 */
export function formatPriority(priority: Priority): string {
  switch (priority) {
    case Priority.Low:
      return chalk.green('🟢 低');
    case Priority.Medium:
      return chalk.yellow('🟡 中');
    case Priority.High:
      return chalk.red('🔴 高');
  }
}

/**
 * 格式化日期显示
 */
export function formatDate(date: Date): string {
  return format(date, 'yyyy-MM-dd HH:mm:ss');
}

/**
 * 格式化短日期
 */
export function formatShortDate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

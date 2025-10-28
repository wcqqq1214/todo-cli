import Table from 'cli-table3';
import chalk from 'chalk';
import { Task } from '../../types';
import {
  formatStatus,
  formatPriority,
  formatShortDate,
} from '../../utils/formatter';

/**
 * 以表格形式显示任务列表
 */
export function displayTaskTable(tasks: Task[]): void {
  if (tasks.length === 0) {
    console.log(chalk.yellow('\n暂无任务\n'));
    return;
  }

  const table = new Table({
    head: ['序号', 'ID', '标题', '状态', '优先级', '标签', '截止日期'],
    colWidths: [6, 15, 30, 12, 10, 20, 12],
  });

  tasks.forEach((task, index) => {
    table.push([
      index + 1,
      task.id.substring(0, 12) + '...',
      task.title.length > 25 ? task.title.substring(0, 25) + '...' : task.title,
      formatStatus(task.status),
      formatPriority(task.priority),
      task.tags.slice(0, 2).join(', '),
      task.dueDate ? formatShortDate(task.dueDate) : '-',
    ]);
  });

  console.log('\n' + table.toString());
  console.log(chalk.gray(`\n共 ${tasks.length} 个任务\n`));
}

/**
 * 显示任务详情
 */
export function displayTaskDetail(task: Task): void {
  console.log(chalk.cyan('\n━━━━━━━━━━ 任务详情 ━━━━━━━━━━'));
  console.log(`📝 标题: ${chalk.bold(task.title)}`);
  console.log(`🆔 ID: ${chalk.gray(task.id)}`);

  if (task.description) {
    console.log(`📄 描述: ${task.description}`);
  }

  console.log(`📊 状态: ${formatStatus(task.status)}`);
  console.log(`🎯 优先级: ${formatPriority(task.priority)}`);

  if (task.tags.length > 0) {
    console.log(`🏷️ 标签: ${task.tags.join(', ')}`);
  }

  if (task.dueDate) {
    console.log(`📅 截止日期: ${formatShortDate(task.dueDate)}`);
  }

  console.log(`⏰ 创建时间: ${formatShortDate(task.createdAt)}`);
  console.log(`🔄 更新时间: ${formatShortDate(task.updatedAt)}`);

  if (task.completedAt) {
    console.log(`✅ 完成时间: ${formatShortDate(task.completedAt)}`);
  }

  console.log(chalk.cyan('━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n'));
}

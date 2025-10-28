import inquirer from 'inquirer';
import { CreateTaskInput, Priority, TaskStatus, Task } from '../../types';
import { validateTitle, validateDescription } from '../../utils/validator';

/**
 * 获取新任务输入
 */
export async function promptNewTask(): Promise<CreateTaskInput> {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: '任务标题:',
      validate: (input) => {
        const result = validateTitle(input);
        return result.success ? true : result.error;
      },
    },
    {
      type: 'input',
      name: 'description',
      message: '任务描述 (可选，直接回车跳过):',
      validate: (input) => {
        if (!input) return true;
        const result = validateDescription(input);
        return result.success ? true : result.error;
      },
    },
    {
      type: 'list',
      name: 'priority',
      message: '优先级:',
      choices: [
        { name: '🟢 低', value: Priority.Low },
        { name: '🟡 中', value: Priority.Medium },
        { name: '🔴 高', value: Priority.High },
      ],
      default: Priority.Medium,
    },
    {
      type: 'input',
      name: 'tags',
      message: '标签 (多个标签用逗号分隔，可选):',
    },
    {
      type: 'input',
      name: 'dueDate',
      message: '截止日期 (格式: YYYY-MM-DD，可选):',
      validate: (input) => {
        if (!input) return true;
        const date = new Date(input);
        if (isNaN(date.getTime())) {
          return '日期格式不正确';
        }
        return true;
      },
    },
  ]);

  return {
    title: answers.title,
    description: answers.description || undefined,
    status: TaskStatus.Todo,
    priority: answers.priority,
    tags: answers.tags
      ? answers.tags
          .split(',')
          .map((t: string) => t.trim())
          .filter(Boolean)
      : [],
    dueDate: answers.dueDate ? new Date(answers.dueDate) : undefined,
  };
}

/**
 * 选择任务（从列表）
 */
export async function promptSelectTask(tasks: Task[]): Promise<Task | null> {
  if (tasks.length === 0) {
    return null;
  }

  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'task',
      message: '选择任务:',
      choices: tasks.map((task) => ({
        name: `${task.title} (${task.id.substring(0, 8)}...)`,
        value: task,
      })),
    },
  ]);

  return answer.task;
}

/**
 * 确认操作
 */
export async function promptConfirm(message: string): Promise<boolean> {
  const answer = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmed',
      message,
      default: false,
    },
  ]);

  return answer.confirmed;
}

import path from 'path';
import chalk from 'chalk';
import { FileStorage } from './services/FileStorage';
import { TaskManager } from './services/TaskManager';
import { showMainMenu, MainMenuOption } from './cli/menus/mainMenu';
import {
  promptNewTask,
  promptSelectTask,
  promptConfirm,
} from './cli/prompts/taskPrompts';
import { displayTaskTable, displayTaskDetail } from './cli/display/taskDisplay';
import { TaskStatus } from './types';
import inquirer from 'inquirer';

/**
 * 应用程序主类
 */
class App {
  private storage: FileStorage;
  private taskManager: TaskManager;

  constructor() {
    const dataPath = path.join(__dirname, '../data/tasks.json');
    const backupDir = path.join(__dirname, '../data/backups');

    this.storage = new FileStorage(dataPath, backupDir);
    this.taskManager = new TaskManager(this.storage);
  }

  /**
   * 启动应用
   */
  async start(): Promise<void> {
    // 显示欢迎信息
    console.clear();
    console.log(
      chalk.cyan.bold('\n╔════════════════════════════════════════╗')
    );
    console.log(chalk.cyan.bold('║       TaskMaster CLI v1.0              ║'));
    console.log(
      chalk.cyan.bold('╚════════════════════════════════════════╝\n')
    );

    let running = true;

    while (running) {
      const action = await showMainMenu();

      switch (action) {
        case MainMenuOption.AddTask:
          await this.handleAddTask();
          break;

        case MainMenuOption.ViewTasks:
          await this.handleViewTasks();
          break;

        case MainMenuOption.SearchTasks:
          await this.handleSearchTasks();
          break;

        case MainMenuOption.UpdateTask:
          await this.handleUpdateTask();
          break;

        case MainMenuOption.DeleteTask:
          await this.handleDeleteTask();
          break;

        case MainMenuOption.Exit:
          running = false;
          break;

        default:
          console.log(chalk.yellow('\n功能开发中...\n'));
      }

      if (running) {
        await this.pressEnterToContinue();
      }
    }

    console.log(chalk.green('\n👋 再见！\n'));
  }

  /**
   * 处理添加任务
   */
  private async handleAddTask(): Promise<void> {
    console.log(chalk.cyan('\n━━━━ 添加新任务 ━━━━\n'));

    const input = await promptNewTask();
    const result = this.taskManager.addTask(input);

    if (result.success) {
      console.log(chalk.green(`\n✅ ${result.message}`));
      displayTaskDetail(result.data);
    } else {
      console.log(chalk.red(`\n❌ ${result.error}`));
    }
  }

  /**
   * 处理查看任务
   */
  private async handleViewTasks(): Promise<void> {
    console.log(chalk.cyan('\n━━━━ 任务列表 ━━━━'));

    const tasks = this.taskManager.getAllTasks();
    displayTaskTable(tasks);
  }

  /**
   * 处理搜索任务
   */
  private async handleSearchTasks(): Promise<void> {
    const answer = await inquirer.prompt([
      {
        type: 'input',
        name: 'keyword',
        message: '搜索关键词：',
      },
    ]);

    const tasks = this.taskManager.searchTasks(answer.keyword);
    console.log(
      chalk.cyan(`\n━━━━ 搜索结果 (关键词: "${answer.keyword}") ━━━━`)
    );
    displayTaskTable(tasks);
  }

  /**
   * 处理更新任务
   */
  private async handleUpdateTask(): Promise<void> {
    const tasks = this.taskManager.getAllTasks();

    if (tasks.length === 0) {
      console.log(chalk.yellow('\n暂无任务\n'));
      return;
    }

    const task = await promptSelectTask(tasks);
    if (!task) return;

    // 显示当前任务信息
    displayTaskDetail(task);

    // 选择要更新的操作
    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: '选择操作：',
        choices: [
          { name: '标记为进行中', value: 'in_progress' },
          { name: '标记为已完成', value: 'done' },
          { name: '标记为待办', value: 'todo' },
          { name: '返回', value: 'cancel' },
        ],
        loop: false,
      },
    ]);

    if (answer.action === 'cancel') return;

    const result = this.taskManager.updateTask(task.id, {
      status: answer.action as TaskStatus,
    });

    if (result.success) {
      console.log(chalk.green(`\n✅ ${result.message}`));
    } else {
      console.log(chalk.red(`\n❌ ${result.error}`));
    }
  }

  /**
   * 处理删除任务
   */
  private async handleDeleteTask(): Promise<void> {
    const tasks = this.taskManager.getAllTasks();

    if (tasks.length === 0) {
      console.log(chalk.yellow('\n暂无任务\n'));
      return;
    }

    const task = await promptSelectTask(tasks);
    if (!task) return;

    // 显示即将删除的任务
    displayTaskDetail(task);

    // 确认删除
    const confirmed = await promptConfirm('确定要删除这个任务吗？');

    if (!confirmed) {
      console.log(chalk.yellow('\n已取消删除\n'));
      return;
    }

    const result = this.taskManager.deleteTask(task.id);

    if (result.success) {
      console.log(chalk.green(`\n✅ ${result.message}`));
    } else {
      console.log(chalk.red(`\n❌ ${result.error}`));
    }
  }

  /**
   * 等待用户按回车继续
   */
  private async pressEnterToContinue(): Promise<void> {
    await inquirer.prompt([
      {
        type: 'input',
        name: 'continue',
        message: '按回车键继续...',
      },
    ]);
  }
}

const app = new App();
app.start().catch((error) => {
  console.error(chalk.red('\n程序发生错误:'), error);
  process.exit(1);
});

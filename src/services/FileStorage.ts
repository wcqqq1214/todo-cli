import fs from 'fs';
import path from 'path';
import { Task, Result } from '../types';

/**
 * 文件存储服务
 * 负责任务数据的持久化
 */
export class FileStorage {
  private dataPath: string;
  private backupDir: string;

  constructor(dataPath: string, backupDir: string) {
    this.dataPath = dataPath;
    this.backupDir = backupDir;
    this.ensureDirectories();
  }

  /**
   * 确保必要的目录存在
   */
  private ensureDirectories(): void {
    const dataDir = path.dirname(this.dataPath);

    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
  }

  /**
   * 读取所有任务
   */
  readTasks(): Task[] {
    try {
      if (!fs.existsSync(this.dataPath)) {
        return [];
      }

      const data = fs.readFileSync(this.dataPath, 'utf-8');
      const tasks = JSON.parse(data) as Task[];

      // 将日期字符串转换为 Date 对象
      return tasks.map((task) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
      }));
    } catch (error) {
      console.error('读取任务失败:', error);
      return [];
    }
  }

  /**
   * 保存任务
   */
  saveTasks(tasks: Task[]): Result<void> {
    try {
      const data = JSON.stringify(tasks, null, 2);
      fs.writeFileSync(this.dataPath, data, 'utf-8');
      return { success: true, data: undefined };
    } catch (error) {
      return {
        success: false,
        error: '保存任务失败',
        details: error,
      };
    }
  }

  /**
   * 创建备份
   */
  createBackup(): Result<string> {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = path.join(
        this.backupDir,
        `tasks_backup_${timestamp}.json`
      );

      if (fs.existsSync(this.dataPath)) {
        fs.copyFileSync(this.dataPath, backupPath);
      }

      // 清理旧备份（保留最近 10 个）
      this.cleanOldBackups(10);

      return { success: true, data: backupPath };
    } catch (error) {
      return {
        success: false,
        error: '创建备份失败',
        details: error,
      };
    }
  }

  /**
   * 清理旧备份
   */
  private cleanOldBackups(keepCount: number): void {
    try {
      const files = fs
        .readdirSync(this.backupDir)
        .filter((file) => file.startsWith('tasks_backup_'))
        .map((file) => ({
          name: file,
          path: path.join(this.backupDir, file),
          time: fs.statSync(path.join(this.backupDir, file)).mtime.getTime(),
        }))
        .sort((a, b) => b.time - a.time);

      // 删除超出保留数量的备份
      files.slice(keepCount).forEach((file) => {
        fs.unlinkSync(file.path);
      });
    } catch (error) {
      console.error('清理备份失败:', error);
    }
  }

  /**
   * 获取所有备份文件
   */
  getBackupFiles(): string[] {
    try {
      return fs
        .readdirSync(this.backupDir)
        .filter((file) => file.startsWith('tasks_backup_'))
        .sort()
        .reverse();
    } catch (error) {
      return [];
    }
  }

  /**
   * 从备份恢复
   */
  restoreFromBackup(backupFileName: string): Result<void> {
    try {
      const backupPath = path.join(this.backupDir, backupFileName);

      if (!fs.existsSync(backupPath)) {
        return { success: false, error: '备份文件不存在' };
      }

      fs.copyFileSync(backupPath, this.dataPath);
      return { success: true, data: undefined };
    } catch (error) {
      return {
        success: false,
        error: '恢复备份失败',
        details: error,
      };
    }
  }
}

import { v4 as uuidv4 } from 'uuid';

/**
 * 生成任务 ID
 * @returns 格式为 task_时间戳_随机字符串 的唯一 ID
 */
export function generateTaskId(): string {
  const timestamp = Date.now();
  const randomPart = uuidv4().split('-')[0];
  return `task_${timestamp}_${randomPart}`;
}

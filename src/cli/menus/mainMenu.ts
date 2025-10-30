import inquirer from 'inquirer';

export enum MainMenuOption {
  AddTask = 'add',
  ViewTasks = 'view',
  SearchTasks = 'search',
  UpdateTask = 'update',
  DeleteTask = 'delete',
  Statistics = 'stats',
  DataManagement = 'data',
  Exit = 'exit',
}

/**
 * 显示主菜单
 */
export async function showMainMenu(): Promise<MainMenuOption> {
  console.log('\n'); // 添加空行

  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: '请选择操作:',
      choices: [
        { name: '📝 添加任务', value: MainMenuOption.AddTask },
        { name: '📋 查看任务列表', value: MainMenuOption.ViewTasks },
        { name: '🔍 搜索任务', value: MainMenuOption.SearchTasks },
        { name: '✏️  更新任务', value: MainMenuOption.UpdateTask },
        { name: '🗑️  删除任务', value: MainMenuOption.DeleteTask },
        { name: '📊 任务统计', value: MainMenuOption.Statistics },
        { name: '💾 数据管理', value: MainMenuOption.DataManagement },
        new inquirer.Separator(),
        { name: '🚪 退出', value: MainMenuOption.Exit },
      ],
    },
  ]);

  return answer.action;
}

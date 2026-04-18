import { TaskScheduler } from './TaskScheduler';
import { ScheduledTask } from './ScheduledTask';
import { TaskRunner } from './TaskRunner';

const scheduler = new TaskScheduler();

for (let i = 0; i < 5; i++) {
  const delay = i * 2000;
  const task: ScheduledTask = {
    id: `task-${i}`,
    runAt: Date.now() + delay,
    createdAt: Date.now(),
    priority: Math.floor(Math.random() * 10),
    type: ['email', 'retry', 'sync'][i % 3] as any,
    payload: { index: i }
  };
  scheduler.schedule(task);
}

setInterval(async () => {
  const due = scheduler.pollDueTasks();
  for (const task of due) {
    await TaskRunner.run(task); // This is where the task is executed
  }
}, 1000);
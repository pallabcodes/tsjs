import blessed from 'blessed';
import { SchedulerService } from '../scheduler/SchedulerService';

export function startTUI(scheduler: SchedulerService) {
  const screen = blessed.screen({ smartCSR: true });
  screen.title = 'super-cron TUI';

  const box = blessed.box({
    top: 'center',
    left: 'center',
    width: '90%',
    height: '90%',
    content: '',
    tags: true,
    border: { type: 'line' },
    style: { border: { fg: 'cyan' } }
  });

  screen.append(box);
  screen.key(['escape', 'q', 'C-c'], () => process.exit(0));

  const refresh = () => {
    const now = Date.now();
    const lines = scheduler.all()
      .sort((a, b) => a.runAt - b.runAt)
      .map(task => {
        const eta = Math.max(0, task.runAt - now);
        return `🔸 ${task.id} (${task.taskType}) - ETA: ${Math.floor(eta / 1000)}s`;
      });
    box.setContent(lines.join('\n'));
    screen.render();
  };

  refresh();
  setInterval(refresh, 1000);
}

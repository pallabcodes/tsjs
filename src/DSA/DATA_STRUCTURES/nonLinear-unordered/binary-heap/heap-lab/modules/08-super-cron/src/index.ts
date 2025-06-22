import { SchedulerService } from './scheduler/SchedulerService';
import { loadJobs } from './scheduler/JobLoader';
import { createApi } from './server/api';
import { startTUI } from './server/tui';



const scheduler = new SchedulerService();
const tasks = loadJobs();

startTUI(scheduler);

for (const task of tasks) {
  scheduler.schedule(task);
}

const app = createApi(scheduler);
app.listen(3000, () => console.log('✅ super-cron running on http://localhost:3000'));

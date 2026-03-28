import express from 'express';
import { SchedulerService } from '../scheduler/SchedulerService';
import { runTask } from '../scheduler/TaskRunner';
import axios from 'axios';
import { ScheduledTask } from '../core/ScheduledTask';

export function createApi(scheduler: SchedulerService) {
  const app = express();
  app.use(express.json());

  app.post('/job', (req, res) => {
    scheduler.schedule({ ...req.body, createdAt: Date.now(), runAt: Date.now() });
    res.json({ ok: true });
  });

  app.get('/jobs', (req, res) => {
    res.json(scheduler.all());
  });

 setInterval(async () => {
  const due = scheduler.pollDue();
  for (const task of due) await runTask(task, scheduler);
}, 1000);


  return app;
}

export async function handleWebhook(task: ScheduledTask) {
  const { url, headers, body } = task.payload;
  const res = await axios.post(url, body, { headers });
  console.log(`📡 Webhook sent to ${url} → status ${res.status}`);
}
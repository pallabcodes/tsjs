import axios from "axios";
import { ScheduledTask } from "../core/ScheduledTask";
import { handleWebhook } from "../server/api";
import { handleEmail } from "./handlers/email";
import { handleLog } from "./handlers/log";
import { SchedulerService } from "./SchedulerService";

export async function runTask(task: ScheduledTask, scheduler: SchedulerService) {
  try {
    switch (task.taskType) {
      case 'email':
        try {
          await handleEmail(task);
        } catch (err) {
          await notifyFailure(task, err);
          if (task.retry && task.retry.retries > 0) {
            task.retry.retries -= 1;
            task.runAt = Date.now() + (task.retry.backoffMs ?? 1000);
            scheduler.schedule(task);
            return;
          }
        }
        break;
      case 'log':
        try {
          await handleLog(task);
        } catch (err) {
          await notifyFailure(task, err);
          if (task.retry && task.retry.retries > 0) {
            task.retry.retries -= 1;
            task.runAt = Date.now() + (task.retry.backoffMs ?? 1000);
            scheduler.schedule(task);
            return;
          }
        }
        break;
      case 'api':
        try {
          await handleWebhook(task);
        } catch (err) {
          await notifyFailure(task, err);
          if (task.retry && task.retry.retries > 0) {
            task.retry.retries -= 1;
            task.runAt = Date.now() + (task.retry.backoffMs ?? 1000);
            scheduler.schedule(task);
            return;
          }
        }
        break;
      default:
        console.warn(`❓ Unknown taskType: ${task.taskType}`);
    }
  } catch (err) {
    // fallback for unexpected errors
    await notifyFailure(task, err);
    if (task.retry && task.retry.retries > 0) {
      task.retry.retries -= 1;
      task.runAt = Date.now() + (task.retry.backoffMs ?? 1000);
      scheduler.schedule(task);
      return;
    }
  }

  // Interval repeat logic (only if not retried above)
  if (task.scheduleMode === 'interval' && task.repeat !== 0) {
    if (typeof task.repeat === 'number') task.repeat -= 1;
    task.runAt = Date.now() + (task.intervalMs ?? 1000);
    scheduler.schedule(task);
  }
}

async function notifyFailure(task: ScheduledTask, err: any) {
  const hook = task.onFailure;
  if (!hook) return;

  const msg = hook.message || `❌ Task ${task.id} failed with error: ${err?.message ?? err}`;

  if (hook.type === 'slack' || hook.type === 'webhook') {
    await axios.post(hook.to, { text: msg, task });
  } else if (hook.type === 'email') {
    console.log(`📧 Email sent to ${hook.to}: ${msg}`); // Replace w/ nodemailer if needed
  }
}

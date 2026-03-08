import { ScheduledTask } from "./ScheduledTask";

export class TaskRunner {
  static async run(task: ScheduledTask) {
    switch (task.type) {
      case 'email':
        console.log(`📧 [Email] Sending email to ${task.payload.to}`);
        break;
      case 'retry':
        console.log(`🔁 [Retry] Retrying task: ${task.payload.jobId}`);
        break;
      case 'sync':
        console.log(`🔄 [Sync] Syncing ${task.payload.entity}`);
        break;
      default:
        console.warn(`❓ [Unknown] ${task.id}`);
    }
  }
}

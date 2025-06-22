import { ScheduledTask } from "../../core/ScheduledTask";

export async function handleEmail(task: ScheduledTask) {
  console.log(`📧 Sending email to ${task.payload.to} with subject "${task.payload.subject}"`);
}

export async function handleLog(task: ScheduledTask) {
  console.log(`📝 Log entry: ${task.payload.message}`);
}

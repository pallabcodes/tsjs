export type OperationStage =
  | "idle"
  | "planning"
  | "validating"
  | "running"
  | "awaiting_input"
  | "awaiting_conflict_resolution"
  | "completed"
  | "aborted"
  | "failed";

export interface OperationMeta {
  id: string;
  startedAt: number | null;
  updatedAt: number;
  branch: string;
  headline: string;
}

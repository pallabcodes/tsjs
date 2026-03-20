export interface GitCommandHandle {
  pid: number;
  cancel(): void;
  result: Promise<{ exitCode: number }>;
}

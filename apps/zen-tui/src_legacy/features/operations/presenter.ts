import { OperationMeta } from "./model.js";

export interface OperationBadgeViewModel {
  label: string;
  tone: "neutral" | "info" | "warning" | "danger" | "success";
}

export function toOperationBadge(meta: OperationMeta | null, label: string): OperationBadgeViewModel | null {
  if (!meta) return null;
  return { label, tone: "info" };
}

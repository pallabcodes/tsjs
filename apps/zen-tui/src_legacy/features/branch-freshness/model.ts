export interface BranchFreshness {
  sourceBranch: string;
  workingBranch: string;
  aheadOfSource: number;
  behindSource: number;
  overlapRisk: "low" | "medium" | "high";
  recommendation: "no_action" | "consider_rebase" | "rebase_recommended" | "merge_recommended";
}

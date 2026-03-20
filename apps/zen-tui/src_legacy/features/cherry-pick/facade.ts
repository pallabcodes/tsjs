import { createIdleCherryPickState } from "./engine.js";

export const cherryPick = {
  start(input: { targetBranch: string }) {
    return { ...createIdleCherryPickState(), stage: "selecting" as const, targetBranch: input.targetBranch };
  },
};

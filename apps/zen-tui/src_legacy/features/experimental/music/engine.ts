import { MusicState } from "./model.js";

export function createMusicState(): MusicState {
  return {
    stage: "stopped",
    trackLabel: null,
    volume: 100,
  };
}

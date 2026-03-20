import { AsciiBackgroundState } from "./model.js";

export function createAsciiBackgroundState(): AsciiBackgroundState {
  return {
    mode: "off",
    density: 0,
  };
}

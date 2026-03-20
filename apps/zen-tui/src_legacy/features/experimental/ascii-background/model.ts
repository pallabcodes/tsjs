export type AsciiBackgroundMode = "off" | "rain" | "waves";

export interface AsciiBackgroundState {
  mode: AsciiBackgroundMode;
  density: number;
}

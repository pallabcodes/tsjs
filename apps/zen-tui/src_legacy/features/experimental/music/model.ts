export type PlaybackState = "stopped" | "playing" | "paused";

export interface MusicState {
  stage: PlaybackState;
  trackLabel: string | null;
  volume: number;
}

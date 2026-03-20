import { AppState } from "./model.js";

export function isOverlayVisible(state: AppState): boolean {
  return !!state.confirmDialog || state.isCommandPaletteOpen;
}

export function showSidePanel(state: AppState, width: number): boolean {
  return (state.activeView === "LOG" || state.activeView === "STATUS") && width >= 60;
}

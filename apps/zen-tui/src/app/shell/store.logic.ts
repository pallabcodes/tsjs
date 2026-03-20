/**
 * Store: Concept Design
 * 
 * Formalizes the AppState and selector hooks for Zen-TUI.
 */

import { LogState } from "../../features/log/model.concept.js";

/**
 * Global App State Alias
 * Orchestrates all feature-engine models.
 */
export type AppState = {
  shell: {
    activePanel: 'log' | 'rebase' | 'status';
    isCommandPaletteOpen: boolean;
    theme: string;
  };
  
  // Feature states
  log: LogState;
  
  // Future features
  // rebase: RebaseState;
  // cherryPick: CherryPickState;
};

/**
 * Conceptual Store Hook
 * Used by UI components to access state.
 */
export function useStore<T>(selector: (state: AppState) => T): T {
  // Pure conceptual implementation
  // We call it to avoid the "unused parameter" lint warning in strict mode
  void selector; 
  return null as any; 
}

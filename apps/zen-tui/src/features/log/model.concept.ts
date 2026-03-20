/**
 * Log Module: Model (Concept Design)
 * 
 * Defines the core types and state for the task-oriented Log engine.
 * Reflects the "Taste-first" philosophy: obvious structure, no boolean soup.
 */

export type LogProjectionMode = 
  | 'focus'      // HUD: Current work & upstream drift awareness
  | 'review'     // PR/Branch comparison & ancestry review
  | 'mutation'   // Interactive History Mutation (USP: Identity/Pruning)
  | 'graph';     // Full visual Git graph

export interface LogRow {
  sha: string;
  author: {
    name: string;
    email: string;
  };
  date: string;
  subject: string;
  isHead: boolean;
  
  // View-ready metadata for the TUI
  lanes: number[];        // Visual graph connectivity
  isSelected: boolean;
  upstreamStatus?: 'ahead' | 'behind' | 'synced'; // For "Branch Freshness"
}

// The domain state
export interface LogState {
  projection: {
    mode: LogProjectionMode;
    filter: string;
    branch?: string;
  };
  
  rows: LogRow[];
  selectedIndex: number;
  focusedSha?: string;
  status: 'streaming' | 'idle' | 'error';
  error?: string;
}

/**
 * TUI View Model (Presenter Output)
 * Shaped for direct consumption by Ink components.
 */
export interface TuiLogRow {
  laneColor: string;
  lanesSymbols: string;
  shaColor: string;
  shaAbbrev: string;
  subject: string;
  authorAbbrev: string;
  upstreamStatus?: 'ahead' | 'behind' | 'synced';
}

export interface LogValidationError {
  sha: string;
  message: string;
}

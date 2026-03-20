/**
 * Intents: Concept Design
 * 
 * Maps high-level user actions (Keyboard, CLI args) to Feature Facades.
 */

// @ts-ignore
import { log } from "@features/log/facade.concept.js";
// @ts-ignore
import { AppState } from "@app/shell/store.concept.js";

export const intents = {
  /**
   * Navigation Intents
   */
  arrowDown: (state: AppState) => {
    const currentIndex = log.selectors.getSelectedRowIndex(state.log);
    log.select(currentIndex + 1);
  },
  
  arrowUp: (state: AppState) => {
    const currentIndex = log.selectors.getSelectedRowIndex(state.log);
    log.select(currentIndex - 1);
  },

  /**
   * Action Intents
   */
  startRebase: (state: AppState) => {
    const selected = log.selectors.getSelectedRow(state.log);
    if (selected) {
      // Transition from Log flow to Rebase flow
      console.log(`Starting rebase from ${selected.sha}`);
    }
  },

  /**
   * Mutation Intents (USP)
   */
  editIdentity: (state: AppState) => {
    const selected = log.selectors.getSelectedRow(state.log);
    if (selected) {
      // Trigger the History Mutation concept
      log.mutate.updateIdentity(selected.sha, { 
        name: "New Author", 
        email: "new@google.com" 
      });
    }
  }
};

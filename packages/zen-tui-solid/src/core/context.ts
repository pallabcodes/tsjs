/**
 * @zen-tui/solid: Global Engine Context
 * 
 * Manages global singleton state for the TUI engine (ZenEngine)
 * and active input registrations.
 */

import type { ZenInputEvent } from '@zen-tui/core';

// Re-export for reconciler/consumers
export type { ZenInputEvent };

export type InputHandler = (e: ZenInputEvent) => void;

/**
 * Global Engine Registry
 */
export const context = {
  engine: (globalThis as any).zenEngine,
  inputHandlers: new Set<InputHandler>(),
};

/**
 * getActiveLayout: Safely retrieve the current native layout engine.
 */
export function getActiveLayout() {
  return context.engine?.layout;
}

/**
 * useInput: Register a local input handler.
 */
export function useInput(handler: InputHandler) {
  context.inputHandlers.add(handler);
  return () => context.inputHandlers.delete(handler);
}

/**
 * dispatchInput: Manually dispatch an event to all handlers.
 */
export function dispatchInput(e: ZenInputEvent) {
  for (const handler of context.inputHandlers) {
    handler(e);
  }
}

/**
 * setLayoutEngine: Bind the native layout engine to the global context.
 */
export function setLayoutEngine(engine: any) {
  (globalThis as any).zenEngine = engine;
  context.engine = engine;
}

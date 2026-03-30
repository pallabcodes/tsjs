/** @jsx h */
/**
 * @zen-tui/app: Sovereign Git TUI Entry Point (RUC Edition)
 */

import { createZenEngine } from '@zen-tui/core';
import type { ZenInputEvent } from '@zen-tui/core';

import { 
  render, 
  createComponent, 
  setLayoutEngine, 
  dispatchInput, 
  setEngine,
  getEngine,
  registry
} from '@zen-tui/solid';

// 0. Precision Clean
process.stdout.write('\x1B[2J\x1B[H\x1B[3J');

import App from './app/App.js';

// 1. Initialize the High-Performance Zen Engine
const zen = createZenEngine();
setEngine(zen);
(globalThis as any).getEngine = getEngine;
setLayoutEngine(zen.layout);

// Forward Native Engine inputs
zen.onInput = (e: ZenInputEvent) => dispatchInput(e);

// 2. Render the Component Tree
try {
  render(() => {
    return createComponent(App, {});
  }, (zen as any).root);
  
  // Keep the process alive for the TUI
  setInterval(() => {}, 1000);
} catch (err) {
  console.error("[Main] FATAL RENDER ERROR:", err);
}

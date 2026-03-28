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
  h,
  registry
} from '@zen-tui/solid';

// ── Sovereign JSX Bootstrap ──────────────────────────────────────────
(globalThis as any).h = h;
(globalThis as any).Fragment = (props: any) => props.children;

console.log("[Main] Importing App Component...");
import App from './app/App.js';

// 1. Initialize the High-Performance Zen Engine
console.log("[Main] Initializing Zen Engine...");
const zen = createZenEngine();
setEngine(zen);
setLayoutEngine(zen.layout);

// Forward Native Engine inputs
zen.onInput = (e: ZenInputEvent) => dispatchInput(e);

console.log("[Main] Invoking Sovereign Render Pipeline...");

// 2. Render the Component Tree
try {
  render(() => {
    console.log("[Main] Executing reactive App root...");
    return createComponent(App, {});
  }, (zen as any).root);
  console.log("[Main] Registry Root Children:", (registry as any).root.children.length);
  console.log("[Main] Sovereign TUI is now LIVE. Press Ctrl+C to exit.");
  
  // Keep the process alive for the TUI
  setInterval(() => {}, 1000);
} catch (err) {
  console.error("[Main] FATAL RENDER ERROR:", err);
}

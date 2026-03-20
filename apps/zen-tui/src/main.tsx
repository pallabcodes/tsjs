/**
 * Zen-TUI: Main Entry Point
 * 
 * Boots the custom ZenEngine using the Sovereign Reconciler.
 */

import { render } from './engine/reconciler.js';
import { ZenApp } from './engine/app.js';
import App from './app/App.js';

// 1. Initialize the High-Performance Zen Engine
const zen = new ZenApp();

// 2. Render the App Shell into the Zen Root
render(() => <App onInput={(l) => zen.onInput = l} />, zen.root);

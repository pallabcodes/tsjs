import { ZenApp } from '@zen-tui/core';
import { render } from '@zen-tui/solid';
import App from './app/App.tsx';

console.log("ZEN-TUI: Sovereign Reactivity Bootstrapping...");

// 1. Initialize the High-Performance Zen Engine
const zen = new ZenApp();

// 2. Render the App Shell
import('fs').then(fs => fs.appendFileSync('zen-verify.log', '[MAIN] App instantiating...\n'));

render(() => {
  import('fs').then(fs => fs.appendFileSync('zen-verify.log', '[MAIN] Reactive Root Executed.\n'));
  try {
    return <App onInput={(l: any) => zen.onInput = l} />;
  } catch (err: any) {
    import('fs').then(fs => fs.appendFileSync('zen-verify.log', `[FATAL ERROR IN RENDER] ${err.stack || err}\n`));
    return null;
  }
}, zen.root);

/** @jsxImportSource solid-js */
import { ZenApp } from '@zen-tui/core';
import { render, createComponent, dispatchInput, setLayoutEngine } from '@zen-tui/solid';
import App from './app/App.tsx';

console.log("ZEN-TUI: Sovereign Reactivity Bootstrapping...");

// 1. Initialize the High-Performance Zen Engine
const zen = new ZenApp();
setLayoutEngine(zen.layout);

// 💡 Forward Native Engine inputs to Hooks subscribers list
zen.onInput = (e) => dispatchInput(e);

render(() => {
  return createComponent(App, {});
}, zen.root);

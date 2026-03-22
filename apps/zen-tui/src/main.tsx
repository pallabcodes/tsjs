/** @jsxImportSource solid-js */
import { ZenApp } from '@zen-tui/core';
import { render, Zen } from '@zen-tui/solid';
import App from './app/App.tsx';

console.log("ZEN-TUI: Sovereign Reactivity Bootstrapping...");

// 1. Initialize the High-Performance Zen Engine
const zen = new ZenApp();

render(() => {
  return App({ onInput: (e: any) => zen.onInput = e });
}, zen.root);

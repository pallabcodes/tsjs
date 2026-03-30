import { createSignal } from '@zen-tui/solid';
import * as fs from 'fs';
import * as path from 'path';

const LOG_PATH = path.resolve(process.cwd(), 'zen-tui.log');

/**
 * SovereignLogger: Centralized flow tracing.
 */
export function logFlow(step: string, detail: string) {
  const msg = `[${new Date().toISOString()}] [FLOW_${step}] ${detail}\n`;
  try {
     fs.appendFileSync(LOG_PATH, msg);
  } catch (e) { /* silent */ }
}

const [getMode, setMode] = createSignal('passive');
const [getKey, setKey] = createSignal('NONE');

/**
 * SovereignStore: Traceable State
 */
export const footerMode = getMode;
export const setFooterMode = (v: string) => {
  logFlow('B', `State Update Request: ${v}`);
  setMode(v);
};

export const lastKey = getKey;
export const setLastKey = (v: string) => {
  setKey(v);
};

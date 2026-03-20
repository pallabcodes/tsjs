/**
 * Zen-TUI: Utility Exports
 */

let idCounter = 0;
export function getNextId(prefix: string = 'node'): string {
  return `${prefix}-${++idCounter}`;
}

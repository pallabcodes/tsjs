import { ZenInputEvent } from '@zen-tui/solid';

/**
 * Sovereign Input Normalizer
 * 
 * Bridges pure native terminal events into a standard string format.
 * Format: [ctrl+][alt+][shift+]keyname
 */
export function normalizeKeyEvent(e: ZenInputEvent): string {
  const parts: string[] = [];

  if (e.ctrl) parts.push('ctrl');
  if (e.alt) parts.push('alt');
  if (e.shift) parts.push('shift');

  let name = e.name || 'UNK';
  
  // Normalize whitespace: Ensure ' ' and 'space' are treated equally.
  if (name === ' ' || name === 'space') {
    name = 'space';
  }

  // Normalize backtick/grave accent consistently across platforms
  if (name === '`') {
    name = 'backtick';
  }

  parts.push(name);
  return parts.join('+');
}

import { createSignal } from 'solid-js';

/**
 * @zen-tui/state: Global TUI Management
 * 
 * Centralized reactive store for Zen-TUI applications,
 * ensuring absolute traceability and non-fragile interaction routing.
 */
export const [footerMode, setFooterMode] = createSignal('passive');
export const [lastKey, setLastKey] = createSignal('NONE');

export function toggleCommandMode(active: boolean) {
  setFooterMode(active ? 'active' : 'passive');
}

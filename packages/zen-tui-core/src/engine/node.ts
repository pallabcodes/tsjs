/**
 * @zen-tui/core: ZenTUI Engine Node Bridge (Sovereign Edition)
 * 
 * Re-exports unified ZenNode types and provides the Singleton Registry 
 * for the ZenTUI engine.
 */

import { registry as _registry } from '@zen-tui/node';
export * from '@zen-tui/node';

/**
 * registry: The Package-Level Singleton.
 * Ensures the Solid-core renderer and the Sync Pipeline share 
 * the exact same source of truth for the Virtual Tree.
 */
export const registry = _registry;

/**
 * @zen-tui/solid: Sovereign Native Linker
 * 
 * Synchronizes the Virtual Tree with the Native Layout Engine.
 * Implements "Native Ancestor Tunneling" to fix UI fragmentation.
 */

import { ZenNode, ZenTextNode } from '@zen-tui/node';
import { getActiveLayout } from './context.js';

/**
 * Tunnels ancestors to find the nearest handle registered in the layout engine.
 * Critical: Purges all 'instanceof' in favor of stable '.type' discriminators.
 */
export const findNearestNativeAncestor = (node: ZenNode | ZenTextNode): ZenNode | null => {
  let parent = node.parent;
  while (parent && !parent.nativeId) {
    parent = parent.parent;
  }
  return parent || null;
};

/**
 * Ensures a child node is correctly linked to its native parent in the layout engine.
 */
export const syncNativeLink = (parent: ZenNode, node: ZenNode | ZenTextNode): void => {
  const layout = getActiveLayout();
  if (!layout) {
    (globalThis as any).zenEngine?.log?.(`[Linker] ERROR: No active layout engine found!`);
    return;
  }
  if (!node.nativeId) {
    (globalThis as any).zenEngine?.log?.(`[Linker] ERROR: Node has no nativeId! tag=${(node as any).tag}`);
    return;
  }

  const nativeParent = parent.nativeId ? parent : findNearestNativeAncestor(parent);
  
  if (nativeParent && nativeParent.nativeId) {
    (globalThis as any).zenEngine?.log?.(`[Linker] Linking node ${node.nativeId} to parent ${nativeParent.nativeId}`);
    layout.add_child(nativeParent.nativeId, node.nativeId);
  } else {
    (globalThis as any).zenEngine?.log?.(`[Linker] WARNING: No native ancestor found for parent!`);
  }
};

/**
 * CSS-like size parser (positive = pixel, negative = percentage).
 */
export const parseSize = (val: string | number | null | undefined): number | null => {
  if (typeof val === 'number') return val;
  if (typeof val === 'string' && val.endsWith('%')) {
    return -parseFloat(val); 
  }
  return null;
};

/**
 * Synchronizes a Virtual Node's style properties with the native Layout Engine.
 */
export const syncStyle = (node: ZenNode): void => {
  const layout = getActiveLayout();
  if (!layout || !node.nativeId) return;

  const { props: p } = node;
  const isFixed = !!p.fixedPosition;
  
  layout.update_style(
    node.nativeId,
    (p.flexDirection as "row" | "column") || "column",
    isFixed && p.fixedPosition ? p.fixedPosition.w : parseSize(p.width),
    isFixed && p.fixedPosition ? p.fixedPosition.h : parseSize(p.height),
    (p.flexGrow as number) || null,
    (p.gap as number) || null,
    isFixed ? "absolute" : (p.positionType as any || null),
    isFixed && p.fixedPosition ? p.fixedPosition.y : parseSize(p.top),
    null, null,
    isFixed && p.fixedPosition ? p.fixedPosition.x : parseSize(p.left)
  );
};

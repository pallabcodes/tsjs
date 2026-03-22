/**
 * Zen-TUI: Sovereign Reactive Renderer Core
 */

// @ts-ignore
import { createRenderer } from "solid-js/universal";

/**
 * The Universal Renderer Bridge.
 * 
 * We use Solid's official factory to create the reactive 'glue' (render, insert, spread).
 * We provide the 'Adapters' for our sovereign ZenNode tree.
 */
export function createZenRenderer<NodeType>(options: any) {
  // Use the official SolidJS Universal Renderer factory
  return createRenderer<NodeType>(options);
}

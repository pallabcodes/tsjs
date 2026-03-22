/**
 * Zen-TUI: Global JSX Type Augmentation
 * 
 * Overrides SolidJS's DOM-based JSX.IntrinsicElements with our custom
 * TUI element types (box, text, scrollbox, input).
 * This eliminates all "Property 'box' does not exist" TS errors.
 */

import { ZenProps, ZenChild } from './engine/node.js';

declare module "solid-js" {
  namespace JSX {
    interface IntrinsicElements {
      box: ZenProps & { children?: Element | Element[] };
      text: ZenProps & { children?: Element | Element[] };
      scrollbox: ZenProps & { children?: Element | Element[] };
      input: ZenProps & { children?: Element | Element[] };
    }
  }
}

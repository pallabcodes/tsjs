/**
 * @zen-tui/core: ZenTUI Engine Compositor (Native Edition)
 * 
 * Maps computed Virtual ZenNodes directly to the Native Rust Buffer.
 */

import { type ZenNode } from './node';
import { getEngine } from './pipeline';

/**
 * syncNativeNode: Precision Virtual-to-Native Mapping.
 * 
 * Walks the flattened Render List and synchronizes properties 
 * (Foreground, Background, Content, Z-Index) into the native buffer.
 */
export function syncNativeNode(node: ZenNode) {
  const engine = getEngine();
  if (!engine || !engine.painter) return;

  const { layout, props } = node;

  /**
   * 1. Content Synchronization:
   * Maps 'text' primitives to the high-performance native drawText.
   */
  if (node.type === 'text' && props.value) {
    engine.painter.drawText(
      Math.floor(layout.x), 
      Math.floor(layout.y), 
      props.value, 
      props.fg, 
      props.bg, 
      props.bold
    );
  } 

  /**
   * 2. Visual Layer Synchronization:
   * Maps Background colors and Border styles to native primitives.
   */
  else if (props.bg || props.border) {
    if (props.bg) {
      engine.painter.fillRect(
        Math.floor(layout.x), 
        Math.floor(layout.y), 
        Math.floor(layout.width), 
        Math.floor(layout.height), 
        props.bg
      );
    }
    if (props.border) {
      engine.painter.drawBorder(
          Math.floor(layout.x), 
          Math.floor(layout.y), 
          Math.floor(layout.width), 
          Math.floor(layout.height), 
          props.borderColor, 
          typeof props.border === 'string' ? props.border : 'solid'
      );
    }
  }
}

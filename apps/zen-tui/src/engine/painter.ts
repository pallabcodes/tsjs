/**
 * ZenTUI: Application Painter
 * 
 * Provides the definitive bridge between the Virtual ZenTree 
 * and the ZenPainter display buffer.
 */

import { type ZenNode, getEngine } from '@zentui/core';

/**
 * paint: The Terminal Viewport Flush
 * 
 * Walks the ZenTUI tree and flushes each node's content to 
 * the ZenPainter engine based on computed layout.
 */
export function paint(node: ZenNode) {
  const engine = getEngine();
  if (!engine || !engine.painter) return;

  const { props, layout } = node;
  const painter = engine.painter;

  // 1. Draw Surface (Background/Border)
  if (props.bg) {
      painter.fillRect(layout.x, layout.y, layout.width, layout.height, props.bg);
  }

  if (props.border) {
      painter.drawBorder(
          layout.x, 
          layout.y, 
          layout.width, 
          layout.height, 
          props.borderColor || "#ffffff",
          typeof props.border === 'string' ? props.border : 'solid'
      );
  }

  // 2. Draw Content (Text/Values)
  if (node.type === 'text' && props.value) {
      painter.drawText(
          layout.x, 
          layout.y, 
          props.value, 
          props.fg || "#ffffff",
          props.bg,
          props.bold
      );
  }

  // 3. Recursive Flush (Breadth-First for visual stability)
  if (node.children) {
    for (const child of node.children) {
      paint(child);
    }
  }
}

/**
 * flushFrame: Explicit pipeline trigger
 */
export function flushFrame(root: ZenNode) {
    const engine = getEngine();
    if (!engine) return;
    
    // Clear buffer
    engine.painter.clear();
    
    // Begin paint traversal
    paint(root);
    
    // Swap buffer
    engine.painter.flush();
}

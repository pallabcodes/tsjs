import type { IZenLayoutEngine } from '@zen-tui/layout';
import type { IZenBuffer } from '@zen-tui/painter';
import { ZenNode, ZenTextNode } from '@zen-tui/node';

/**
 * createZenRenderer: Standalone TUI Painter.
 */
export function createZenRenderer(layout: IZenLayoutEngine, buffer: IZenBuffer) {
  

  const renderNode = (node: any, offsetX: number, offsetY: number, parentFG?: string, parentBG?: string) => {
    // 0. Resolve Node Type and Props
    const type = node.type || (node.tag ? 'element' : 'text');
    const props = node.props || {};
    
    // Resolve Styles (Inherit from parent if missing)
    const fg = props.fg || parentFG;
    const bg = props.bg || parentBG;

    // 1. Resolve Layout
    const layout = node.layout || { x: 0, y: 0, width: 0, height: 0 };
    const absX = Math.floor(offsetX + layout.x);
    const absY = Math.floor(offsetY + layout.y);
    
    // 2. Render Element (Box/Border/BG)
    if (type === 'element' || type === 'box' || type === 'root') {
      const w = Math.floor(layout.width);
      const h = Math.floor(layout.height);
      
      if (bg) {
        for (let i = 0; i < h; i++) {
          for (let j = 0; j < w; j++) {
            buffer.set_cell(absX + j, absY + i, ' ', fg, bg, props.bold);
          }
        }
      }
      
      if (props.border) {
        const b = props.borderStyle === 'rounded' ? ['╭', '╮', '╯', '╰', '─', '│'] : ['┌', '┐', '┘', '└', '─', '│'];
        for (let i = 0; i < w; i++) {
          buffer.set_cell(absX + i, absY, b[4], fg, bg);
          buffer.set_cell(absX + i, absY + h - 1, b[4], fg, bg);
        }
        for (let i = 0; i < h; i++) {
          buffer.set_cell(absX, absY + i, b[5], fg, bg);
          buffer.set_cell(absX + w - 1, absY + i, b[5], fg, bg);
        }
        buffer.set_cell(absX, absY, b[0], fg, bg);
        buffer.set_cell(absX + w - 1, absY, b[1], fg, bg);
        buffer.set_cell(absX + w - 1, absY + h - 1, b[2], fg, bg);
        buffer.set_cell(absX, absY + h - 1, b[3], fg, bg);
      }
    }

    // 3. Render Text
    if (type === 'text' || node.text !== undefined || props.value) {
      const text = node.text !== undefined ? String(node.text) : (props.value || '');
      const w = layout.width || text.length; 
      
      // console.log(`[Renderer] Painting text at ${absX},${absY}: "${text}" (FG: ${fg}, BG: ${bg})`);
      
      for (let i = 0; i < text.length && (w === 0 || i < w); i++) {
        buffer.set_cell(absX + i, absY, text[i], fg || "#ffffff", bg, props.bold);
      }
    }

    // 4. Recurse
    if (node.children) {
      for (const child of node.children) {
        renderNode(child, absX, absY, fg, bg);
      }
    }
  };

  return {
    update(root: any, w: number, h: number) {
      if (!root || root.nativeId === undefined) {
         console.log("[Renderer] Root has no nativeId, skipping frame");
         return;
      }
      const layoutData = layout.compute_layout(root.nativeId, w, h);
      // console.log(`[Renderer] Layout computed. Nodes: ${layoutData.length / 5}`);
      
      // 1. Convert flat buffer to Map
      const layoutMap = new Map<number, { x: number, y: number, w: number, h: number }>();
      for (let i = 0; i < layoutData.length; i += 5) {
        layoutMap.set(layoutData[i], {
          x: layoutData[i+1],
          y: layoutData[i+2],
          w: layoutData[i+3],
          h: layoutData[i+4],
        });
      }

      const applyLayout = (node: any) => {
        if (!node.nativeId) return;
        const data = layoutMap.get(node.nativeId);
        if (data) {
          node.layout = { x: data.x, y: data.y, width: data.w, height: data.h };
        }
        if (node.children) {
          for (const child of node.children) {
            applyLayout(child);
          }
        }
      };
      
      applyLayout(root);
      
      // 3. Paint
      buffer.clear();
      
      // Hardware-Level Background Wipe (Zero-Bleed Integrity)
      const rootBG = root.props?.bg || "#020617";
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          buffer.set_cell(x, y, ' ', "#ffffff", rootBG);
        }
      }
      
      const originalSetCell = buffer.set_cell;
      buffer.set_cell = (x, y, char, fg, bg, bold) => {
         if (isNaN(x) || isNaN(y) || x < 0 || y < 0 || x > 1000 || y > 1000) return;
         return originalSetCell.call(buffer, Math.floor(x), Math.floor(y), char, fg, bg, bold);
      };

      try {
        renderNode(root, 0, 0);
      } finally {
        buffer.flush();
        buffer.set_cell = originalSetCell;
      }
    }
  };
};

/**
 * @zen-tui/core: ZenTUI Engine Compositor
 */

import { type ZenNode } from './node';
import { getEngine } from './pipeline';

/**
 * syncNativeNode: Maps Virtual ZenNodes to the Native Buffer.
 */
export function syncNativeNode(node: ZenNode) {
    const engine = getEngine();
    if (!engine || !engine.painter) return;

    const { layout, props } = node;

    if (node.type === 'text' && props.value) {
        const x = Math.floor(layout.x);
        const y = Math.floor(layout.y);
        const w = Math.floor(layout.width);
        const h = engine.painter.getHeight();
        const tw = engine.painter.getWidth();

        // 🧱 Boundary Guard: Absolute Bottom-Right
        let safeValue = props.value;
        if (y === h - 1 && x + safeValue.length >= tw) {
            safeValue = safeValue.substring(0, Math.max(0, tw - x - 1));
        }

        if (safeValue.length > 0) {
            engine.painter.drawText(x, y, safeValue, props.fg, props.bg, props.bold, w);
        }
    } 
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

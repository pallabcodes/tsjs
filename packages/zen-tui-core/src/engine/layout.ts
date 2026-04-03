/**
 * @zen-tui/core: ZenTUI Industrial Layout Engine (V12)
 * 
 * Recursive Flexbox-lite engine optimized for the integer character grid.
 */

import { type ZenNode, type ZenProps } from '@zen-tui/node';

/**
 * computeLayout: Entry point for the geometric reflow.
 */
export function computeLayout(root: ZenNode, width: number, height: number) {
    if (!root.runtime.layoutDirty) return;

    // 1. Measure Pass (Intrinsic sizing)
    measureNode(root);

    // 2. Arrange Pass (Distribution)
    arrangeNode(root, 0, 0, width, height);

    root.runtime.layoutDirty = false;
}

/**
 * measureNode: Bottom-Up intrinsic size calculation.
 * 
 * Determines 'preferred' dimensions of a node based on its content 
 * and child nodes.
 */
function measureNode(node: ZenNode) {
    const { props, children } = node;

    // Recursive depth-first measure
    for (const child of children) {
        if (child && child.props && child.props.positionType !== 'absolute') {
            measureNode(child);
        }
    }

    // Default sizing
    let intrinsicWidth = 0;
    let intrinsicHeight = 0;

    // 1. Text Primitives: width is string length, height is 1
    if (node.type === 'text') {
        const val = props.value || "";
        intrinsicWidth = val.length;
        intrinsicHeight = val.length > 0 ? 1 : 0;
    } 

    // TODO: Advanced measurement for auto-sized boxes based on children
    // For now, industrial boxes use explicit width/height or flexGrow.

    node.layout.width = resolveSize(props.width, intrinsicWidth);
    node.layout.height = resolveSize(props.height, intrinsicHeight);
}

/**
 * resolveSize: Robust unit resolution.
 */
function resolveSize(val: string | number | undefined, intrinsic: number, parentSize: number = 0): number {
    if (val === undefined || val === null) return intrinsic;
    if (typeof val === 'number') return val;
    if (typeof val === 'string' && val.endsWith('%')) {
        const pct = parseFloat(val) / 100;
        return Math.floor(pct * parentSize);
    }
    const num = parseInt(val);
    return isNaN(num) ? intrinsic : num;
}

/**
 * arrangeNode: Top-Down coordinate & space distribution.
 */
function arrangeNode(node: ZenNode, x: number, y: number, width: number, height: number) {
    const { props, children } = node;

    // Set official layout (Finalized in this pass)
    node.layout.x = x;
    node.layout.y = y;
    node.layout.width = width;
    node.layout.height = height;
    node.runtime.layoutDirty = false;

    // 2. Padding/Border Projection
    const padding = props.padding || {};
    const pt = padding.top || 0;
    const pb = padding.bottom || 0;
    const pl = padding.left || 0;
    const pr = padding.right || 0;

    const contentX = x + pl;
    const contentY = y + pt;
    const contentWidth = Math.max(0, width - pl - pr);
    const contentHeight = Math.max(0, height - pt - pb);

    const isVisible = (c: ZenNode) => c && c.props && (c.props.visible !== false);
    const isFlowChild = (c: ZenNode) => isVisible(c) && c.props.positionType !== 'absolute';
    const flowChildren = children.filter(isFlowChild);
    const absoluteChildren = children.filter(c => isVisible(c) && c.props.positionType === 'absolute');

    // 4. Distribute Space to Flow Children
    if (flowChildren.length > 0) {
        const isRow = props.flexDirection === 'row';
        const gap = Number(props.gap) || 0;
        const totalContainerSpace = isRow ? contentWidth : contentHeight;
        const totalGapSpace = (flowChildren.length - 1) * gap;
        const totalNetSpace = Math.max(0, totalContainerSpace - totalGapSpace);

        // Pass 1: Resolve Fixed Sizes (Relative to Parent Content Area)
        let totalFlex = 0;
        let fixedSpace = 0;
        
        for (const child of flowChildren) {
            const flex = Number(child.props.flexGrow) || 0;
            if (flex > 0) {
                totalFlex += flex;
            } else {
                // RE-RESOLVE Fixed Sizes (This handles "100%" or fixed literals)
                const cw = resolveSize(child.props.width, child.layout.width, contentWidth);
                const ch = resolveSize(child.props.height, child.layout.height, contentHeight);
                fixedSpace += isRow ? cw : ch;
                
                // Temporarily store it for the allocation loop
                child.layout.width = cw;
                child.layout.height = ch;
            }
        }

        // Pass 2: Calculate Flex Unit and Distribute
        const flexPool = Math.max(0, totalNetSpace - fixedSpace);
        let currentOffset = isRow ? contentX : contentY;
        let remainingFlexPool = flexPool;

        // ╼ Sovereign Diagnostic: Trace Child-by-Child Allocation
        if (node.props.id === 'app-root') {
            console.log(`[ZenLayout] Trace: total=${totalContainerSpace} fixed=${fixedSpace} flex=${flexPool}`);
        }

        for (let i = 0; i < flowChildren.length; i++) {
            const child = flowChildren[i];
            const childFlex = Number(child.props.flexGrow) || 0;

            let childMainSize = 0;
            if (childFlex > 0 && totalFlex > 0) {
                // Determine if this is the last flex child to absorb remainders
                const isLastFlex = flowChildren.slice(i + 1).every(c => (Number(c.props.flexGrow) || 0) <= 0);
                if (isLastFlex) {
                    childMainSize = remainingFlexPool;
                } else {
                    childMainSize = Math.floor((childFlex / totalFlex) * flexPool);
                }
                remainingFlexPool = Math.max(0, remainingFlexPool - childMainSize);
            } else {
                // Non-flex: uses fixed size reified in measure pass
                childMainSize = isRow ? (child.layout.width || 0) : (child.layout.height || 0);
            }

            if (node.props.id === 'app-root') {
                console.log(`  ╼ Child ${i} (${child.type}): size=${childMainSize} offset=${currentOffset}`);
            }

            // Cross-axis sizing: fill the content zone
            const childWidth = isRow ? childMainSize : contentWidth;
            const childHeight = isRow ? contentHeight : childMainSize;

            const childX = isRow ? currentOffset : contentX;
            const childY = isRow ? contentY : currentOffset;

            arrangeNode(child, childX, childY, childWidth, childHeight);

            // Increment offset precisely
            currentOffset += (childMainSize + gap);
        }
    }

    // 5. Absolute Positioning (Overlays)
    for (const child of absoluteChildren) {
        const ax = resolveSize(child.props.left, 0, width);
        const ay = resolveSize(child.props.top, 0, height);
        const aw = resolveSize(child.props.width, width, width);
        const ah = resolveSize(child.props.height, height, height);

        arrangeNode(child, x + ax, y + ay, aw, ah);
    }
}

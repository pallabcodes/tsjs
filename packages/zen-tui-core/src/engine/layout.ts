/**
 * @zen-tui/core: ZenTUI Layout Engine
 */

import { type ZenNode, type ZenProps } from '@zen-tui/node';

export function computeLayout(root: ZenNode, width: number, height: number) {
    if (!root.runtime.layoutDirty && root.layout.width === width && root.layout.height === height) return;

    // 🧱 Geometric Locking: Force root to match TTY exactly
    root.props.width = width;
    root.props.height = height;

    measureNode(root);
    arrangeNode(root, 0, 0, width, height);

    root.runtime.layoutDirty = false;
}

function measureNode(node: ZenNode) {
    const { props, children } = node;
    for (const child of children) {
        if (child && child.props && child.props.positionType !== 'absolute') {
            measureNode(child);
        }
    }

    let intrinsicWidth = 0;
    let intrinsicHeight = 0;

    if (node.type === 'text') {
        const val = props.value || "";
        intrinsicWidth = val.length;
        intrinsicHeight = val.length > 0 ? 1 : 0;
    } 

    node.layout.width = resolveSize(props.width, intrinsicWidth);
    node.layout.height = resolveSize(props.height, intrinsicHeight);
}

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

function arrangeNode(node: ZenNode, x: number, y: number, width: number, height: number) {
    const { props, children } = node;

    node.layout.x = x;
    node.layout.y = y;
    node.layout.width = width;
    node.layout.height = height;
    node.runtime.layoutDirty = false;

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

    if (flowChildren.length > 0) {
        const isRow = props.flexDirection === 'row';
        const gap = Number(props.gap) || 0;
        const totalContainerSpace = isRow ? contentWidth : contentHeight;
        const totalGapSpace = (flowChildren.length - 1) * gap;
        const totalNetSpace = Math.max(0, totalContainerSpace - totalGapSpace);

        let totalFlex = 0;
        let fixedSpace = 0;
        
        for (const child of flowChildren) {
            const flex = Number(child.props.flexGrow) || 0;
            if (flex > 0) {
                totalFlex += flex;
            } else {
                const cw = resolveSize(child.props.width, child.layout.width, contentWidth);
                const ch = resolveSize(child.props.height, child.layout.height, contentHeight);
                fixedSpace += isRow ? cw : ch;
                child.layout.width = cw;
                child.layout.height = ch;
            }
        }

        const flexPool = Math.max(0, totalNetSpace - fixedSpace);
        let currentOffset = isRow ? contentX : contentY;
        let remainingFlexPool = flexPool;

        for (let i = 0; i < flowChildren.length; i++) {
            const child = flowChildren[i];
            const childFlex = Number(child.props.flexGrow) || 0;

            let childMainSize = 0;
            if (childFlex > 0 && totalFlex > 0) {
                const isLastFlex = flowChildren.slice(i + 1).every(c => (Number(c.props.flexGrow) || 0) <= 0);
                if (isLastFlex) {
                    childMainSize = remainingFlexPool;
                } else {
                    childMainSize = Math.floor((childFlex / totalFlex) * flexPool);
                }
                remainingFlexPool = Math.max(0, remainingFlexPool - childMainSize);
            } else {
                childMainSize = isRow ? (child.layout.width || 0) : (child.layout.height || 0);
            }

            const childWidth = isRow ? childMainSize : contentWidth;
            const childHeight = isRow ? contentHeight : childMainSize;
            const childX = isRow ? currentOffset : contentX;
            const childY = isRow ? contentY : currentOffset;

            arrangeNode(child, childX, childY, childWidth, childHeight);
            currentOffset += (childMainSize + gap);
        }

        // 🧱 Floor-Snap Verification: Reclaim any rounding errors at the absolute grid boundary
        const totalLimit = isRow ? contentX + contentWidth : contentY + contentHeight;
        if (currentOffset < totalLimit) {
            const lastChild = flowChildren[flowChildren.length - 1];
            if (lastChild) {
                if (isRow) lastChild.layout.width += (totalLimit - currentOffset);
                else lastChild.layout.height += (totalLimit - currentOffset);
            }
        }
    }

    for (const child of absoluteChildren) {
        const ax = resolveSize(child.props.left, 0, width);
        const ay = resolveSize(child.props.top, 0, height);
        const aw = resolveSize(child.props.width, width, width);
        const ah = resolveSize(child.props.height, height, height);
        arrangeNode(child, x + ax, y + ay, aw, ah);
    }
}

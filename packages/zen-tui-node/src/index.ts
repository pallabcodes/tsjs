/**
 * @zen-tui/node: The Sovereign TUI Node Engine (Hardened)
 */

export type ZenNodeType = 'root' | 'box' | 'text' | 'input' | 'modal' | 'pane';

export interface ZenProps {
  id?: string;
  flexDirection?: 'row' | 'column';
  flexGrow?: number;
  width?: number | string;
  height?: number | string;
  padding?: { top?: number; bottom?: number; left?: number; right?: number };
  margin?: { top?: number; bottom?: number; left?: number; right?: number };
  bg?: string;
  fg?: string;
  bold?: boolean;
  border?: boolean | 'solid' | 'thick' | 'rounded';
  borderColor?: string;
  value?: string;
  visible?: boolean;
  zIndex?: number;
  positionType?: 'static' | 'absolute';
  top?: number | string;
  left?: number | string;
  overflow?: 'visible' | 'hidden' | 'scroll';
  onClick?: () => void;
  [key: string]: any;
}

export type ZenChildren = any | any[];

export interface LayoutBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ZenPainter {
  clear: () => void;
  flush: () => void;
  getWidth: () => number;
  getHeight: () => number;
  drawText: (x: number, y: number, text: string, fg?: string, bg?: string, bold?: boolean, width?: number) => void;
  drawBorder: (x: number, y: number, w: number, h: number, fg?: string, style?: string) => void;
  fillRect: (x: number, y: number, w: number, h: number, bg: string) => void;
}

/** ZenEngine: Framework instance contract. */
export interface ZenEngine {
  root: ZenNode;
  painter: ZenPainter;
}

/** CommitData: Product-specific data model. */
export interface CommitData {
  hash: string;
  message: string;
  author: string;
  date: string;
}

//////////////////////////
// 🧬 ZenNode           //
//////////////////////////

let nextId = 0;

export class ZenNode<T = unknown, K extends ZenNodeType = ZenNodeType> {
  readonly id: string;
  readonly type: K;
  readonly props: ZenProps;

  private _children: ZenNode[] = [];
  parent?: ZenNode;

  get children(): readonly ZenNode[] {
    return this._children;
  }

  // Native/Runtime bridge
  nativeId?: T;
  version: number = 0;
  
  // Computed State
  layout: LayoutBox = { x: 0, y: 0, width: 0, height: 0 };
  runtime = {
    dirty: true,
    layoutDirty: true,
  };

  constructor(type: K, props: ZenProps = {}) {
    this.type = type;
    this.props = props;
    this.id = props.id || `${type}-${++nextId}`;
  }

  //////////////////////////
  // ⚡ Mutations          //
  //////////////////////////

  appendChild(child: ZenNode) {
    if (!child || !(child instanceof ZenNode)) return;
    if (child.parent) {
        child.parent.removeChild(child);
    }
    child.parent = this;
    this._children.push(child);
    this.markDirty();
  }

  insertNode(child: ZenNode, anchor?: ZenNode) {
    if (!child || !(child instanceof ZenNode)) return;
    if (child.parent) {
        child.parent.removeChild(child);
    }
    child.parent = this;
    
    if (anchor) {
        const index = this._children.indexOf(anchor);
        if (index !== -1) {
            this._children.splice(index, 0, child);
        } else {
            this._children.push(child);
        }
    } else {
        this._children.push(child);
    }
    this.markDirty();
  }

  removeChild(child: ZenNode) {
    const idx = this._children.indexOf(child);
    if (idx !== -1) {
      this._children.splice(idx, 1);
      child.parent = undefined;
      this.markDirty();
    }
  }

  /** clearChildren: Formal Reset for the Sovereign Engine. */
  clearChildren() {
    this._children.forEach(c => c.parent = undefined);
    this._children = [];
    this.markDirty();
  }

  markDirty() {
    this.runtime.dirty = true;
    this.runtime.layoutDirty = true;
    registry.markDirty(this);
  }

  toString() {
    return `[${this.type}#${this.id}]`;
  }
}

//////////////////////////
// 🗂️ Registry          //
//////////////////////////

export class ZenRegistry {
  readonly root = new ZenNode('root', { id: 'root' });
  private nodes = new Map<string, ZenNode>();
  private dirtyNodes = new Set<ZenNode>();
  private renderList: ZenNode[] = [];

  constructor() {
    this.nodes.set(this.root.id, this.root);
  }

  register(node: ZenNode) {
    this.nodes.set(node.id, node);
  }

  unregister(node: ZenNode) {
    this.nodes.delete(node.id);
    this.dirtyNodes.delete(node);
  }

  get(id: string) {
    return this.nodes.get(id);
  }

  markDirty(node: ZenNode) {
    this.dirtyNodes.add(node);
  }

  consumeDirty(): ZenNode[] {
    const list = [...this.dirtyNodes];
    this.dirtyNodes.clear();
    return list;
  }

  /** walk: Lazy tree traversal generator (Hardened). */
  *walk(node: ZenNode = this.root): Generator<ZenNode> {
    if (!node) return;
    yield node;
    for (const child of node.children) {
      if (child) yield* this.walk(child);
    }
  }

  /** buildRenderList: Synchronizes and Z-orders the flattened tree for the compositor. */
  buildRenderList() {
    this.renderList = [];
    // ╼ Traverse the tree from root but EXCLUDE the root itself (Sovereign Constraint)
    for (const node of this.walk(this.root)) {
        if (node === this.root) continue;
        if (node.props?.visible !== false) {
            this.renderList.push(node);
        }
    }

    // Sort by Z-index (Industrial Standard)
    this.renderList.sort((a, b) => {
        const az = Number(a.props?.zIndex) || 0;
        const bz = Number(b.props?.zIndex) || 0;
        return az - bz;
    });
  }

  getRenderList() {
    return this.renderList;
  }

  /** clear: Formal Lifecycle Disposal for the Sovereign Engine. */
  clear() {
    this.nodes.clear();
    this.dirtyNodes.clear();
    this.renderList = [];
    
    // ╼ Industrial Reset: Formal Method Purity
    this.root.clearChildren();
    this.root.props.children = null;
    this.nodes.set(this.root.id, this.root);
    console.log("[ZenRegistry] Sovereign Context Purged.");
  }
}

/** registry: The package-level singleton Registry. */
export const registry = new ZenRegistry();

/** createZenNode: Canonical factory for the reconciler. */
export function createZenNode<K extends ZenNodeType>(type: K, props: ZenProps = {}): ZenNode<unknown, K> {
  const node = new ZenNode(type, props);
  registry.register(node);
  return node;
}
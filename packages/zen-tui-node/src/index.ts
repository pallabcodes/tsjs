/**
 * Zen-TUI: Sovereign Node Tree
 */

export type ZenTag = 'box' | 'text' | 'scrollbox' | 'input' | 'root';

export interface ZenProps {
  flexDirection?: 'row' | 'column';
  width?: number | string;
  height?: number | string;
  flexGrow?: number;
  gap?: number;
  bg?: string;
  fg?: string;
  border?: boolean | string;
  borderStyle?: "solid" | "rounded" | "thick" | "double";
  borderWeight?: number;
  borderColor?: string;
  fixedPosition?: { x: number, y: number, w: number, h: number };
  tag?: string;
  focused?: boolean;
  bold?: boolean;
  dim?: boolean;
  value?: string;
  placeholder?: string;
  onSubmit?: (val: string) => void;
  onSelect?: (idx: number) => void;
  [key: string]: any; 
}

export class ZenNode {
  public type = 'element' as const;
  public tag: string;
  public props: ZenProps;
  public children: (ZenNode | ZenTextNode)[] = [];
  public parent?: ZenNode;
  public nativeId?: number;
  public layout = { x: 0, y: 0, width: 0, height: 0 };

  constructor(tag: string, props: ZenProps = {}, id?: string) {
    this.tag = tag;
    this.props = props;
  }
}

export class ZenTextNode {
  public type = 'text' as const;
  public text: string;
  public parent?: ZenNode;
  public nativeId?: number;
  public layout = { x: 0, y: 0, width: 0, height: 0 };

  constructor(text: string, parent?: ZenNode, id?: string) {
    this.text = text;
    this.parent = parent;
  }
}

let nextId = 0;
export function getNextId(tag: string): string {
  return `${tag}-${nextId++}`;
}

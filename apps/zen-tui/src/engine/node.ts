/**
 * Zen-TUI: Node Tree
 * 
 * Virtual node representation of the TUI with strict typing.
 * 100% Sovereign, no DOM dependencies.
 */

export type ZenTag = 'box' | 'text' | 'scrollbox' | 'input';

export interface ZenProps {
  flexDirection?: 'row' | 'column';
  width?: number | string;
  height?: number | string;
  flexGrow?: number;
  padding?: number;
  gap?: number;
  border?: boolean | string;
  borderColor?: string;
  fg?: string;
  bg?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  onSubmit?: (val: string) => void;
  placeholder?: string;
  focused?: boolean;
}

/**
 * Base ZenNode (Elements like <box>)
 */
export class ZenNode {
  tag: string;
  props: ZenProps;
  children: (ZenNode | ZenTextNode)[] = [];
  parent?: ZenNode;
  
  // N-API / Native integration
  nativeId?: number;
  layout = { x: 0, y: 0, width: 0, height: 0 };

  constructor(tag: string, props: ZenProps = {}, id?: string) {
    this.tag = tag;
    this.props = props;
  }
}

/**
 * ZenTextNode for leaf text content
 */
export class ZenTextNode {
  text: string;
  parent?: ZenNode;
  nativeId?: number;
  layout = { x: 0, y: 0, width: 0, height: 0 };

  constructor(text: string, parent?: ZenNode, id?: string) {
    this.text = text;
    this.parent = parent;
  }
}

export type ZenChild = ZenNode | ZenTextNode | string | number | boolean | null | undefined;

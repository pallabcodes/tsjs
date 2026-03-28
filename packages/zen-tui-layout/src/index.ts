import { loadNativeModule } from './Bridge.js';
export { loadNativeModule };

const native = loadNativeModule('zen_layout_native');

export interface IZenLayoutEngine {
  create_node(
    flexDirection: string,
    width: number | null,
    height: number | null,
    flexGrow?: number | null,
    paddingTop?: number | null,
    paddingRight?: number | null,
    paddingBottom?: number | null,
    paddingLeft?: number | null,
    gap?: number | null,
    positionType?: string | null,
    top?: number | null,
    right?: number | null,
    bottom?: number | null,
    left?: number | null
  ): number;
  add_child(parentId: number, childId: number): void;
  remove_child(parentId: number, childId: number): void;
  update_style(
    nodeId: number,
    flexDirection: string,
    width: number | null,
    height: number | null,
    flexGrow: number | null,
    gap: number | null,
    positionType: string | null,
    top: number | null,
    right: number | null,
    bottom: number | null,
    left: number | null
  ): void;
  compute_layout(rootId: number, width: number, height: number): Float64Array;
  clear(): void;
}

export const ZenLayoutEngine: new () => IZenLayoutEngine = native.ZenLayoutEngine;

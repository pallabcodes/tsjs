import { loadNativeModule } from './Bridge.js';

const native = loadNativeModule('zen_core_native');

/**
 * ZenInput: Native terminal input poller.
 */
export interface IZenInput {
  poll_event(timeout_ms: number): string | null;
  start_polling(callback: (err: Error | null, event: string) => void): void;
}

export interface IZenTerminal {
  enable_raw_mode(): void;
  disable_raw_mode(): void;
  get_size(): number[];
}

export interface IZenBuffer {
  set_cell(x: number, y: number, content: string, fg?: string, bg?: string, bold?: boolean): void;
  flush(): void;
  clear(): void;
  resize(width: number, height: number): void;
  get_width(): number;
  get_height(): number;
}

export const ZenInput: { new (): IZenInput } = (native as any).ZenInput;
export const ZenBuffer: { new (width: number, height: number): IZenBuffer } = (native as any).ZenBuffer;
export const ZenTerminal: { new (): IZenTerminal } = (native as any).ZenTerminal;
export const ZenProcessSupervisor = native.ZenProcessSupervisor;

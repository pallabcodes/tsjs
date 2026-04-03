/**
 * @zen-tui/native: Industrial Native Bridge (Sovereign Absolute)
 * 
 * High-fidelity IPC wrapper for the ZenCore Sovereign Native Host.
 * 
 * ╼ STRICT NO-NODE ARCHITECTURE ╾
 */

/**
 * IZenInput: Native terminal input poller.
 */
export interface IZenInput {
  startPolling(callback: (err: Error | null, event: string) => void): void;
}

/**
 * IZenTerminal: Terminal lifecycle manager.
 */
export interface IZenTerminal {
  enableRawMode(): void;
  disableRawMode(): void;
  getSize(): number[];
}

/**
 * IZenBuffer: Performance-optimized 2D grid buffer.
 */
export interface IZenBuffer {
  setCell(x: number, y: number, content: string, fg?: string, bg?: string, bold?: boolean): void;
  flush(): void;
  clear(): void;
  resize(width: number, height: number): void;
  getWidth(): number;
  getHeight(): number;
}

/**
 * IZenGit: Global Git Host.
 */
export interface IZenGit {
    getLog(limit: number): string; 
    getDiff(hash: string): string;
    getStatus(): string;
    stageFile(path: string): void;
    unstageFile(path: string): void;
    commit(message: string): void;
    getBranches(): string;
}

const isHost = typeof (globalThis as any).__ZEN_HOST__ !== 'undefined';
class _VirtualHost {}

/**
 * Industrial Native Primitives: 100% decoupled from Node.js/Bun.
 */
export const ZenInput: { new (): IZenInput } = (isHost ? (globalThis as any).__ZEN_HOST__ : _VirtualHost) as any;
export const ZenTerminal: { new (): IZenTerminal } = (isHost ? (globalThis as any).__ZEN_HOST__ : _VirtualHost) as any;
export const ZenBuffer: { new (width: number, height: number): IZenBuffer } = (isHost ? (globalThis as any).__ZEN_HOST__ : _VirtualHost) as any;
export const ZenGit: { new (): IZenGit } = (isHost ? (globalThis as any).__ZEN_HOST__ : _VirtualHost) as any;



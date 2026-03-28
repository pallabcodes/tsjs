import { ZenTerminal as NativeTerminal, IZenTerminal } from '@zen-tui/native';

/**
 * ZenTerminal: Sovereign Native Console Orchestrator.
 */
export class ZenTerminal {
  private native: IZenTerminal;
  private isRaw: boolean = false;

  constructor(private buffer: any) {
    this.native = new NativeTerminal();
  }

  enableRawMode() {
    if (this.isRaw) return;
    try {
      this.native.enable_raw_mode();
      this.isRaw = true;
    } catch (e) {
      console.error(`[ZenTerminal] Native Raw Mode Fail: ${e}`);
    }
  }

  disableRawMode() {
    if (!this.isRaw) return;
    try {
      this.native.disable_raw_mode();
      this.isRaw = false;
    } catch (e) {
      // Silent
    }
  }

  get size() {
    const [width, height] = this.native.get_size();
    return { width, height };
  }
}

/**
 * BunHost: (Legacy/Cleanup) 
 * Can be removed if not used elsewhere, but keeping minimal for stability.
 */
export class BunHost {
  getStdout() {
    return {
      write: () => {},
      onResize: () => {},
      columns: 80,
      rows: 24
    };
  }
}

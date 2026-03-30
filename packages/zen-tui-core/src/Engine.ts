import { ZenNode } from '@zen-tui/node';
import { createZenPoller, ZenInputEvent } from '@zen-tui/poll';
import { createZenHeartbeat } from '@zen-tui/tick';
import { ZenTerminal, BunHost } from '@zen-tui/terminal';
import { createZenRenderer } from '@zen-tui/render';
import type { IZenLayoutEngine } from '@zen-tui/layout';
import type { IZenBuffer } from '@zen-tui/native';
import { ZenLayoutEngine } from '@zen-tui/layout';
import { ZenBuffer } from '@zen-tui/native';
import * as fs from 'fs';

/**
 * createZenEngine: The Sovereign Shell (Sovereign V80)
 */
export function createZenEngine() {
  const host = new BunHost();
  const layout: IZenLayoutEngine = new ZenLayoutEngine();
  const buffer: IZenBuffer = new ZenBuffer(process.stdout.columns || 100, process.stdout.rows || 30);
  
  const root = new ZenNode('root', { width: '-100%', height: '-100%' });
  root.nativeId = layout.create_node('column', -100, -100);

  const terminal = new ZenTerminal(buffer);
  const heartbeat = createZenHeartbeat();
  const poller = createZenPoller();
  const renderer = createZenRenderer(layout, buffer);
  
  let lastW = 0;
  let lastH = 0;

  const update = () => {
    const { width, height } = terminal.size;
    const finalW = width || 100;
    const finalH = height || 30;
    if (finalW !== lastW || finalH !== lastH) {
      buffer.resize(finalW, finalH);
      lastW = finalW;
      lastH = finalH;
    }
    renderer.update(root, finalW, finalH);
    buffer.flush();
  };

  let isDestroyed = false;
  const destroy = () => {
    if (isDestroyed) return;
    isDestroyed = true;
    poller.stop();
    terminal.disableRawMode();
    process.exit(0);
  };

  const engine = {
    layout,
    buffer,
    terminal,
    root,
    onInput: null as ((event: ZenInputEvent) => void) | null,
    flush: (externalRoot?: any) => {
      const r = externalRoot || root;
      renderer.update(r, terminal.size.width || 100, terminal.size.height || 30);
      buffer.flush();
    },
    destroy,
  };

  const RAW_LOG = '/tmp/zen-raw-input.log';
  const handleInput = (event: ZenInputEvent) => {
    try {
      if (fs.existsSync(RAW_LOG)) {
        fs.appendFileSync(RAW_LOG, `[${new Date().toISOString()}] engine_raw=${event.name}, ctrl=${!!event.ctrl}\n`);
      }
    } catch (e) {}

    // ╼ FIXED: Restore exit keys
    if (event.name === 'escape' || event.name === 'q' || (event.name === 'c' && event.ctrl)) {
      destroy();
    }
    
    if (event.name === 'resize' && event.width && event.height) {
      buffer.resize(event.width, event.height);
      engine.flush();
    }

    if (engine.onInput) engine.onInput(event);
  };

  poller.onInput = handleInput;
  terminal.enableRawMode();
  poller.start();
  
  process.on('SIGINT', destroy);
  process.on('SIGTERM', destroy);

  return engine;
}

/**
 * createZenHeartbeat: Standalone High-Precision Timing Loop.
 */
export function createZenHeartbeat() {
  let intervalId: any = null;
  let onTick: (() => void) | null = null;
  let frameRequested = false;
  let tickCount = 0;

  const tick = () => {
    tickCount++;
    if (onTick) onTick();
    frameRequested = false;
  };

  return {
    get ticks() { return tickCount; },
    start(fps: number = 20) {
      if (intervalId) return;
      const ms = Math.floor(1000 / fps);
      intervalId = setInterval(tick, ms);
    },
    stop() {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    },
    requestFrame(cb: () => void) {
      if (frameRequested) return;
      frameRequested = true;
      setImmediate(cb);
    },
    set onTick(cb: () => void) {
      onTick = cb;
    }
  };
};

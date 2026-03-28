import { ZenInput, IZenInput } from '@zen-tui/native';

export interface ZenInputEvent {
  name: string;
  ctrl: boolean;
  alt: boolean;
  shift: boolean;
  width?: number;
  height?: number;
}

export function createZenPoller() {
  let nativeInput: IZenInput | null = null;
  let onInput: ((event: ZenInputEvent) => void) | null = null;
  let isPolling = false;

  return {
    start() {
      if (isPolling) return;
      if (!nativeInput) nativeInput = new ZenInput();
      
      isPolling = true;
      nativeInput.start_polling((err, eventJson) => {
        if (err) {
          console.error(`[ZenPoller] Native Error: ${err}`);
          return;
        }
        if (onInput && eventJson) {
          try {
            onInput(JSON.parse(eventJson));
          } catch (e) {}
        }
      });
    },
    update() {
       // Legacy: No longer needed with push-based polling
    },
    stop() {
       // Stop logic would need native support, but for now we let it run 
       // or implement a flag in Rust. 
    },
    set onInput(cb: (event: ZenInputEvent) => void) {
      onInput = cb;
    }
  };
}

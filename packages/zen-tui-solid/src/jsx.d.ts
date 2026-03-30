import { ZenProps } from '@zen-tui/node';
import { JSX as SolidJSX } from 'solid-js';

/**
 * Sovereign JSX Namespace: RUC Core
 * 
 * Defines the custom elements intrinsic to the ZenTUI engine.
 * Mapping these allows for 100% type-safe terminal UI development.
 */
declare global {
  namespace JSX {
    interface IntrinsicElements {
      box: ZenProps & { children?: any };
      text: ZenProps & { children?: any; value?: string };
    }
  }
}

import { type ZenNode, type ZenProps } from '@zen-tui/node';

declare global {
  namespace JSX {
    type Element = ZenNode<any, any> | string | number | boolean | null | undefined | any;
    interface IntrinsicElements {
      box: any;
      text: any;
      virtual: any;
      scrollbox: any;
      input: any;
      [key: string]: any; 
    }
  }
}

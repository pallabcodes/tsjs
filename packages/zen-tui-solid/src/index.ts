import { createElement, insert, spread, createComponent } from './reconciler.js';
import { For, Show } from 'solid-js';
import { ZenRouter, ZenRoute } from './router.js';
export * from './reconciler.js';
export * from './renderer.js';

// Global Input Subscribers (Singleton Engine)
const inputHandlers: Array<(e: any) => void> = [];

export function useInput(handler: (e: any) => void) {
  inputHandlers.push(handler);
}

export function dispatchInput(e: any) {
  for (const h of inputHandlers) {
    h(e);
  }
}

// Namespaced Component Factory
export const Zen: any = {
  Box: (props: any) => {
    const el = createElement('box');
    spread(el, () => props, true); // Reactive props
    if (props.children) {
      insert(el, () => props.children); // Reactive children
    }
    return el as any;
  },
  Text: (props: any) => {
    const el = createElement('text');
    spread(el, () => props, true);
    if (props.children) {
      insert(el, () => props.children);
    }
    return el as any;
  },
  Divider: (props: any) => {
    const el = createElement('box');
    spread(el, () => ({ height: 1, width: "100%", ...props }), true);
    return el as any;
  },
  ScrollBox: (props: any) => {
    const el = createElement('scrollbox');
    spread(el, () => props, true);
    if (props.children) {
      insert(el, () => props.children);
    }
    return el as any;
  },
  Input: (props: any) => {
    const el = createElement('input');
    spread(el, () => props, true);
    return el as any;
  },
  For: (props: any) => {
    const each = props.each || props.list || props.items;
    const render = props.children || props.render;
    return createComponent(For as any, { 
      get each() { return typeof each === 'function' ? each() : each; }, 
      children: render 
    }) as any;
  },
  Show: (props: any) => {
    return createComponent(Show as any, { 
      get when() { return typeof props.when === 'function' ? props.when() : props.when; }, 
      get fallback() { return props.fallback; }, 
      children: props.children 
    }) as any;
  },
  Router: (props: any) => {
    return createComponent(ZenRouter, props);
  },
  Route: (props: any) => {
    return createComponent(ZenRoute, props);
  }
};

export { useZenNavigation } from './router.js';

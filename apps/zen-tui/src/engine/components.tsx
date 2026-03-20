/**
 * Zen-TUI: TUI-Typed Built-in Components
 * 
 * Proxies SolidJS flow control components with TUI-compatible types.
 * This isolates the necessary 'any' casting required to bridge Solid's
 * DOM-node expectation with our ZenNode engine.
 */

import { 
  For as SolidFor, 
  Show as SolidShow, 
  Switch as SolidSwitch, 
  Match as SolidMatch,
  type JSX,
  type Accessor
} from 'solid-js';

export const For = SolidFor as unknown as <T extends readonly any[], U extends JSX.Element>(props: {
  each: T | undefined | null | false;
  fallback?: JSX.Element;
  children: (item: T[number], index: Accessor<number>) => U;
}) => JSX.Element;

export const Show = SolidShow as unknown as <T>(props: {
  when: T | undefined | null | false;
  fallback?: JSX.Element;
  keyed?: boolean;
  children: JSX.Element | ((item: NonNullable<T>) => JSX.Element);
}) => JSX.Element;

export const Switch = SolidSwitch as unknown as (props: {
  fallback?: JSX.Element;
  children: JSX.Element | JSX.Element[];
}) => JSX.Element;

export const Match = SolidMatch as unknown as <T>(props: {
  when: T | undefined | null | false;
  children: JSX.Element | ((item: NonNullable<T>) => JSX.Element);
}) => JSX.Element;

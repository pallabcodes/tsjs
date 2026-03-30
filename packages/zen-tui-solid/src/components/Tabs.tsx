/** @jsx h */
/**
 * @zen-tui/solid: Sovereign Tabs
 * 
 * High-fidelity tab strip with professional styling and 
 * navigable keyboard interaction (h/l or left/right).
 */

import { createSignal, For, createMemo, Show } from 'solid-js';
import { Box, Text, useInput } from '../index.js';

export interface TabItem {
  label: string;
  id: string;
}

export interface TabsProps {
  tabs: TabItem[];
  activeId?: string;
  focused?: boolean | (() => boolean);
  onSelect?: (id: string) => void;
}

/**
 * Sovereign Tabs: Premium horizontal navigation.
 */
export function Tabs(props: TabsProps) {
  const isFocused = () => typeof props.focused === 'function' ? props.focused() : !!props.focused;
  const [activeIdx, setActiveIdx] = createSignal(
    Math.max(0, props.tabs.findIndex(t => t.id === props.activeId))
  );

  const THEME = {
    activeBg: "#3b82f6", // Blue
    activeFg: "#ffffff",
    inactiveFg: "#94a3b8",
    separatorFg: "#334155",
  };

  useInput((e) => {
    if (!isFocused()) return;
    const count = props.tabs.length;
    if (count === 0) return;

    if (e.name === 'l' || e.name === 'right') {
      const next = Math.min(activeIdx() + 1, count - 1);
      if (next !== activeIdx()) {
        setActiveIdx(next);
        props.onSelect?.(props.tabs[next].id);
        (globalThis as any).zenEngine?.requestFrame();
      }
    } else if (e.name === 'h' || e.name === 'left') {
      const next = Math.max(activeIdx() - 1, 0);
      if (next !== activeIdx()) {
        setActiveIdx(next);
        props.onSelect?.(props.tabs[next].id);
        (globalThis as any).zenEngine?.requestFrame();
      }
    }
  });

  return (
    <Box flexDirection="row" height={1}>
      <For each={props.tabs}>
        {(tab, index) => {
          const isActive = createMemo(() => index() === activeIdx());
          return (
            <Box flexDirection="row">
              <Text
                fg={isActive() ? THEME.activeFg : THEME.inactiveFg}
                bg={isActive() ? THEME.activeBg : undefined}
                bold={isActive()}
              >
                {` ${tab.label} `}
              </Text>
              <Show when={index() < props.tabs.length - 1}>
                <Text fg={THEME.separatorFg}>{" │ "}</Text>
              </Show>
            </Box>
          );
        }}
      </For>
    </Box>
  );
}

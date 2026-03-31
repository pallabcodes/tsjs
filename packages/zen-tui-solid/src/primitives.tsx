/** @jsx _h */
import { h as _h } from './core/compositor.js';
import { ZenProps } from '@zen-tui/node';
export type { ZenProps };
import { createRUCNode, registry } from './core/node.js';
import { requestFrame } from './core/pipeline.js';
import { createRenderEffect, Show, createSignal, onCleanup } from 'solid-js';

export interface ZenComponentProps extends ZenProps {
  children?: any;
  title?: string;
  focused?: boolean;
}

// Reactive Dimensions (V61: Sync with STDOUT)
const [w, setw] = createSignal(process.stdout.columns || 150);
const [h, seth] = createSignal(process.stdout.rows || 24);

process.stdout.on('resize', () => {
  setw(process.stdout.columns);
  seth(process.stdout.rows);
});

export const W = w;
export const H = h;
export const setW = setw;
export const setH = seth;

export function Box(props: ZenComponentProps) {
  return _h('box', props, props.children);
}

export function Text(props: ZenComponentProps) {
  return _h('text', props, props.children);
}

export const Panel = (props: ZenComponentProps): any => {
  const borderColor = () => props.focused ? "#3b82f6" : "#475569";
  const titleBg = () => props.headerBg || (props.focused ? "#3b82f6" : "#334155");
  const titleFg = () => props.focused ? "#ffffff" : "#94a3b8";

  return (
    <Box 
      {...props} 
      flexDirection="column"
      flexGrow={1}
      border={true} 
      borderColor={borderColor()}
    >
      <Show when={!!props.title}>
        <Box height={1} bg={titleBg()} padding={{ left: 1, right: 1 }} flexDirection="row">
          <Text fg={titleFg()} bold={true}>{props.title}</Text>
          <Box flexGrow={1} />
        </Box>
      </Show>
      <Box flexGrow={1} flexDirection="column" bg="#020617">
        {props.children}
      </Box>
    </Box>
  );
};

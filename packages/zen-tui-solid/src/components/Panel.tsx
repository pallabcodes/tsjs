/**
 * Zen.Panel — Sovereign Layout Panel
 *
 * A high-level wrapper that provides:
 *   - Automatic safety margins (1-cell padding from borders)
 *   - Optional title bar with focus-aware coloring
 *   - Built-in border + bg support
 *   - Column-direction flex by default
 */

import { Box, Text } from '../index.js';

export interface PanelProps {
  x: number;
  y: number;
  width: number;
  height: number;
  title?: string;
  focused?: boolean;
  bg?: string;
  border?: boolean;
  borderStyle?: 'solid' | 'rounded' | 'thick' | 'double';
  borderColor?: string;
  children?: any;
}

export function Panel(props: PanelProps) {
  const bg = props.bg || '#0f172a';
  const hasBorder = props.border !== false;
  const borderStyle = props.borderStyle || 'rounded';
  const focusedColor = '#60a5fa';
  const unfocusedColor = '#71717a';
  const borderColor = props.borderColor || (props.focused ? focusedColor : '#3f3f46');

  // Safety margins: 1 cell inside each border edge
  const innerX = hasBorder ? 1 : 0;
  const innerY = props.title ? 2 : (hasBorder ? 1 : 0);
  const innerW = props.width - (hasBorder ? 2 : 0);
  const innerH = props.height - innerY - (hasBorder ? 1 : 0);

  return (
    <Box
      fixedPosition={{ x: props.x, y: props.y, w: props.width, h: props.height }}
      bg={bg}
      border={hasBorder}
      borderStyle={borderStyle}
      borderColor={borderColor}
    >
      {props.title && (
        <Box fixedPosition={{ x: 1, y: 0, w: innerW, h: 1 }}>
          <Text bold={true} fg={props.focused ? focusedColor : unfocusedColor}>
            {`  ${props.title}`}
          </Text>
        </Box>
      )}
      <Box fixedPosition={{ x: innerX, y: innerY, w: innerW, h: innerH }} flexDirection="column">
        {props.children}
      </Box>
    </Box>
  );
}

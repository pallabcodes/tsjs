import { type ZenNode, type ZenProps, type ZenChildren } from '@zen-tui/node';
import { Theme } from '../engine/theme';
import { Zen } from '../engine/reactivity';

/**
 * @zen-tui/core: UI Elements (Hardened Edition)
 * 
 * Industrial-grade primitives and layout components for the ZenTUI experience.
 * Optimized for Z-index stability and absolute positioning.
 */
/// <reference path="../jsx.d.ts" />

/**
 * 🧱 Box: The Core Structural Primitive
 */
export function Box(props: ZenProps): any {
  return <box {...(props as any)} />;
}

/**
 * 🧱 Text: The Core Content Primitive
 */
export function Text(props: ZenProps): any {
  return <text {...(props as any)} />;
}

/**
 * 🧱 Divider: Precision Visual Separator
 */
export function Divider(props: { vertical?: boolean, color?: string }): any {
    return (
        <Box 
            width={props.vertical ? 1 : "100%"} 
            height={props.vertical ? "100%" : 1}
            bg={props.color || Theme.Colors.Border}
        />
    );
}

/**
 * 🏗️ Layout Namespace: Grid & Pane
 */
export const Layout = {
  Grid: (props: { cols?: number[], rows?: number[], children: ZenChildren, gap?: number }) => {
    const children = Array.isArray(props.children) ? props.children : [props.children];
    const isRow = !!props.rows;
    return (
      <Box 
        flexDirection={isRow ? "column" : "row"} 
        flexGrow={1} 
        width="100%" 
        height="100%"
        gap={props.gap ?? 1}
      >
        {children.map((child, i) => (
          <Box flexGrow={(isRow ? props.rows?.[i] : props.cols?.[i]) || 1} flexDirection="column" height="100%">
            {child as any}
          </Box>
        ))}
      </Box>
    );
  },
  Pane: (props: { title?: string, children: ZenChildren, active?: boolean }) => {
    return (
      <Box 
        flexDirection="column" 
        flexGrow={1}
        bg={props.active ? Theme.Colors.PanelActive : Theme.Colors.Panel} 
        border={true}
        borderColor={props.active ? Theme.Colors.BorderActive : Theme.Colors.Border}
        padding={{ left: 1, right: 1 }}
      >
        {props.title && (
          <Box height={1} padding={{ left: 1 }}>
            <Text 
                fg={props.active ? Theme.Colors.Highlight : Theme.Colors.TextMuted} 
                bold={true} 
                value={` ╼ ${props.title.toUpperCase()}`} 
            />
          </Box>
        )}
        <Box flexGrow={1} flexDirection="column">
          {props.children}
        </Box>
      </Box>
    );
  }
};

/**
 * 📥 Input: Interactive Text Field
 */
export function Input(props: { value: string, onValueChange: (v: string) => void, placeholder?: string, focused?: boolean }): any {
    return (
        <Box 
            height={1} 
            flexDirection="row" 
            bg={props.focused ? Theme.Colors.PanelActive : "transparent"}
            border={props.focused ? 'solid' : false}
            borderColor={Theme.Colors.BorderActive}
        >
            <Text 
                fg={props.value ? Theme.Colors.TextMain : Theme.Colors.TextMuted} 
                value={props.value || props.placeholder || ""} 
            />
        </Box>
    );
}

/**
 * 🕒 Spinner: Async Loading Indicator
 */
export function Spinner(): any {
    const [frame, setFrame] = Zen.signal(0);
    
    Zen.onMount(() => {
        const timer = setInterval(() => {
            setFrame((f) => (f + 1) % Theme.Spinner.Dots.length);
        }, 80);
        Zen.onCleanup(() => clearInterval(timer));
    });

    return <Text fg={Theme.Colors.Highlight} value={Theme.Spinner.Dots[frame()]} />;
}

/**
 * 📜 ScrollView: Viewport Clipping Container
 */
export function ScrollView(props: { children: ZenChildren, flexGrow?: number, height?: number | string }): any {
    return (
        <Box 
            flexDirection="column" 
            flexGrow={props.flexGrow ?? 1} 
            height={props.height ?? "100%"} 
            overflow="scroll"
        >
            {props.children}
        </Box>
    );
}

/**
 * 📑 Tabs: Navigation Context Swapper
 */
export function Tabs(props: { items: string[], activeIndex: number, onTabChange: (i: number) => void }): any {
    return (
        <Box flexDirection="row" height={1} gap={2}>
            {props.items.map((item, i) => (
                <Box 
                    onClick={() => props.onTabChange(i)}
                    padding={{ left: 1, right: 1 }}
                    bg={i === props.activeIndex ? Theme.Colors.PanelActive : "transparent"}
                >
                    <Text 
                        fg={i === props.activeIndex ? Theme.Colors.Highlight : Theme.Colors.TextMuted} 
                        bold={i === props.activeIndex}
                        value={item} 
                    />
                </Box>
            ))}
        </Box>
    );
}

/**
 * 🪟 Modal: Precision Overlay Dialog
 */
export function Modal(props: { title: string, children: ZenChildren, visible: boolean, onClose: () => void }): any {
    if (!props.visible) return null;

    return (
        <Box 
            positionType="absolute" 
            zIndex={100}
            top={5}
            left={10}
            width={60}
            height={15}
            bg={Theme.Colors.Panel}
            border="thick"
            borderColor={Theme.Colors.Highlight}
            flexDirection="column"
        >
            <Box height={1} bg={Theme.Colors.PanelActive} padding={{ left: 1 }}>
                <Text fg={Theme.Colors.Highlight} bold={true} value={props.title} />
            </Box>
            <Box flexGrow={1} padding={{ top: 1, left: 2, right: 2 }}>
                {props.children}
            </Box>
            <Box height={1} padding={{ left: 1 }}>
                <Text fg={Theme.Colors.TextMuted} value="Press ESC to close" />
            </Box>
        </Box>
    );
}

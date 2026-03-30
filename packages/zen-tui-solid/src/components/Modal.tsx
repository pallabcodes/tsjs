import { createMemo, Show, JSX } from "solid-js";
import { Box, Text } from "../index.js";
import { useInput, type ZenInputEvent } from '../reconciler.js';

/**
 * ModalProps: High-fidelity modal configuration.
 */
export interface ModalProps {
  title?: string;
  visible: boolean;
  onClose: () => void;
  children: JSX.Element;
  width?: number;
  height?: number;
  termWidth: number;
  termHeight: number;
}

/**
 * Modal: Centered overlay component for high-fidelity interactive flows.
 */
export function Modal(props: ModalProps) {
  const w = props.width || 60;
  const modalHeight = props.height || 15;
  
  const x = Math.max(Math.floor((props.termWidth - w) / 2), 0);
  const y = Math.max(Math.floor((props.termHeight - modalHeight) / 2), 0);

  useInput((e: ZenInputEvent) => {
    if (props.visible && e.name === 'escape') {
      props.onClose();
    }
  });

  return (
    <Show when={props.visible}>
      {/* Dim Overlay Background */}
      <Box fixedPosition={{ x: 0, y: 0, w: props.termWidth, h: props.termHeight }} bg="#000000aa" />
      
      {/* Modal Dialog Body */}
      <Box 
        fixedPosition={{ x, y, w, h: modalHeight }} 
        bg="#1e1e1e" 
        border={true} 
        borderStyle="rounded"
        borderColor="#5b9df9"
        title={props.title}
        padding={{ top: 1, left: 1, right: 1, bottom: 1 }}
      >
        {props.children}
      </Box>
    </Show>
  );
}

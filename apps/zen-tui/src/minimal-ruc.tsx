/** @jsx h */
/**
 * minimal-ruc.tsx: Isolation test for Sovereign RUC Engine.
 */

import { createZenEngine } from '@zen-tui/core';
import { 
  render, 
  setLayoutEngine, 
  h,
  Box,
  Text,
  createSignal,
  onMount
} from '@zen-tui/solid';

console.log("[Test] Initializing...");

(globalThis as any).h = h;
(globalThis as any).Fragment = (props: any) => props.children;

const zen = createZenEngine();
setLayoutEngine(zen.layout);

const App = () => {
  const [count, setCount] = createSignal(0);
  
  onMount(() => {
    console.log("[Test] Component Mounted.");
    setInterval(() => {
        setCount(c => c + 1);
    }, 1000);
  });

  return (
    <Box flexDirection="column" padding={2}>
      <Text fg="#60a5fa" bold={true}>SOVEREIGN MINIMAL TEST</Text>
      <Box height={1} />
      <Text fg="#f1f5f9">Counter: {count()}</Text>
      <Text fg="#94a3b8">Press Ctrl+C to exit.</Text>
    </Box>
  );
};

console.log("[Test] Rendering...");
render(() => <App />, (zen as any).root);
console.log("[Test] Render complete.");

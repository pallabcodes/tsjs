import { Box, useInput } from '@zen-tui/solid';
import { useZenDispatch } from './store/ZenStore.js';
import { Header, HorizontalLine } from './view/Header.js';
import { Theme } from './theme.js';
import { Body } from './view/Body.js';
import { Footer } from './view/Footer.js';

export default function App() {
  useInput((e) => {
    useZenDispatch({ type: 'KEY_PRESS', key: e.name || 'UNK' });
  });

  return (
    <Box flexDirection="column" flexGrow={1} bg={Theme.Colors.Background}>
      <Header />
      <Box height={1} />
      <HorizontalLine />
      
      {/* ╼ Main Dashboard Body: Absolute Space Saturization correctly */}
      <Box flexGrow={1} flexDirection="column" overflow="hidden">
         <Body />
      </Box>
      <Footer />
    </Box>
  );
}

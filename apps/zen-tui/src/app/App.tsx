/** @jsx h */
import { Box, h, useInput } from '@zen-tui/solid';
import { ActionController } from './actions.js';
import { Header, HorizontalLine } from './view/Header.js';
import { Body } from './view/Body.js';
import { Footer } from './view/Footer.js';

/**
 * App: Sovereign Dashboard Final Sign-off (V120)
 * 
 * Absolute Purple: No Footer, 100% Dashboard Density correctly.
 */
export default function App() {
  useInput((e) => ActionController.dispatch(e));

  return (
    <Box flexDirection="column" flexGrow={1} bg="#020617">
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

import { 
  Zen, 
  Box, 
  Text, 
  Theme, 
  Show, 
  For 
} from '@zen-tui/core';
import { createZenStore } from './state/ZenStore';
import { CommitModal } from './components/CommitModal';

/**
 * ZenStore: Formal Type Extraction
 */
type ZenStore = ReturnType<typeof createZenStore>;

/**
 * truncate: Industrial String Truncation
 */
const truncate = (str: string, len: number) => {
  if (str.length <= len) return str;
  return str.substring(0, len - 3) + '...';
};

/**
 * formatMem: Convert KiB to MiB for Industrial Precision
 */
const formatMem = (kib: number) => {
  const mib = kib / 1024;
  return `${mib.toFixed(1)} MiB`;
};

/**
 * AppContent: The Sovereign Viewport
 */
export const AppContent = (props: { store: ZenStore }) => {
  const store = props.store;
  const EXPLORER_WIDTH = 30;

  return (
    <Box 
      id="app-root" 
      flexDirection="column" 
      width="100%" 
      height="100%" 
      bg={Theme.Colors.Background}
      padding={{ top: 1, bottom: 1, left: 1, right: 1 }}
    >
      {/* 1. Google-Grade Header (Premium Operational Command Bar / Hardened Spacing) */}
      <Box 
        height={1} 
        bg={Theme.Colors.Background} 
        padding={{ left: 1, right: 1 }} 
        flexDirection="row" 
        alignItems="center"
        border="solid"
        borderColor={Theme.Colors.Border}
      >
        {/* Left: Branding & Identity Hub (Expanded Width to prevent cramping) */}
        <Box width={30} flexShrink={0} flexDirection="row" alignItems="center">
            <Text fg={Theme.Colors.Success} value="⌬ " />
            <Text fg={Theme.Colors.Highlight} value="ZenTUI" bold={true} />
            <Box width={2} />
            {/* Identity Emblem: Ω {user} */}
            <Text fg={Theme.Colors.TextDim} value="Ω " />
            <Text fg={Theme.Colors.Primary} value={store.state.currentUser()} />
            {/* 🧱 Quadrant Gutter: Prevents overlap with central breadcrumbs */}
            <Box width={2} />
        </Box>
        
        {/* Center: Sovereign Breadcrumb & Sync Control (Centered Pivot) */}
        <Box flexGrow={1} justifyContent="center" flexDirection="row" alignItems="center">
          <Text fg={Theme.Colors.TextDim} value="Repo: " />
          <Text fg={Theme.Colors.Highlight} value="tsjs" bold={true} />
          <Box width={3} justifyContent="center" flexDirection="row">
            <Text fg={Theme.Colors.TextDim} value=" ‖ " />
          </Box>
          <Text fg={Theme.Colors.TextDim} value="Branch: " />
          <Text fg={Theme.Colors.Highlight} value={store.state.currentBranch()} bold={true} />
          
          {/* 🧱 Multi-Branch Sync Indicator: Projects Divergence Data */}
          {/* Note: Accessing signal value explicitly to resolve TS inference conflict */}
          <Show when={store.state.upstreamDelta()}>
            <Box padding={{ left: 1 }} flexDirection="row">
                <Show when={store.state.upstreamDelta()!.ahead > 0}>
                    <Text fg={Theme.Colors.Success} value={` ↑${store.state.upstreamDelta()!.ahead}`} />
                </Show>
                <Show when={store.state.upstreamDelta()!.behind > 0}>
                    <Text fg={Theme.Colors.Warning} value={` ↓${store.state.upstreamDelta()!.behind}`} />
                </Show>
                <Show when={store.state.upstreamDelta()!.ahead === 0 && store.state.upstreamDelta()!.behind === 0}>
                    <Text fg={Theme.Colors.Success} value=" ·" />
                </Show>
            </Box>
          </Show>
        </Box>
        
        {/* Right: Operational Telemetry (Iconographic) */}
        <Box width={25} flexShrink={0} flexDirection="row" alignItems="center" justifyContent="flex-end">
          <Box padding={{ left: 1, right: 1 }} flexDirection="row" alignItems="center">
              <Text fg={Theme.Colors.Success} value="⧊ " />
              <Text fg={Theme.Colors.Highlight} value={formatMem(store.state.memoryUsage())} />
              <Box width={2} />
              <Text fg={Theme.Colors.Success} value="⧗ " />
              <Text fg={Theme.Colors.TextDim} value={store.state.currentTime()} />
          </Box>
        </Box>
      </Box>

      {/* 2. Workspace (Industrial Row) */}
      <Box flexGrow={1} flexDirection="row">
        {/* 2a. Left: Industrial Explorer (30 cells width) */}
        <Box 
          width={EXPLORER_WIDTH} 
          border="solid" 
          borderColor={Theme.Colors.Border} 
          padding={{ top: 1, bottom: 1, left: 1, right: 1 }} 
          flexDirection="column"
        >
          <Box flexDirection="row">
            <Text fg={Theme.Colors.Highlight} value="⬢ EXPLORER" bold={true} />
            <Box flexGrow={1} />
            <Text fg={Theme.Colors.TextDim} value={`${store.state.stagedFiles().length + store.state.unstagedFiles().length}`} />
          </Box>
          <Box height={1} />
          
          {/* Staged Section */}
          <For each={store.state.stagedFiles()}>
            {(file) => (
              <Box padding={{ left: 1 }} flexDirection="row">
                <Text fg={Theme.Colors.Success} value={truncate(`[+] ${file}`, EXPLORER_WIDTH - 4)} />
              </Box>
            )}
          </For>

          {/* Unstaged Section */}
          <For each={store.state.unstagedFiles()}>
            {(file) => (
              <Box padding={{ left: 1 }} flexDirection="row">
                <Text fg={Theme.Colors.Warning} value={truncate(`[M] ${file}`, EXPLORER_WIDTH - 4)} />
              </Box>
            )}
          </For>

          <Show when={store.state.stagedFiles().length === 0 && store.state.unstagedFiles().length === 0}>
            <Box flexGrow={1} justifyContent="center" alignItems="center">
                <Text fg={Theme.Colors.TextDim} value="No active changes." />
            </Box>
          </Show>
        </Box>

        {/* 2b. Right: Main Hub (Flex-Grow) */}
        <Box flexGrow={1} flexDirection="column">
          {/* Top: Commit History (60% height) */}
          <Box 
            flexGrow={6} 
            border="solid" 
            borderColor={Theme.Colors.Border} 
            padding={{ top: 1, bottom: 1, left: 1, right: 1 }} 
            flexDirection="column"
          >
            <Box flexDirection="row">
                <Text fg={Theme.Colors.Highlight} value="⧉ COMMIT HISTORY" bold={true} />
            </Box>
            <Box height={1} />
            <For each={store.state.commits()}>
              {(commit, i) => (
                <Box 
                  bg={store.state.selectedIndex() === i() ? Theme.Colors.PanelActive : 'transparent'}
                  flexDirection="row"
                  padding={{ left: 1 }}
                >
                  <Text fg={Theme.Colors.TextDim} value={commit.hash.substring(0, 7)} />
                  <Box width={2} />
                  <Text 
                    fg={store.state.selectedIndex() === i() ? Theme.Colors.Highlight : Theme.Colors.Primary} 
                    value={truncate(commit.message, 60)} 
                  />
                </Box>
              )}
            </For>
            <Show when={store.state.commits().length === 0}>
                <Box flexGrow={1} justifyContent="center" alignItems="center">
                    <Text fg={Theme.Colors.TextDim} value="No commits detected." />
                </Box>
            </Show>
          </Box>

          {/* Bottom: Staging Review Area (40% height) */}
          <Box 
            flexGrow={4} 
            border="solid" 
            borderColor={Theme.Colors.Border} 
            padding={{ top: 1, bottom: 1, left: 1, right: 1 }} 
            flexDirection="column"
          >
             <Box flexDirection="row">
                <Text fg={Theme.Colors.Highlight} value="⬥ STAGING REVIEW" bold={true} />
                <Box flexGrow={1} />
                <Text fg={Theme.Colors.TextDim} value={`${store.state.stagedFiles().length} items`} />
             </Box>
             <Box height={1} />
             <For each={store.state.stagedFiles()}>
                {(file) => (
                    <Box padding={{ left: 1 }} flexDirection="row">
                        <Text fg={Theme.Colors.Primary} value={truncate(`+ ${file}`, 80)} />
                    </Box>
                )}
             </For>
             <Show when={store.state.stagedFiles().length === 0}>
                <Box flexGrow={1} justifyContent="center" alignItems="center">
                    <Text fg={Theme.Colors.TextDim} value="Ready for staging." />
                </Box>
             </Show>
          </Box>
        </Box>
      </Box>

      {/* 3. Navigation Bar (Synchronized Padding) */}
      <Box 
        height={1} 
        bg={Theme.Colors.Background} 
        flexDirection="row" 
        alignItems="center"
        padding={{ left: 1, right: 1 }}
      >
        <Text fg={Theme.Colors.Highlight} bold={true} value="⌘ DASHBOARD " />
        <Text fg={Theme.Colors.TextDim} value={`[${store.state.mode().toUpperCase()}] `} />
        <Box flexGrow={1} />
        <Text fg={Theme.Colors.TextDim} value="Tab: Switch | j/k: Nav | s: Stage | u: Unstage | c: Commit | q: Quit" />
      </Box>

      {/* 4. Overlays (Absolute Sovereign) */}
      <Show when={store.state.mode() === 'command'}>
        <CommitModal store={store} />
      </Show>
    </Box>
  );
};

/**
 * App: The Industrial Entry Point
 */
export default function App() {
  const store = createZenStore();
  
  return (
    <Zen.StoreContext.Provider value={store}>
      <AppContent store={store} />
    </Zen.StoreContext.Provider>
  );
}

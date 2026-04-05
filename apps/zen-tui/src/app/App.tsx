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
 * AppContent: The Sovereign Viewport
 */
export const AppContent = (props: { store: ZenStore }) => {
  const store = props.store;

  return (
    <Box 
      id="app-root" 
      flexDirection="column" 
      width="100%" 
      height="100%" 
      bg={Theme.Colors.Background}
      padding={{ top: 0, bottom: 0, left: 0, right: 0 }}
    >
      {/* 1. Header (Black on Purple) */}
      <Box height={1} bg={Theme.Colors.PanelActive} padding={{ left: 1, right: 1 }} flexDirection="row">
        <Text fg={Theme.Colors.Highlight} value="ZEN-TUI" bold={true} />
        <Box flexGrow={1} />
        <Text fg={Theme.Colors.Highlight} value={`BRANCH: ${store.state.currentBranch()}`} />
      </Box>

      {/* 2. Workspace (Industrial Row) */}
      <Box flexGrow={1} flexDirection="row">
        {/* 2a. Left: Branch Explorer (20% width) */}
        <Box 
          width={20} 
          border="solid" 
          borderColor={Theme.Colors.Border} 
          padding={{ top: 1, bottom: 1, left: 1, right: 1 }} 
          flexDirection="column"
        >
          <Text fg={Theme.Colors.Highlight} value="BRANCHES" bold={true} />
          <Box height={1} />
          <For each={store.state.branches()}>
            {(branch, i) => (
              <Box 
                bg={store.state.selectedBranchIdx() === i() ? Theme.Colors.PanelActive : 'transparent'}
                padding={{ left: 1 }}
              >
                <Text 
                  fg={store.state.selectedBranchIdx() === i() ? Theme.Colors.Highlight : Theme.Colors.TextDim} 
                  value={`${store.state.currentBranch() === branch ? '*' : ' '} ${branch}`} 
                />
              </Box>
            )}
          </For>
        </Box>

        {/* 2b. Right: Main Hub (80% width) */}
        <Box flexGrow={1} flexDirection="column">
          {/* Top: Commit History (60% height) */}
          <Box 
            flexGrow={6} 
            border="solid" 
            borderColor={Theme.Colors.Border} 
            padding={{ top: 1, bottom: 1, left: 1, right: 1 }} 
            flexDirection="column"
          >
            <Text fg={Theme.Colors.Highlight} value="COMMIT HISTORY" bold={true} />
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
                    value={commit.message} 
                  />
                </Box>
              )}
            </For>
            <Show when={store.state.commits().length === 0}>
                <Box flexGrow={1} justifyContent="center" alignItems="center">
                    <Text fg={Theme.Colors.TextDim} value="No commits found in current branch." />
                </Box>
            </Show>
          </Box>

          {/* Bottom: Staging Area (40% height) */}
          <Box 
            flexGrow={4} 
            border="solid" 
            borderColor={Theme.Colors.Border} 
            padding={{ top: 1, bottom: 1, left: 1, right: 1 }} 
            flexDirection="column"
          >
             <Box flexDirection="row">
                <Text fg={Theme.Colors.Highlight} value="STAGED FILES" bold={true} />
                <Box flexGrow={1} />
                <Text fg={Theme.Colors.TextDim} value={`${store.state.stagedFiles().length} items`} />
             </Box>
             <Box height={1} />
             <For each={store.state.stagedFiles()}>
                {(file) => (
                    <Box padding={{ left: 1 }}>
                        <Text fg={Theme.Colors.Primary} value={`+ ${file}`} />
                    </Box>
                )}
             </For>
             <Box height={1} />
             <Text fg={Theme.Colors.Highlight} value="UNSTAGED CHANGES" bold={true} />
             <For each={store.state.unstagedFiles()}>
                {(file) => (
                    <Box padding={{ left: 1 }}>
                        <Text fg={Theme.Colors.Warning} value={`M ${file}`} />
                    </Box>
                )}
             </For>
             <Show when={store.state.stagedFiles().length === 0 && store.state.unstagedFiles().length === 0}>
                <Box padding={{ left: 1 }}>
                    <Text fg={Theme.Colors.TextDim} value="No modifications detected." />
                </Box>
             </Show>
          </Box>
        </Box>
      </Box>

      {/* 3. Status Bar (Fixed at Bottom) */}
      <Box height={1} bg={Theme.Colors.Background} flexDirection="row" padding={{ left: 1, right: 1 }}>
        <Text fg={Theme.Colors.Highlight} bold={true} value="⚡ HARDCORE ENGINE " />
        <Text fg={Theme.Colors.Highlight} value={`MODE: ${store.state.mode().toUpperCase()} `} />
        <Box flexGrow={1} />
        <Text fg={Theme.Colors.TextDim} value="Tab: Switch | j/k: Nav | s/u: Stage | c: Commit | q: Quit" />
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

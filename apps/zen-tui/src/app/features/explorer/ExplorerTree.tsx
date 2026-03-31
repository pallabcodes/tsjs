import { createEffect, onMount } from 'solid-js';
import { Box, Text, FileTree, useInput } from '@zen-tui/solid';
import { Theme } from '../../theme.js';
import { useZenState, useZenDispatch } from '../../store/ZenStore.js';
import { getGitStatus } from '@zen-tui/core';
import { buildFileTree, flattenVisibleNodes } from './explorer-utils.js';

/**
 * Sovereign ExplorerTree
 * 
 * Orchestrates the AOT-compiled FileTree widget with real-time Git status.
 */
export function ExplorerTree() {
  const state = useZenState;
  const dispatch = useZenDispatch;

  const syncGit = () => {
    const flatFiles = getGitStatus();
    const tree = buildFileTree(flatFiles);
    const visible = flattenVisibleNodes(tree);
    
    dispatch({ type: 'EXPLORER_SYNC', files: visible });
  };

  onMount(() => {
    syncGit();
    // Poll every 5 seconds for Git updates (Sovereign Background Sync)
    const timer = setInterval(syncGit, 5000);
    return () => clearInterval(timer);
  });

  useInput((e) => {
    // Only capture keys if we're in passive mode (navigation mode)
    if (state.mode() !== 'passive') return;

    if (e.name === 'j' || e.name === 'down') {
      dispatch({ type: 'EXPLORER_MOVE', offset: 1 });
    } else if (e.name === 'k' || e.name === 'up') {
      dispatch({ type: 'EXPLORER_MOVE', offset: -1 });
    } else if (e.name === 'space') {
      dispatch({ type: 'EXPLORER_TOGGLE' });
      syncGit(); // Re-flatten after toggle
    }
  });

  return (
    <Box flexGrow={2} flexDirection="column" padding={{ right: Theme.Spacing.Medium }}>
       <Box flexDirection="row" height={1} marginBottom={1}>
           <Text fg={Theme.Colors.Success} value="● " />
           <Text fg={Theme.Colors.TextStrong} bold={true} value="WORKSPACE" />
       </Box>
       
       <FileTree 
         files={state.explorerFiles()} 
         selectedIdx={state.explorerIndex()}
         focused={state.mode() === 'passive'}
       />
    </Box>
  );
}

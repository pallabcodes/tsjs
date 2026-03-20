import React from "react";
import { Box, Text, useInput } from "ink";
import { useAppStore } from "../../store/index.js";
import { getTheme, icons } from "../../ui/theme.js";
import { rebase } from "../../features/rebase/facade.js";
import { mapValueOrNull } from "../../lib/collections.js";

export function SidePanel({ width, height }: { width: number; height: number }) {
  const { state, dispatch } = useAppStore();
  const theme = getTheme(state.themeName);
  const { activeView, commits, selectedCommitIndex, selectedFile, focusedPanel, diffs, diffScrollOffset } = state;
  const isFocused = focusedPanel === "SIDE";

  let commit = commits[selectedCommitIndex];
  if (activeView === "REBASE") {
     commit = (rebase.selectors.getCurrentStop(state.rebase)?.kind
       ? state.rebase.plan[state.rebase.runtime?.currentIndex ?? 0]
       : rebase.selectors.getSelectedPlanItem(state.rebase)) as any;
  }

  const diff = mapValueOrNull(diffs, selectedFile?.path);

  // Viewport for diff scrolling
  const viewportHeight = height - 6;

  useInput((input, key) => {
    if (!isFocused || state.isCommandPaletteOpen || state.confirmDialog) return;

    if (activeView === "LOG" && commit) {
      if (key.escape) {
        dispatch({ type: "SET_FOCUS", panel: "MAIN" });
        return;
      }
      if (input === "b") {
        dispatch({ type: "SET_NOTIFICATION", message: `Branch created from ${commit.shortHash}`, notificationType: "success" });
        setTimeout(() => dispatch({ type: "CLEAR_NOTIFICATION" }), 3000);
      }
      if (input === "c") {
        dispatch({ type: "SET_NOTIFICATION", message: `Checked out ${commit.shortHash} (detached)`, notificationType: "info" });
        setTimeout(() => dispatch({ type: "CLEAR_NOTIFICATION" }), 3000);
      }
      if (input === "p") {
        dispatch({ type: "SET_NOTIFICATION", message: `Cherry-picked ${commit.shortHash}`, notificationType: "success" });
        setTimeout(() => dispatch({ type: "CLEAR_NOTIFICATION" }), 3000);
      }
      if (input === "R") {
        dispatch({ 
          type: "SHOW_CONFIRM", 
          confirmType: "RESET_HARD", 
          message: `⚠ HARD RESET to ${commit.shortHash}? All uncommitted data will be lost.`,
          payload: commit.hash
        });
      }
      if (input === "S") {
        dispatch({ 
          type: "SHOW_CONFIRM", 
          confirmType: "RESET_SOFT", 
          message: `Confirm SOFT RESET to ${commit.shortHash}?`,
          payload: commit.hash
        });
      }
    }

    if (activeView === "STATUS" && selectedFile) {
      if (key.escape) {
        dispatch({ type: "SET_FOCUS", panel: "MAIN" });
        return;
      }
      if (key.upArrow || input === "k") {
        dispatch({ type: "SCROLL_DIFF", offset: -5 });
      }
      if (key.downArrow || input === "j") {
        dispatch({ type: "SCROLL_DIFF", offset: 5 });
      }
      // Hunk Staging Actions
      if (input === "s") {
         const diff = mapValueOrNull(state.diffs, selectedFile.path);
         if (diff && diff.hunks[state.selectedHunkIndex]) {
            dispatch({ type: "TOGGLE_HUNK_STAGING", path: selectedFile.path, hunkIndex: state.selectedHunkIndex });
         }
      }
      // Hunk Navigation
      if (input === "K") {
         dispatch({ type: "SET_SELECTED_HUNK", index: Math.max(0, state.selectedHunkIndex - 1) });
      }
      if (input === "J") {
         const diff = mapValueOrNull(state.diffs, selectedFile.path);
         if (diff) {
            dispatch({ type: "SET_SELECTED_HUNK", index: Math.min(diff.hunks.length - 1, state.selectedHunkIndex + 1) });
         }
      }
      // Conflict Resolution Shortcuts
      if (state.rebase.stage === "stopped_for_conflict" && state.rebase.stopReason?.kind === "conflict" && state.rebase.stopReason.files.includes(selectedFile.path)) {
         if (input === "c") { // Take Current
            dispatch({ type: "RESOLVE_CONFLICT", path: selectedFile.path });
            dispatch({ type: "SET_NOTIFICATION", message: "Accepted current changes", notificationType: "success" });
         }
         if (input === "i") { // Take Incoming
            dispatch({ type: "RESOLVE_CONFLICT", path: selectedFile.path });
            dispatch({ type: "SET_NOTIFICATION", message: "Accepted incoming changes", notificationType: "success" });
         }
      }
    }
  });

  return (
    <Box flexDirection="column" width={width} height={height} borderStyle="round" borderColor={isFocused ? theme.accentBlue : theme.border} paddingX={1} {...({ backgroundColor: theme.bgPanel } as any)}>
      <Box borderStyle="single" borderBottom={true} borderTop={false} borderLeft={false} borderRight={false} borderColor={theme.border} justifyContent="space-between">
        <Text bold color={isFocused ? theme.accentBlue : theme.textSecondary}>
          {activeView === "STATUS" ? `DIFF: ${selectedFile?.path || "none"}` : "COMMIT DETAILS"}
        </Text>
        {isFocused && <Text color={theme.accentBlue}> [FOCUS] </Text>}
      </Box>

      {(activeView === "LOG" || activeView === "REBASE") && commit && (
        <Box flexDirection="column" marginTop={1}>
          <Text color={theme.commitHash} bold wrap="truncate">{commit.hash}</Text>
          <Box marginTop={1}><Text color={theme.textPrimary} wrap="wrap">{commit.message}</Text></Box>
          <Box marginTop={1} gap={2}>
            <Text color={theme.textMuted}>{icons.dot} {commit.author}</Text>
            <Text color={theme.textMuted}>{icons.dot} {commit.date}</Text>
          </Box>
          {commit.tags && commit.tags.length > 0 && (
            <Box marginTop={1}><Text color={theme.tagColor}>{icons.tag} {commit.tags.join(", ")}</Text></Box>
          )}
          {commit.branch && (
            <Box marginTop={0}><Text color={theme.branchCurrent}>{icons.branch} {commit.branch}</Text></Box>
          )}

          <Box marginTop={1} flexDirection="column" borderStyle="single" borderTop={true} borderBottom={false} borderLeft={false} borderRight={false} borderColor={theme.border} paddingTop={1}>
            <Text color={theme.textSecondary} bold>{isFocused ? "Actions:" : "Actions (Tab to focus):"}</Text>
            <Box flexDirection="column" paddingLeft={1}>
              <Text color={isFocused ? theme.textPrimary : theme.textMuted}>[b] Create branch</Text>
              <Text color={isFocused ? theme.textPrimary : theme.textMuted}>[c] Checkout (detached)</Text>
              <Text color={isFocused ? theme.textPrimary : theme.textMuted}>[p] Cherry-pick</Text>
              <Text color={isFocused ? theme.accentOrange : theme.textMuted}>[R] Reset --hard</Text>
              <Text color={isFocused ? theme.accentCyan : theme.textMuted}>[S] Reset --soft</Text>
              <Box marginTop={1}><Text color={theme.textMuted}>[Esc] Return Focus</Text></Box>
            </Box>
          </Box>
        </Box>
      )}

      {activeView === "STATUS" && selectedFile && (
        <Box flexDirection="column" marginTop={1} flexGrow={1}>
          <Box gap={2} marginBottom={1}>
             <Text color={selectedFile.staged ? theme.staged : theme.unstaged} bold inverse> {selectedFile.staged ? "STAGED" : "UNSTAGED"} </Text>
             <Text color={theme.textMuted}> {selectedFile.additions} insertions(+), {selectedFile.deletions} deletions(-) </Text>
          </Box>

          <Box flexDirection="column" flexGrow={1}>
            {diff ? (
              (() => {
                // Flatten hunks into lines for virtual scrolling
                let allLines = diff.hunks.flatMap(hunk => [
                  { type: "header", content: hunk.header },
                  ...hunk.lines
                ]);

                // Simulate Conflict Markers in diff if file is conflicting
                if (state.rebase.stage === "stopped_for_conflict" && state.rebase.stopReason?.kind === "conflict" && state.rebase.stopReason.files.includes(selectedFile.path)) {
                   allLines = [
                      { type: "header", content: "Conflict in " + selectedFile.path },
                      { type: "del", content: "<<<<<<< HEAD (Current Change)" },
                      ...diff.hunks[0]?.lines.filter(l => l.type === "del") || [],
                      { type: "ctx", content: "=======" },
                      ...diff.hunks[0]?.lines.filter(l => l.type === "add") || [],
                      { type: "add", content: ">>>>>>> Incoming Change" },
                      ...allLines.slice(1)
                   ] as any;
                }

                const visibleLines = allLines.slice(diffScrollOffset, diffScrollOffset + viewportHeight);
                
                return visibleLines.map((line, idx) => {
                  const hunkIdx = diff.hunks.findIndex(h => h.header === line.content);
                  const isHunkHeader = line.type === "header";
                  const isSelectedHunk = isHunkHeader && hunkIdx === state.selectedHunkIndex;
                  const isStaged = isHunkHeader && selectedFile.stagedHunkIndexes?.includes(hunkIdx);

                  const color = isSelectedHunk ? theme.accentBlue : line.type === "add" ? theme.diffAdd : line.type === "del" ? theme.diffDel : line.type === "header" ? theme.accentPurple : theme.diffCtx;
                  const bg = isSelectedHunk ? theme.bgSelected : line.type === "add" ? theme.diffAddBg : line.type === "del" ? theme.diffDelBg : undefined;
                  
                  return (
                    <Box key={idx} {...({ backgroundColor: bg } as any)}>
                      <Text color={color as any} wrap="truncate">
                        {isHunkHeader ? (isStaged ? "[✓] " : "[ ] ") : (line.type === "add" ? "+" : line.type === "del" ? "-" : " ")}
                        {line.content}
                      </Text>
                    </Box>
                  );
                });
              })()
            ) : (
              <Box flexDirection="column">
                <Text color={theme.textMuted}>@@ -12,4 +12,6 @@</Text>
                <Box paddingLeft={1} flexDirection="column">
                  <Text color={theme.diffCtx}>{"  export function App() {"}</Text>
                  <Text color={theme.diffDel}>{"- const old = require('legacy');"}</Text>
                  <Text color={theme.diffAdd}>{"+ import { modern } from './new';"}</Text>
                  <Text color={theme.diffAdd}>{"+ import { utils } from './helpers';"}</Text>
                  <Text color={theme.diffCtx}>{"  return ("}</Text>
                </Box>
                <Box marginTop={1}>
                  <Text color={theme.textMuted}>[... Mock diff for smaller files ...]</Text>
                </Box>
              </Box>
            )}
          </Box>
          {diff && (
             <Box borderStyle="round" borderColor={theme.border} paddingX={1} marginTop={1} flexDirection="row" gap={2}>
                <Text color={theme.textMuted}>Scroll: [j/k]</Text>
                <Text color={theme.accentBlue}>[S-J/K] Jump Hunk</Text>
                <Text color={theme.accentGreen}>[s] Stage Hunk</Text>
                {state.rebase.stage === "stopped_for_conflict" && state.rebase.stopReason?.kind === "conflict" && state.rebase.stopReason.files.includes(selectedFile.path) && (
                   <>
                      <Text color={theme.accentCyan}>[c] Take Current</Text>
                      <Text color={theme.accentPink}>[i] Take Incoming</Text>
                   </>
                )}
                <Text color={theme.textMuted}>[Esc] Return Focus</Text>
             </Box>
          )}
        </Box>
      )}

      {activeView === "STATUS" && !selectedFile && (
        <Box marginTop={1}><Text color={theme.textMuted}>Select a file in STATUS view to see diff</Text></Box>
      )}
    </Box>
  );
}

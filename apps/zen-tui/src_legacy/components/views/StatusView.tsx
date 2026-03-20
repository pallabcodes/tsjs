import React, { useEffect, useState } from "react";
import { Box, Text, useInput } from "ink";
import TextInput from "ink-text-input";
import { useAppStore } from "../../store/index.js";
import { getTheme, icons } from "../../ui/theme.js";
import { rebase } from "../../features/rebase/facade.js";

export function StatusView({ height }: { height: number }) {
  const { state, dispatch, rebaseActions } = useAppStore();
  const theme = getTheme(state.themeName);
  const { status, selectedStatusIndex, focusedPanel, isCommitting, commitMessage } = state;

  const isFocused = focusedPanel === "MAIN";
  const staged = status.filter(f => f.staged);
  const unstaged = status.filter(f => !f.staged);

  useEffect(() => {
    const file = status[selectedStatusIndex] || null;
    dispatch({ type: "SELECT_FILE", file });
  }, [selectedStatusIndex, status]);

  useInput((input, key) => {
    if (state.activeView !== "STATUS" || state.isCommandPaletteOpen || state.confirmDialog) return;

    if (isCommitting) {
       // Logic handled by TextInput component, but Escape should cancel
        if (key.escape) {
          if (commitMessage.trim().length > 0) {
            dispatch({ type: "SHOW_CONFIRM", confirmType: "CANCEL_COMMIT", message: "Discard current commit message?" });
          } else {
            dispatch({ type: "CANCEL_COMMIT" });
          }
        }
       return;
    }

    if (!isFocused) return;
    if (key.upArrow || input === "k") {
      dispatch({ type: "SET_SELECTED_STATUS", index: Math.max(0, selectedStatusIndex - 1) });
    }
    if (key.downArrow || input === "j") {
      dispatch({ type: "SET_SELECTED_STATUS", index: Math.min(status.length - 1, selectedStatusIndex + 1) });
    }
    if (input === "s") {
      const file = status[selectedStatusIndex];
      if (file) dispatch({ type: "STAGE_FILE", path: file.path });
    }
    if (input === "u") {
      const file = status[selectedStatusIndex];
      if (file) dispatch({ type: "UNSTAGE_FILE", path: file.path });
    }
    if (input === "a") {
      dispatch({ type: "STAGE_ALL" });
    }
    if (key.return) {
      if (rebase.selectors.isRuntimeStage(state.rebase) && state.rebase.runtime?.currentIndex !== null) {
         void rebaseActions.continue();
      } else if (staged.length > 0) {
        dispatch({ type: "START_COMMIT" });
      } else {
        dispatch({ type: "SET_NOTIFICATION", message: "Stage files first!", notificationType: "warning" });
        setTimeout(() => dispatch({ type: "CLEAR_NOTIFICATION" }), 2000);
      }
    }
    if (input === "P") {
       dispatch({ type: "SET_NOTIFICATION", message: "Pushing to remote...", notificationType: "info" });
       setTimeout(() => {
          dispatch({ type: "SET_NOTIFICATION", message: "Pushed successfully!", notificationType: "success" });
          setTimeout(() => dispatch({ type: "CLEAR_NOTIFICATION" }), 2000);
       }, 2000);
    }

    // Contextual Rebase Actions in Status
    if (rebase.selectors.isRuntimeStage(state.rebase) && state.rebase.runtime?.currentIndex !== null) {
       if (key.escape) {
          dispatch({ type: "SHOW_CONFIRM", confirmType: "ABORT_REBASE", message: "Abort rebase and discard remaining steps?" });
       }
       if (input === "k") {
          void rebaseActions.skip();
       }
    }
  });

  return (
    <Box flexDirection="column" flexGrow={1} borderStyle="round" borderColor={isFocused ? theme.accentBlue : theme.border}>
     <Box paddingX={1} justifyContent="space-between" borderStyle="single" borderBottom={true} borderTop={false} borderLeft={false} borderRight={false} borderColor={theme.border}>
        <Box gap={2}>
           <Text bold color={isFocused ? theme.accentBlue : theme.textSecondary}>STATUS / CHANGES</Text>
           {rebase.selectors.isRuntimeStage(state.rebase) && state.rebase.runtime && (
              <Box {...({ backgroundColor: theme.accentOrange } as any)} paddingX={1}>
                 <Text color={theme.bg} bold> REBASING ({(state.rebase.runtime.currentIndex ?? 0) + 1}/{state.rebase.runtime.total}) </Text>
              </Box>
           )}
           {state.rebase.stage === "stopped_for_conflict" && (
              <Box {...({ backgroundColor: theme.accentRed } as any)} paddingX={1}>
                 <Text color={theme.bg} bold> RESOLVING CONFLICTS </Text>
              </Box>
           )}
        </Box>
        <Text color={theme.textMuted}>{staged.length} staged {icons.dot} {unstaged.length} changes</Text>
      </Box>

      {isCommitting && (
         <Box flexDirection="column" paddingX={1} marginY={1} borderStyle="double" borderColor={theme.accentGreen}>
            <Text color={theme.accentGreen} bold>COMMIT MESSAGE</Text>
            <Box marginTop={1}>
               <Text color={theme.accentCyan}>❯ </Text>
               <TextInput 
                  value={commitMessage} 
                  onChange={(val) => dispatch({ type: "SET_COMMIT_MESSAGE", message: val })} 
                  onSubmit={() => dispatch({ type: "FINISH_COMMIT" })}
                  placeholder="Enter message... (Esc to cancel)"
               />
            </Box>
         </Box>
      )}

      {!isCommitting && (
         <Box flexDirection="column" paddingX={1} paddingTop={1} flexGrow={1}>
            {state.rebase.stage === "stopped_for_conflict" && state.rebase.stopReason?.kind === "conflict" && (
               <Box flexDirection="column" marginBottom={1}>
                  <Text color={theme.accentRed} bold>UNMERGED PATHS (CONFLICTS):</Text>
                  {state.rebase.stopReason.files.map(path => (
                     <Box key={path}>
                        <Text color={theme.accentRed}>  {icons.warning} CONFLICT: {path}</Text>
                     </Box>
                  ))}
               </Box>
            )}
            <Text color={theme.staged} bold>[STAGED]</Text>
            {staged.length === 0 && <Box paddingLeft={2}><Text color={theme.textMuted}>none</Text></Box>}
            {staged.map((file) => {
               const idx = status.indexOf(file);
               const isSelected = idx === selectedStatusIndex;
               const isPartial = (file.stagedHunkIndexes?.length || 0) > 0;
               
               return (
                  <Box key={file.path}>
                     <Text color={isSelected ? theme.accentBlue : theme.textMuted}>{isSelected ? "▸" : " "}</Text>
                     <Text color={theme.staged} inverse={isSelected && isFocused}>
                        {" "}{isPartial ? icons.ahead : icons.staged} {file.path}
                        {isPartial && <Text color={theme.textMuted}> (partial)</Text>}
                     </Text>
                     {file.additions !== undefined && <Text color={theme.diffAdd}> +{file.additions}</Text>}
                     {file.deletions !== undefined && <Text color={theme.diffDel}> -{file.deletions}</Text>}
                  </Box>
               );
            })}

            <Box marginTop={1}>
               <Text color={theme.unstaged} bold>[UNSTAGED / UNTRACKED]</Text>
            </Box>
            {unstaged.length === 0 && <Box paddingLeft={2}><Text color={theme.textMuted}>none</Text></Box>}
            {unstaged.map((file) => {
               const idx = status.indexOf(file);
               const isSelected = idx === selectedStatusIndex;
               return (
                  <Box key={file.path}>
                     <Text color={isSelected ? theme.accentBlue : theme.textMuted}>{isSelected ? "▸" : " "}</Text>
                     <Text color={file.status === "??" ? theme.untracked : theme.unstaged} inverse={isSelected && isFocused}>
                        {" "}{file.status === "??" ? icons.untracked : icons.unstaged} {file.path}
                     </Text>
                  </Box>
               );
            })}
         </Box>
      )}

      <Box paddingX={1} borderStyle="single" borderTop={true} borderBottom={false} borderLeft={false} borderRight={false} paddingTop={1} borderColor={theme.border}>
        <Box gap={1} flexWrap="wrap">
           <Text color={theme.textMuted}>[s] Stage [u] Unstage [a] All [P] Push [Tab] Diff</Text>
           {rebase.selectors.isRuntimeStage(state.rebase) && state.rebase.runtime?.currentIndex !== null ? (
              <>
                 <Text color={theme.accentGreen} bold> [Enter] Continue Rebase </Text>
                 <Text color={theme.accentCyan}> [k] Skip Current Step </Text>
                 <Text color={theme.textMuted}> [5] Rebase View </Text>
              </>
           ) : (
              <Text color={theme.textMuted}> [Enter] Commit </Text>
           )}
        </Box>
      </Box>
    </Box>
  );
}

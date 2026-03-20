import React, { useState, useEffect } from "react";
import { Box, Text, useStdout, useInput, useApp } from "ink";
import { useAppStore } from "../store/index.js";
import { LogView } from "./views/LogView.js";
import { StatusView } from "./views/StatusView.js";
import { RebaseView } from "./views/RebaseView.js";
import { BranchView } from "./views/BranchView.js";
import { StashView } from "./views/StashView.js";
import { Header } from "./common/Header.js";
import { StatusBar } from "./StatusBar.js";
import { CommandPalette } from "./common/CommandPalette.js";
import { SidePanel } from "./common/SidePanel.js";
import { ViewType } from "../types/index.js";
import { getTheme, icons } from "../ui/theme.js";
import { rebase } from "../features/rebase/facade.js";
import { showSidePanel as shouldShowSidePanel } from "../app/shell/selectors.js";

export function MainLayout() {
  const { state, dispatch, rebaseActions } = useAppStore();
  const { stdout } = useStdout();
  const { exit } = useApp();

  // Reactive terminal dimensions
  const [dims, setDims] = useState({ w: stdout?.columns ?? 80, h: stdout?.rows ?? 24 });
  useEffect(() => {
    const onResize = () => setDims({ w: stdout?.columns ?? 80, h: stdout?.rows ?? 24 });
    stdout?.on("resize", onResize);
    return () => { stdout?.off("resize", onResize); };
  }, [stdout]);

  const width = dims.w;
  const height = dims.h;
  const contentHeight = height - 4;
  const showSidePanel = shouldShowSidePanel(state, width);
  const sidePanelWidth = showSidePanel ? Math.min(Math.floor(width * 0.4), 80) : 0;
  const mainPanelWidth = showSidePanel ? width - sidePanelWidth : width;

  useInput((input, key) => {
    // Global Confirmation Dialog handling
    if (state.confirmDialog) {
       if (input === "y" || input === "Y") {
          if (state.confirmDialog.type === "RESET_HARD") dispatch({ type: "RESET_HARD", commitHash: String(state.confirmDialog.payload ?? "") });
          if (state.confirmDialog.type === "RESET_SOFT") dispatch({ type: "RESET_SOFT", commitHash: String(state.confirmDialog.payload ?? "") });
          if (state.confirmDialog.type === "ABORT_REBASE") void rebaseActions.abort();
          if (state.confirmDialog.type === "CANCEL_COMMIT") dispatch({ type: "CANCEL_COMMIT" });
          dispatch({ type: "SET_NOTIFICATION", message: "Action confirmed", notificationType: "success" });
          setTimeout(() => dispatch({ type: "CLEAR_NOTIFICATION" }), 2000);
       }
       if (input === "n" || input === "N" || key.escape) {
          dispatch({ type: "HIDE_CONFIRM" });
       }
       return;
    }

    if (state.isCommandPaletteOpen) return;
    if (state.isCommitting) return;

    // Global Rebase Execution handling
    if (rebase.selectors.isRuntimeStage(state.rebase) && state.rebase.runtime?.currentIndex !== null) {
      if (key.return) {
        void rebaseActions.continue();
        return;
      }
      if (key.escape) {
        dispatch({ type: "SHOW_CONFIRM", confirmType: "ABORT_REBASE", message: "Abort rebase and discard remaining steps?" });
        return;
      }
      if (input === "k") {
        void rebaseActions.skip();
        return;
      }
    }

    // Tab switching
    if (key.tab && showSidePanel) {
      dispatch({ type: "SET_FOCUS", panel: state.focusedPanel === "MAIN" ? "SIDE" : "MAIN" });
      return;
    }

    // View switching
    const viewMap: Record<string, ViewType> = { "1": "LOG", "2": "STATUS", "3": "BRANCHES", "4": "STASH", "5": "REBASE" };
    if (viewMap[input]) {
      dispatch({ type: "SET_VIEW", view: viewMap[input]! });
      return;
    }

    // Theme switching
    if (input === "T") {
      dispatch({ type: "CYCLE_THEME" });
      return;
    }

    if (input === ":") {
      dispatch({ type: "TOGGLE_COMMAND_PALETTE" });
      return;
    }

    if (input === "q") {
      exit();
    }
  });

  const isOverlayVisible = !!state.confirmDialog || state.isCommandPaletteOpen;
  const baseTheme = getTheme(state.themeName);
  
  // Dynamic Dimming: shift primary colors to muted variants when modal is open
  const theme = isOverlayVisible ? {
    ...baseTheme,
    textPrimary: baseTheme.textSecondary,
    accentBlue: baseTheme.textMuted,
    accentGreen: baseTheme.textMuted,
    accentOrange: baseTheme.textMuted,
    accentCyan: baseTheme.textMuted,
    border: baseTheme.textMuted,
    borderFocus: baseTheme.textMuted,
  } : baseTheme;

  if (width < 60 || height < 15) {
    return (
      <Box width={width} height={height} justifyContent="center" alignItems="center" flexDirection="column" {...({ backgroundColor: baseTheme.bg } as any)}>
        <Text color={baseTheme.accentOrange} bold> {icons.warning} WINDOW TOO SMALL </Text>
        <Text color={baseTheme.textSecondary}> Please enlarge your terminal to use Zen-TUI </Text>
        <Box marginTop={1}><Text color={baseTheme.textMuted}> Current: {width}x{height} | Required: 60x15 </Text></Box>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" width={width} height={height} {...({ backgroundColor: theme.bg } as any)}>
      <Header width={width} />
      
      <Box flexGrow={1} flexDirection="row" overflow="hidden">
        <Box 
          flexGrow={1} 
          flexDirection="column"
          minWidth={20}
        >
          {state.activeView === "LOG" && <LogView height={height - 4} width={width - sidePanelWidth} />}
          {state.activeView === "STATUS" && <StatusView height={height - 4} />}
          {state.activeView === "REBASE" && <RebaseView height={height - 4} />}
          {state.activeView === "BRANCHES" && <BranchView height={height - 4} />}
          {state.activeView === "STASH" && <StashView height={height - 4} />}
        </Box>

        {showSidePanel && (
           <Box width={sidePanelWidth} flexShrink={0}>
              <SidePanel width={sidePanelWidth} height={height - 4} />
           </Box>
        )}
      </Box>

      <StatusBar width={width} />

      {/* MODAL LAYER: Highlighting focus and preventing overlap confusion */}
      {state.isCommandPaletteOpen && (
        <Box 
          position="absolute" 
          width={width} 
          height={height} 
          justifyContent="center" 
          alignItems="center"
        >
          <CommandPalette />
        </Box>
      )}
      
      {state.confirmDialog && (
        <Box 
          position="absolute" 
          width={width} 
          height={height} 
          justifyContent="center" 
          alignItems="center"
        >
          {/* SOLID MODAL WRAPPER: Width 52 to include border and 1px padding */}
          <Box
            width={52}
            borderStyle="double"
            borderColor={baseTheme.accentOrange}
            flexDirection="column"
            paddingX={1}
            {...({ backgroundColor: baseTheme.bgPanel } as any)}
          >
            {/* Header row padded to full width to mask background */}
            <Box width="100%"><Text color={baseTheme.accentOrange} bold> {icons.warning} CONFIRMATION </Text></Box>
            
            <Box marginY={1} width="100%">
              <Text color={baseTheme.textPrimary}>{state.confirmDialog.message}</Text>
            </Box>
            
            <Box gap={2} width="100%">
               <Text color={baseTheme.accentGreen}>[y] Yes</Text>
               <Text color={baseTheme.accentRed}>[n] No</Text>
            </Box>
            
            {/* Bottom padding row for stability */}
            <Box height={1} width="100%" /> 
          </Box>
        </Box>
      )}
    </Box>
  );
}

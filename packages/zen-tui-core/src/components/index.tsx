/**
 * @zen-tui/core: Industrial Components (Hardened Edition)
 * 
 * High-fidelity components for Git workflows.
 */

import { type ZenChildren, type CommitData } from '@zen-tui/node';
import { Box, Text } from '../ui/index';
import { Theme } from '../engine/theme';

/**
 * 🏗️ App Namespace: Global Container
 */
export const App = {
  Container: (props: { children: ZenChildren }): any => (
    <Box 
        flexDirection="column" 
        width="100%" 
        height="100%" 
        flexGrow={1}
        bg={Theme.Colors.Background}
    >
      {props.children}
    </Box>
  )
};

/**
 * 🏗️ Status Namespace: Information Bar
 */
export const Status = {
  Bar: (props: { children: ZenChildren }): any => (
    <Box 
        flexDirection="row" 
        height={1} 
        bg={Theme.Colors.PanelActive} 
        padding={{ left: 1, right: 1 }}
        gap={2}
    >
      {props.children}
    </Box>
  ),
  Item: (props: { icon?: string, value: string, color?: string }): any => (
    <Box flexDirection="row">
      {props.icon && <Text fg={props.color || Theme.Colors.Highlight} value={`${props.icon} `} />}
      <Text fg={Theme.Colors.TextMain} value={props.value} />
    </Box>
  )
};

/**
 * 🏗️ Commit Namespace: Git Graph
 */
export const Commit = {
    Graph: (props: { commits: CommitData[], onCommitSelect: (c: CommitData) => void }): any => {
        return (
          <Box flexDirection="column" padding={{ top: 1 }}>
            {props.commits.map((commit) => (
              <Box 
                height={1} 
                flexDirection="row" 
                onClick={() => props.onCommitSelect(commit)}
                gap={1}
              >
                <Text fg={Theme.Colors.Highlight} value={`• ${commit.hash.slice(0, 7)}`} />
                <Text fg={Theme.Colors.TextMain} value={commit.message} />
              </Box>
            ))}
          </Box>
        );
    }
};

/**
 * 🏗️ Diff Namespace: File Inspection
 */
export const Diff = {
    View: (props: { content?: string }): any => {
        const lines = (props.content || "").split('\n');
        return (
          <Box flexDirection="column" flexGrow={1} overflow="hidden">
            {lines.map((line) => {
              let fg: string = Theme.Colors.TextMain;
              
              if (line.startsWith('diff --git') || line.startsWith('index') || line.startsWith('---') || line.startsWith('+++')) {
                fg = Theme.Colors.TextMuted;
              } else if (line.startsWith('+')) {
                fg = Theme.Colors.Success;
              } else if (line.startsWith('-')) {
                fg = Theme.Colors.Danger;
              } else if (line.startsWith('@@')) {
                fg = Theme.Colors.Highlight;
              }
              
              return (
                <Box height={1} padding={{ left: 1 }}>
                  <Text fg={fg} value={line} />
                </Box>
              );
            })}
          </Box>
        );
    }
};

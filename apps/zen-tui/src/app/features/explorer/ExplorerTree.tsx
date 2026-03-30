/** @jsx h */
import { Box, Text } from '@zen-tui/solid';
import { Theme } from '../../theme.js';

/**
 * ExplorerTree: The Left Navigation Panel
 * Switched to fluid layout ratios.
 */
export function ExplorerTree() {
  return (
    <Box flexGrow={2} flexDirection="column" padding={{ right: Theme.Spacing.Medium }}>
       <Box flexDirection="row" height={1}>
           <Text fg={Theme.Colors.Success} value="● " />
           <Text fg={Theme.Colors.TextStrong} bold={true} value="WORKSPACE" />
       </Box>
       <Box height={1} />
       <FolderNode name="apps/zen-tui" open={true} />
       <FileNode name="App.tsx" status="M" color={Theme.Colors.Warning} depth={1} />
       <FileNode name="Body.tsx" status="M" color={Theme.Colors.Warning} depth={1} />
       <FileNode name="Header.tsx" status="M" color={Theme.Colors.Warning} depth={1} />
       <FileNode name="actions.ts" status="A" color={Theme.Colors.Success} depth={1} />
       <FileNode name="state.ts" status="D" color={Theme.Colors.Danger} depth={1} />
       <FolderNode name="packages" open={false} />
       <FolderNode name="tooling" open={false} />
    </Box>
  );
}

const FolderNode = (props: any) => (
  <Box flexDirection="row" height={1}>
     <Text fg={Theme.Colors.Primary} value={props.open ? " ▼ " : " ▶ "} />
     <Text fg={Theme.Colors.TextMain} bold={props.open} value={props.name} />
  </Box>
);

const FileNode = (props: any) => (
  <Box flexDirection="row" height={1}>
     <Box width={props.depth * 3}><Text value="" /></Box>
     <Text fg={Theme.Colors.TextDim} value=" ├─ " />
     <Box flexGrow={1}><Text fg={Theme.Colors.TextMuted} value={props.name} /></Box>
     <Text fg={props.color} bold={true} value={props.status} />
  </Box>
);

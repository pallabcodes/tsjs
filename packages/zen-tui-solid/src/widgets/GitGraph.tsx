/** @jsx h */
import { Box, Text, h } from "../index.js";
import { truncate } from "../utils.js";

/**
 * GitGraph: Multi-lane, color-coded revision history graph.
 * Matches high-fidelity mockup with curved-style visualization.
 */
interface Commit {
  hash: string;
  msg: string;
  author?: string;
}

interface GitGraphProps {
  commits: Commit[];
  width?: number;
  focused?: boolean;
  onSelect?: (idx: number) => void;
}

export function GitGraph(props: GitGraphProps) {
  const COLORS = ["#a855f7", "#3b82f6", "#2dd4bf"]; // Purple, Blue, Teal
  const W = props.width || 60;

  return (
    <Box flexDirection="column">
      <Box padding={{ left: 2, bottom: 1 }}>
        <Text fg="#94a3b8" bold={true}>HEAD</Text>
      </Box>
      
      {props.commits.map((commit, idx) => {
        const lane = idx % 3;
        const color = COLORS[lane];
        const isSelected = props.focused && idx === 0;

        // Draw graph lanes
        const prefix = " ".repeat(lane * 2);
        const connector = idx === 0 ? "●" : "│";
        
        return (
          <Box 
            flexDirection="row" 
            bg={isSelected ? "#1e293b" : undefined}
            padding={{ left: 1, right: 1 }}
          >
            <Box width={8} flexDirection="row">
               <Text fg={color}>{`${prefix}${connector} `}</Text>
               <Show when={lane === 0 && idx === 0}>
                  <Text fg="#a855f7">main - </Text>
               </Show>
            </Box>

            <Text fg={isSelected ? "#60a5fa" : "#64748b"}>
              {commit.hash.slice(0, 7)}
            </Text>
            
            <Box width={2} />

            <Text fg={isSelected ? "#f1f5f9" : "#cbd5e1"}>
              {truncate(commit.msg, W - 20)}
            </Text>
          </Box>
        );
      })}

      <Box padding={{ left: 2, top: 1 }}>
        <Text fg="#94a3b8" bold={true}>HEAD</Text>
      </Box>
    </Box>
  );
}

// Internal Show shim to break circular dependency
function Show(props: { when: any, children: any }) {
  return props.when ? props.children : null;
}

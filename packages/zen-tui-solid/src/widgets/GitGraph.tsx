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
  author: string;
  date: string;
  track?: number;
  isHead?: boolean;
  branchName?: string;
}

interface GitGraphProps {
  commits: Commit[];
  selectedIdx?: number;
  width?: number;
  focused?: boolean;
  onSelect?: (idx: number) => void;
}

export function GitGraph(props: GitGraphProps) {
  const COLORS = ["#a855f7", "#3b82f6", "#2dd4bf"]; // Purple, Blue, Teal
  const W = props.width || 60;

  return (
    <Box flexDirection="column" gap={0}>
      {props.commits.map((commit, idx) => {
        const lane = commit.track ?? 0;
        const color = COLORS[lane % COLORS.length];
        const isSelected = props.focused && idx === (props.selectedIdx ?? 0);

        // Render multiple lanes to match mockup high-density graph
        const lanes = [0, 1, 2]; // Fixed lanes for now to match three-column mockup density
        
        return (
          <Box 
            flexDirection="row" 
            bg={isSelected ? "#1e293b" : undefined}
            padding={{ left: 1, right: 1 }}
          >
            <Box width={10} flexDirection="row">
               {lanes.map(l => {
                 const isCommitLane = l === lane;
                 const isCurved = l > lane;
                 // Premium Curved Layout (Mockup Style)
                 let connector = "│ ";
                 if (isCommitLane) connector = isSelected ? "* " : "o ";
                 else if (isCurved) connector = "╭─";
                 
                 const laneColor = isCommitLane ? (isSelected ? "#4ade80" : COLORS[l % COLORS.length]) : "#1e293b";
                 return <Text fg={laneColor} value={connector} />;
               })}
               <Show when={commit.isHead}>
                  <Text fg="#4ade80" bold={true} value="* " />
               </Show>
            </Box>

            <Text fg={isSelected ? "#60a5fa" : "#64748b"}>
              {commit.hash.slice(0, 7)}
            </Text>
            
            <Box width={1} />

            <Text fg={isSelected ? "#f1f5f9" : "#cbd5e1"}>
              {truncate(commit.msg, W - 22)}
            </Text>
          </Box>
        );
      })}
    </Box>
  );
}

// Internal Show shim to break circular dependency
function Show(props: { when: any, children: any }) {
  return props.when ? props.children : null;
}

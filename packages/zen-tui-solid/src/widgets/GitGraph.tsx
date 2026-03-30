import { Box, Text } from "../index.js";
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
  const COLORS = ["#8b5cf6", "#06b6d4", "#10b981", "#f59e0b"]; // Violet, Cyan, Emerald, Amber
  const W = props.width || 60;

  return (
    <Box flexDirection="column" gap={0} bg="#020617">
      {props.commits.map((commit, idx) => {
        const lane = commit.track ?? 0;
        const isSelected = props.focused && idx === (props.selectedIdx ?? 0);

        // Professional Multi-Lane Engine (Mockup Accurate)
        const lanes = [0, 1, 2]; // 3-lane density for Keynote
        
        return (
          <Box 
            flexDirection="row" 
            bg={isSelected ? "#1e293b" : undefined}
            padding={{ left: 1, right: 1 }}
          >
            {/* Lane Cluster: Curved Visualization */}
            <Box width={12} flexDirection="row">
               {lanes.map(l => {
                 const isCommitLane = l === lane;
                 const isCurved = l > lane; 
                 // Premium Curved Layout Logic
                 let connector = "│ ";
                 if (isCommitLane) {
                   connector = isSelected ? "● " : "○ ";
                 } else if (isCurved) {
                   connector = "╭─";
                 }

                 const laneColor = isCommitLane ? (isSelected ? "#10b981" : COLORS[l % COLORS.length]) : "#1e293b";
                 return <Text fg={laneColor} bold={isCommitLane} value={connector} />;
               })}
               <Show when={commit.isHead}>
                  <Text fg="#10b981" bold={true} value="* " />
               </Show>
            </Box>

            {/* Commit Metadata */}
            <Text fg={isSelected ? "#60a5fa" : "#64748b"}>
              {`${commit.hash.slice(0, 7)}  `}
            </Text>
            
            <Text 
              fg={isSelected ? "#f8fafc" : "#cbd5e1"} 
              bold={isSelected}
            >
              {truncate(commit.msg, W - 25, "...")}
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

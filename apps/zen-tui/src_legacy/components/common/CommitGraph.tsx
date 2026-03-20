import React from "react";
import { Box, Text } from "ink";
import { getTheme, graph } from "../../ui/theme.js";
import { Commit, ThemeName } from "../../types/index.js";

interface CommitGraphProps {
  commits: Commit[];
  height: number;
  themeName: ThemeName;
}

export function CommitGraph({ commits, themeName }: CommitGraphProps) {
  const theme = getTheme(themeName);
  
  // Compact Lane Assignment Logic
  let frontier: string[] = [];
  const rows = commits.map((commit, i) => {
     // 1. Check if this commit's hash is already in the frontier (from a child commit)
     let nodeLane = frontier.indexOf(commit.hash);
     
     if (nodeLane === -1) {
        // This usually means it's the tip of a branch (first commit we see)
        // Try to find an empty slot or push to end
        nodeLane = 0; // Default to first lane for mainline
        if (frontier.length > 0) {
           nodeLane = frontier.length;
        }
        frontier[nodeLane] = commit.hash;
     }

     const currentFrontier = [...frontier];
     
     // 2. Resolve parents for the next row
     // The current commit "evolves" into its primary parent in the SAME lane
     if (commit.parents && commit.parents.length > 0) {
        frontier[nodeLane] = commit.parents[0]!;
        
        // Handle merges: Secondary parents might need new lanes (but only if they are new)
        for (let j = 1; j < commit.parents.length; j++) {
           const p = commit.parents[j]!;
           if (!frontier.includes(p)) {
              frontier.push(p);
           }
        }
     } else {
        // Root commit - clean up the lane
        frontier[nodeLane] = ""; 
     }

     // Clean trailing empty lanes for compactness
     while (frontier.length > 0 && frontier[frontier.length - 1] === "") {
        frontier.pop();
     }

     return { nodeLane, frontier: currentFrontier };
  });

  return (
    <Box flexDirection="column" paddingRight={1}>
      {rows.map((row, i) => (
        <Box key={i} height={1} flexDirection="row">
           {row.frontier.map((hash, j) => {
              if (hash === "" && j < row.nodeLane) return <Text key={j}>  </Text>;
              if (hash === "") return null;

              const isNode = j === row.nodeLane;
              const color = theme.lanes[j % theme.lanes.length]!;
              const char = isNode ? graph.commit : graph.line;
              
              return (
                <Text key={j} color={color}>
                   {char}
                </Text>
              )
           })}
        </Box>
      ))}
    </Box>
  );
}

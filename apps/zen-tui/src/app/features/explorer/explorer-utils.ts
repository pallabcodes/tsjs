import { FileItem } from '@zen-tui/core';

export interface TreeNode {
  name: string;
  isDir?: boolean;
  isOpen?: boolean;
  status?: string;
  indent?: number;
  children: TreeNode[];
}

/**
 * Sovereign Tree Builder
 * Transforms a flat 'git status' list into a recursive structure.
 */
export function buildFileTree(flat: FileItem[]): TreeNode[] {
  const root: TreeNode = { name: 'root', isDir: true, isOpen: true, children: [] };
  
  for (const item of flat) {
    const parts = item.name.split('/');
    let current = root;
    
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLast = i === parts.length - 1;
      let existing = current.children.find(c => c.name === part);
      
      if (!existing) {
        existing = {
          name: part,
          isDir: !isLast,
          isOpen: true, // Default to open for Workspace visibility
          children: [],
          status: isLast ? item.status : undefined,
          indent: i
        };
        current.children.push(existing);
      }
      current = existing;
    }
  }
  
  return root.children;
}

/**
 * Sovereign Flattening Utility
 * Converts the nested tree into a linear array of visible nodes for O(1) index-based j/k navigation.
 */
export function flattenVisibleNodes(nodes: TreeNode[], acc: TreeNode[] = []): TreeNode[] {
  for (const node of nodes) {
    acc.push(node);
    if (node.isDir && node.isOpen) {
      flattenVisibleNodes(node.children, acc);
    }
  }
  return acc;
}

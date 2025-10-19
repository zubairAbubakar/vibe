import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { type TreeItem } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts a record of files to a tree structure.
 * @param files - Record of file paths to their content.
 * @returns Tree structure for TreeView component.
 *
 * @example
 * Input: { "src/Button.tsx": "content", "README.md": "..." }
 * Output: ["src", ["Button.tsx"], "README.md"]
 */
export function convertFilesToTreeItems(files: {
  [path: string]: string;
}): TreeItem[] {
  interface TreeNode {
    [key: string]: TreeNode | null;
  }

  const tree: TreeNode = {};

  const sortedPaths = Object.keys(files).sort();

  for (const path of sortedPaths) {
    const parts = path.split('/');
    let currentNode = tree;

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      if (!currentNode[part]) {
        currentNode[part] = {};
      }
      currentNode = currentNode[part];
    }

    const fileName = parts[parts.length - 1];
    currentNode[fileName] = null;
  }

  function convertNode(
    node: TreeNode,
    nodeName?: string
  ): TreeItem[] | TreeItem {
    const entries = Object.entries(node);
    if (entries.length === 0) return nodeName || '';

    const children: TreeItem[] = [];

    for (const [key, value] of entries) {
      if (value === null) {
        // It's a file
        children.push(key);
      } else {
        // It's a directory
        const subTree = convertNode(value, key);
        if (Array.isArray(subTree)) {
          children.push([key, ...subTree]);
        } else {
          children.push([key, subTree]);
        }
      }
    }

    return children;
  }

  const result = convertNode(tree);
  return Array.isArray(result) ? result : [result];
}

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { TreeItem } from '@/types';

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

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (!currentNode[part]) {
        currentNode[part] = i === parts.length - 1 ? null : {};
      }
      if (currentNode[part] !== null) {
        currentNode = currentNode[part] as TreeNode;
      }
    }
  }

  function buildTreeItems(node: TreeNode): TreeItem[] {
    return Object.entries(node).map(([key, value]) =>
      value === null ? key : [key, ...buildTreeItems(value)]
    );
  }

  return buildTreeItems(tree);
}

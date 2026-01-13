import { Tree } from '@lezer/common';

/** Convert a lezer syntax tree to a formatted string for printing */
export function treeToString(tree: Tree): string {
	const cursor = tree.cursor();
	const lines: string[] = [];

	function recurse(prefix: string) {
		const hasNext = cursor.node.nextSibling != null;
		lines.push(
			prefix + (hasNext ? '├─ ' : '└─ ') + (cursor.type.name || '(anonymous)') + ` [${cursor.from}-${cursor.to}]`,
		);

		prefix += hasNext ? '│  ' : '   ';

		if (cursor.firstChild()) {
			do {
				recurse(prefix);
			} while (cursor.nextSibling());
			cursor.parent();
		}
	}

	recurse('');
	return lines.join('\n');
}

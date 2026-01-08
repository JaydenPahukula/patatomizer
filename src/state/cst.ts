import type { Tree as Tree } from '@lezer/common';
import { State } from 'src/state/state';

/** Global state for the pattern concrete syntax tree */
export const cstState = new State<Tree | null>(null);

// debug
cstState.subscribe((tree) => {
	if (tree === null) return;
	const cursor = tree.cursor();
	const lines: string[] = [];

	function recurse(prefix: string = '') {
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

	recurse();
	// console.clear();
	console.log(lines.join('\n'));
});

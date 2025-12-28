import type { Tree as Tree } from '@lezer/common';
import type { Handler } from 'src/types/handler';

/** Global state for the pattern concrete syntax tree */
export const cstState = new (class {
	#tree: Tree | null = null;
	#handlers = new Set<Handler<Tree>>();

	set(tree: Tree | null) {
		if (tree === this.#tree) return;

		this.#tree = tree;

		if (tree !== null) {
			for (const fn of this.#handlers) fn(tree);
		}
	}

	subscribe(handler: Handler<Tree>) {
		this.#handlers.add(handler);
	}
})();

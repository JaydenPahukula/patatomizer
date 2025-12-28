import type { SyntaxNode } from '@lezer/common';
import type { Handler } from 'src/types/handler';

/** State representing the node in the syntax tree that is currently hovered */
export const outlinedNodeState = new (class {
	#node: SyntaxNode | null = null;
	#handlers = new Set<Handler<SyntaxNode | null>>();

	set(node: SyntaxNode | null) {
		if (node === this.#node) return;

		this.#node = node;
		for (const fn of this.#handlers) fn(node);
	}

	subscribe(handler: Handler<SyntaxNode | null>) {
		this.#handlers.add(handler);
	}
})();

// for testing
outlinedNodeState.subscribe((node) => {
	console.log(node?.name);
});

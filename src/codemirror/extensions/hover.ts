import { syntaxTree } from '@codemirror/language';
import { type Extension } from '@codemirror/state';
import { EditorView, ViewPlugin } from '@codemirror/view';
import type { Tree } from '@lezer/common';
import { setScopeOutlineRangeEffect } from 'src/codemirror/extensions/scopeoutline';
import { Alternation, Escdoublequote, Patcode, Repcount, Strlit } from 'src/codemirror/parser.terms';

// only certain nodes should be highlighted when hovered
function isTerminal(nodeType: number) {
	return (
		nodeType === Repcount ||
		nodeType === Patcode ||
		nodeType === Strlit ||
		nodeType === Escdoublequote ||
		nodeType === Alternation
	);
}

// Find the range of the innermost terminal node
function findNodeRange(tree: Tree, pos: number): { from: number; to: number } | null {
	let node = tree.resolve(pos, 1);
	while (!isTerminal(node.type.id)) {
		if (node.parent === null) return null;
		node = node.parent;
	}
	return node;
}

/** Codemirror extension that handles hovering over the pattern editor */
export const hoverExtension: Extension = ViewPlugin.fromClass(
	class {
		lastPos: number | null = null;

		clear(event: MouseEvent, view: EditorView) {
			if (this.lastPos === null) return;
			// clear
			this.lastPos = null;
			view.dispatch({
				effects: setScopeOutlineRangeEffect.of(null),
			});
		}

		handleMouseMove(event: MouseEvent, view: EditorView) {
			// mouse must be over the pattern
			const element = document.elementFromPoint(event.clientX, event.clientY);
			if (element === null || !element.classList.contains('syntax-token')) {
				this.clear(event, view);
				return;
			}

			// get hover position
			const posAndAssoc = view.posAndSideAtCoords({ x: event.clientX, y: event.clientY });
			if (posAndAssoc === null) return;
			let { pos, assoc } = posAndAssoc;
			if (assoc === -1) pos--;

			if (pos === this.lastPos) return;
			this.lastPos = pos;

			// set scope outline
			const tree = syntaxTree(view.state);
			const range = findNodeRange(tree, pos);
			view.dispatch({
				effects: setScopeOutlineRangeEffect.of(range),
			});
		}
	},
	{
		eventHandlers: {
			mousemove(event, view) {
				this.handleMouseMove(event, view);
			},
			mouseleave(event, view) {
				this.clear(event, view);
			},
		},
	},
);

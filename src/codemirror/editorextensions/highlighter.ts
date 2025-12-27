import { syntaxTree } from '@codemirror/language';
import { EditorState, StateEffect, StateField, type Extension } from '@codemirror/state';
import { Decoration, type DecorationSet, EditorView, ViewPlugin } from '@codemirror/view';
import { Alternation } from 'src/codemirror/parser.terms';

const highlightDecoration = Decoration.mark({
	class: 'cm-range-highlight',
});

function findParenRange(state: EditorState, pos: number): { from: number; to: number } | null {
	let result: { from: number; to: number } | null = null;
	syntaxTree(state).iterate({
		from: pos,
		to: pos,
		enter(node) {
			// Adjust this name to match your grammar
			if (node.type.id === Alternation) {
				result = {
					from: node.from,
					to: node.to,
				};
				return false; // stop at the smallest enclosing one
			}
		},
	});
	return result;
}

const parenHoverPlugin = ViewPlugin.fromClass(
	class {
		view: EditorView;
		lastPos: number | null = null;
		decorations: DecorationSet = Decoration.none;

		constructor(view: EditorView) {
			this.view = view;
		}

		clear() {
			if (this.lastPos !== null) {
				this.lastPos = null;
				this._setHighlightRange(null);
			}
		}

		handleMouseMove(event: MouseEvent) {
			const pos = this.view.posAtCoords({
				x: event.clientX,
				y: event.clientY,
			});

			if (pos == null || pos === this.lastPos) return;

			this.lastPos = pos;
			const range = findParenRange(this.view.state, pos);
			this._setHighlightRange(range);
		}

		_setHighlightRange(range: { from: number; to: number } | null) {
			console.log(range);
			this.decorations =
				range === null
					? Decoration.none
					: (this.decorations = Decoration.set([highlightDecoration.range(range.from, range.to)]));
		}
	},
	{
		eventHandlers: {
			mousemove(event, view) {
				this.handleMouseMove(event);
			},
			mouseleave(event, view) {
				this.clear();
			},
		},
		decorations: (v) => v.decorations,
	},
);

export const highlighterExtension = [parenHoverPlugin];

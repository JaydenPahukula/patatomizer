import { StateEffect, StateField, type Extension } from '@codemirror/state';
import { Decoration, EditorView, type DecorationSet } from '@codemirror/view';
import type { SyntaxNode } from '@lezer/common';

export const setNodeOutlineEffect = StateEffect.define<SyntaxNode | null>();

const scopeOutlineDecoration = Decoration.mark({
	class: 'syntax-node-outline',
});

/** Codemirror extension that handles node outlines in the editor */
export const nodeOutlineExtension: Extension = StateField.define<DecorationSet>({
	create() {
		return Decoration.none;
	},

	update(decorations, tr) {
		if (tr.docChanged) decorations = Decoration.none;

		for (const effect of tr.effects) {
			if (effect.is(setNodeOutlineEffect)) {
				const node = effect.value;
				if (node === null) {
					decorations = Decoration.none;
				} else {
					decorations = Decoration.set([scopeOutlineDecoration.range(node.from, node.to)]);
				}
			}
		}
		return decorations;
	},

	provide: (f) => EditorView.decorations.from(f),
});

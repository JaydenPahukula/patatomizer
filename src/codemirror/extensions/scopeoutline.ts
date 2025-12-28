import { StateEffect, StateField, type Extension } from '@codemirror/state';
import { Decoration, EditorView, type DecorationSet } from '@codemirror/view';

export const setScopeOutlineRangeEffect = StateEffect.define<{ from: number; to: number } | null>();

const scopeOutlineDecoration = Decoration.mark({
	class: 'syntax-scope-outline',
});

/** Codemirror extension that handles scope outline in the editor */
export const scopeOutlineExtension: Extension = StateField.define<DecorationSet>({
	create() {
		return Decoration.none;
	},

	update(decorations, tr) {
		if (tr.docChanged) decorations = Decoration.none;

		for (const effect of tr.effects) {
			if (effect.is(setScopeOutlineRangeEffect)) {
				const range = effect.value;
				decorations =
					range === null ? Decoration.none : Decoration.set([scopeOutlineDecoration.range(range.from, range.to)]);
			}
		}
		return decorations;
	},

	provide: (f) => EditorView.decorations.from(f),
});

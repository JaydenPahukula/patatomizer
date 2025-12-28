import { WidgetType } from '@codemirror/view';
import { Decoration, ViewPlugin } from '@codemirror/view';
import { type Extension } from '@codemirror/state';

class CheckboxWidget extends WidgetType {
	toDOM() {
		const span = document.createElement('span');
		span.textContent = '?';
		span.className = 'question-mark-decoration';
		span.setAttribute('aria-hidden', 'true');
		return span;
	}
}

/** Codemirror extensions that displays a non-interactable question mark at the beginning of the editor */
export const questionMarkExtension: Extension = ViewPlugin.fromClass(
	class {
		decorations = Decoration.set([
			Decoration.widget({
				widget: new CheckboxWidget(),
				side: -1,
			}).range(0),
		]);
	},
	{
		decorations: (v) => v.decorations,
	},
);

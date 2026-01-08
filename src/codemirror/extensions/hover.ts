import { syntaxTree } from '@codemirror/language';
import { type Extension } from '@codemirror/state';
import { EditorView, ViewPlugin } from '@codemirror/view';
import { outlinedNodeState } from 'src/state/outlinednode';
import { tooltipShownState } from 'src/state/tooltipshown';

/** Codemirror extension that handles hovering over the pattern editor */
export const hoverExtension: Extension = ViewPlugin.fromClass(
	class {
		lastPos: number | null = null;

		clear(event: MouseEvent, view: EditorView) {
			if (this.lastPos === null) return;
			// clear
			this.lastPos = null;
			outlinedNodeState.set(null);
		}

		handleMouseMove(event: MouseEvent, view: EditorView) {
			// mouse must be over the pattern
			const element = document.elementFromPoint(event.clientX, event.clientY);
			if (element === null || !element.classList.contains('syntax-token')) {
				this.clear(event, view);
				tooltipShownState.set(false);
				return;
			}
			tooltipShownState.set(true);

			// get hover position
			const posAndAssoc = view.posAndSideAtCoords({ x: event.clientX, y: event.clientY });
			if (posAndAssoc === null) return;
			let { pos, assoc } = posAndAssoc;
			if (assoc === -1) pos--;

			if (pos === this.lastPos) return;
			this.lastPos = pos;

			// set scope outline
			const node = syntaxTree(view.state).resolve(pos, 1);
			outlinedNodeState.set(node);
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

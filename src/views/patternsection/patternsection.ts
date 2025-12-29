import { EditorView } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { languageExtension } from 'src/codemirror/extensions/language';
import { questionMarkExtension } from 'src/codemirror/extensions/questionmark';
import { minimalSetup } from 'codemirror';
import { oneLineExtension } from 'src/codemirror/extensions/oneline';
import { cstUpdatesExtension } from 'src/codemirror/extensions/cstupdates';
import { hoverExtension } from 'src/codemirror/extensions/hover';
import { nodeOutlineExtension, setNodeOutlineEffect } from 'src/codemirror/extensions/nodeoutline';
import { outlinedNodeState } from 'src/state/outlinednode';
import { doWithElement, doWithElements } from 'src/util/dowithelement';
import { tooltipShownState } from 'src/state/tooltipshown';
import type { SyntaxNode } from '@lezer/common';

const parentElement = document.getElementById('pattern-editor-parent');
if (parentElement === null) console.error("Could not find element with id 'pattern-editor'");

export const patternEditorView = new EditorView({
	state: EditorState.create({
		extensions: [
			minimalSetup,
			hoverExtension,
			languageExtension,
			oneLineExtension,
			questionMarkExtension,
			nodeOutlineExtension,
			cstUpdatesExtension,
		],
		doc: '1ACL1."as""df".3(1"a",2"b")',
	}),
	parent: parentElement ?? document.body,
});

// update node outline
outlinedNodeState.subscribe((node) => {
	patternEditorView.dispatch({
		effects: setNodeOutlineEffect.of(node),
	});
});

// tooltip stuff
doWithElements(
	{ tooltip: 'pattern-editor-tooltip', tooltipText: 'pattern-editor-tooltip-text' },
	({ tooltip, tooltipText }) => {
		outlinedNodeState.subscribe((node) => {
			if (node && tooltipShownState.get()) {
				updateTooltip(node);
			}
		});

		tooltipShownState.subscribe((shown) => {
			if (shown) {
				const node = outlinedNodeState.get();
				if (node) {
					updateTooltip(node);
				}
			} else {
				hideTooltip();
			}
		});

		function updateTooltip(node: SyntaxNode) {
			tooltip.removeAttribute('hidden');

			// update text
			tooltipText.innerHTML = getTextFromNode(node);

			// move tooltip
			const fromRect = patternEditorView.coordsAtPos(node.from);
			if (fromRect === null) return;
			const toRect = patternEditorView.coordsAtPos(node.to);
			if (toRect === null) return;

			const tooltipWidth = tooltip.getBoundingClientRect().width;
			const top = fromRect.bottom + 12;
			const left = (fromRect.left + toRect.right) / 2 - tooltipWidth / 2;

			tooltip.style.top = `${top}px`;
			tooltip.style.left = `${left}px`;
		}

		function hideTooltip() {
			tooltip.setAttribute('hidden', '');
		}
	},
);

function getTextFromNode(node: SyntaxNode) {
	return node.name;
}

import { forEachDiagnostic } from '@codemirror/lint';
import { EditorState } from '@codemirror/state';
import { EditorView } from '@codemirror/view';
import type { SyntaxNode } from '@lezer/common';
import { minimalSetup } from 'codemirror';
import { cstUpdatesExtension } from 'src/codemirror/extensions/cstupdates';
import { hoverExtension } from 'src/codemirror/extensions/hover';
import { languageExtension } from 'src/codemirror/extensions/language';
import { lintExtension } from 'src/codemirror/extensions/lint';
import { nodeOutlineExtension, setNodeOutlineEffect } from 'src/codemirror/extensions/nodeoutline';
import { oneLineExtension } from 'src/codemirror/extensions/oneline';
import { questionMarkExtension } from 'src/codemirror/extensions/questionmark';
import { cstState } from 'src/state/cst';
import { outlinedNodeState } from 'src/state/outlinednode';
import { syntaxErrorState } from 'src/state/syntaxerror';
import { tooltipShownState } from 'src/state/tooltipshown';
import { doWithElement, doWithElements } from 'src/util/dowithelement';

const parentElement = document.getElementById('pattern-editor-parent');
if (parentElement === null) console.error("Could not find element with id 'pattern-editor'");

export const patternEditorView = new EditorView({
	state: EditorState.create({
		extensions: [
			minimalSetup,
			hoverExtension,
			languageExtension,
			lintExtension,
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

// hide tooltip when cst updates
cstState.subscribe(() => {
	tooltipShownState.set(false);
});

doWithElement('pattern-editor-error', (errorElement) => {
	// update error notification
	syntaxErrorState.subscribe((error) => {
		if (error) {
			errorElement.removeAttribute('hidden');
		} else {
			errorElement.setAttribute('hidden', '');
		}
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
			tooltipText.innerHTML = getTooltipInnerHTML(node);

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

function getTooltipInnerHTML(node: SyntaxNode) {
	// check if error
	if (syntaxErrorState.get()) {
		let errorHTML = '';
		forEachDiagnostic(patternEditorView.state, (d, from, to) => {
			if (errorHTML) return;
			if (node.to === to && node.from === from) {
				errorHTML = '<b class="error">ERROR:</b> ' + d.message;
			}
		});
		if (errorHTML) return errorHTML;
	}

	return node.name;
}

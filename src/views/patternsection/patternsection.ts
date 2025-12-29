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

outlinedNodeState.subscribe((node) => {
	patternEditorView.dispatch({
		effects: setNodeOutlineEffect.of(node),
	});
});

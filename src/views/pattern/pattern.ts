import { EditorView } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { languageExtension } from 'src/codemirror/extensions/language';
import { questionMarkExtension } from 'src/codemirror/extensions/questionmark';
import { minimalSetup } from 'codemirror';
import { oneLineExtension } from 'src/codemirror/extensions/oneline';
import { syntaxTreeUpdatesExtension } from 'src/codemirror/extensions/syntaxtreeupdates';
import { hoverExtension } from 'src/codemirror/extensions/hover';
import { scopeOutlineExtension } from 'src/codemirror/extensions/scopeoutline';

const parentElement = document.getElementById('pattern-editor-parent');
if (parentElement === null) throw new Error("Could not find element with id 'pattern-editor'");

export const patternEditorView = new EditorView({
	state: EditorState.create({
		extensions: [
			minimalSetup,
			hoverExtension,
			languageExtension,
			oneLineExtension,
			questionMarkExtension,
			scopeOutlineExtension,
			syntaxTreeUpdatesExtension,
		],
		doc: '1ACL1."as""df".3(1"a",2"b")',
	}),
	parent: parentElement,
});

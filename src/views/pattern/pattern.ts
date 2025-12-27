import { EditorView } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { languageExtension } from 'src/codemirror/editorextensions/language';
import { questionMarkExtension } from 'src/codemirror/editorextensions/questionmark';
import { minimalSetup } from 'codemirror';
import { oneLineExtension } from 'src/codemirror/editorextensions/oneline';
import { highlighterExtension } from 'src/codemirror/editorextensions/highlighter';
import { idk } from 'src/codemirror/editorextensions/idk';

const parentElement = document.getElementById('pattern-editor-parent');
if (parentElement === null) throw new Error("Could not find element with id 'pattern-editor'");

const view = new EditorView({
	state: EditorState.create({
		extensions: [minimalSetup, languageExtension, questionMarkExtension, oneLineExtension, highlighterExtension, idk],
		doc: '1ACL1."as""df".3(1"a",2"b")',
	}),
	parent: parentElement,
});

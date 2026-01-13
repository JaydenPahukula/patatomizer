import { syntaxTree } from '@codemirror/language';
import { type Extension } from '@codemirror/state';
import { EditorView } from 'codemirror';
import { cstState } from 'src/state/cst';

/** Codemirror extension that updates CST state when the document is changed */
export const cstUpdatesExtension: Extension = EditorView.updateListener.of((update) => {
	if (!update.docChanged) return;

	const tree = syntaxTree(update.state);
	cstState.set(tree);
});

import { type Extension } from '@codemirror/state';
import { syntaxTree } from '@codemirror/language';
import { ViewPlugin } from '@codemirror/view';
import { EditorView } from 'codemirror';

export const idk: Extension = EditorView.updateListener.of((update) => {
	if (!update.docChanged) return;

	const tree = syntaxTree(update.state);

	// tree.iterate({
	// 	enter(node) {
	// 		console.log(node.name, node.type, node.from, node.to);
	// 	},
	// });
});

const asdf = ViewPlugin;

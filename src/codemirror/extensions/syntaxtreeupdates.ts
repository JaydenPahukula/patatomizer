import { type Extension } from '@codemirror/state';
import { syntaxTree } from '@codemirror/language';
import { type Tree } from '@lezer/common';
import { EditorView } from 'codemirror';

const handlers: ((tree: Tree) => void)[] = [];

/** Codemirror extension that calls listeners when the syntax tree is updated */
export const syntaxTreeUpdatesExtension: Extension = EditorView.updateListener.of((update) => {
	if (!update.docChanged) return;

	const tree = syntaxTree(update.state);
	for (const fn of handlers) fn(tree);
});

/** Provide a function that will be called whenever the syntax tree is updated. */
export function subscribeToSyntaxTreeUpdates(fn: (tree: Tree) => void) {
	handlers.push(fn);
}

// subscribeToSyntaxTreeUpdates((tree) => {
// 	tree.iterate({ enter: (node) => console.log(node.name) });
// });

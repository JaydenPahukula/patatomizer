import { syntaxTree } from '@codemirror/language';
import { linter, type Diagnostic } from '@codemirror/lint';
import type { Extension } from '@codemirror/state';
import type { SyntaxNodeRef, TreeCursor } from '@lezer/common';
import { Alternation, Patatom } from 'src/codemirror/parser.terms';
import { syntaxErrorState } from 'src/state/syntaxerror';

export const lintExtension: Extension = linter(
	(view) => {
		let hasError = false;
		const problems: Diagnostic[] = [];

		function addProblem(node: SyntaxNodeRef, msg: string) {
			problems.push({ from: node.from, to: node.to, severity: 'error', message: msg });
		}

		console.log('start ------------------------');
		syntaxTree(view.state).iterate({
			enter(node) {
				console.log(node.name, node.from, node.to);
				if (node.type.isError) hasError = true;
				// if (node.type.isError) {
				// 	if (node.from === node.to) {
				// 		const parent = node.node.parent;
				// 		if (parent === null) {
				// 			addProblem(node, 'uh...');
				// 		} else if (parent.type.id === Alternation) {
				// 			addProblem(parent, 'Unmatched opening parenthesis.');
				// 		}
				// 	} else {
				// 		const str = view.state.doc.slice(node.from, node.to).toString();
				// 		if (str === '(') {
				// 			addProblem(node, 'Unmatched opening parenthesis.');
				// 		} else if (str === ')') {
				// 			addProblem(node, 'Unmatched closing parenthesis.');
				// 		} else {
				// 			addProblem(node, `Unexpected character${node.from + 1 === node.to ? '' : 's'}.`);
				// 		}
				// 	}
				// } else if (node.type.id === Alternation) {
				// 	// empty alternation
				// 	if (node.from + 2 === node.to) {
				// 		addProblem(node, 'Alternation cannot be empty.');
				// 	}
				// }
			},
		});
		syntaxErrorState.set(hasError);
		return problems;
	},
	{ delay: 0, tooltipFilter: () => [] },
);

function lint(problems: Diagnostic[], current: TreeCursor) {
	// current.
}

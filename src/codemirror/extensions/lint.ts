import { syntaxTree } from '@codemirror/language';
import { linter, type Diagnostic } from '@codemirror/lint';
import type { Extension } from '@codemirror/state';
import type { SyntaxNodeRef, TreeCursor } from '@lezer/common';
import { Alternation, CloseParen, Escquote, OpenParen, Patatom, Repcount, Strlit } from 'src/codemirror/parser.terms';
import { syntaxErrorState } from 'src/state/syntaxerror';

export const lintExtension: Extension = linter(
	(view) => {
		const problems: Diagnostic[] = [];

		function addProblem(node: SyntaxNodeRef, msg: string) {
			problems.push({ from: node.from, to: node.to, severity: 'error', message: msg });
		}

		// console.log('start ------------------------');
		syntaxTree(view.state).iterate({
			enter(node) {
				// console.log(node.name, node.from, node.to);
				if (node.type.isError) {
					if (node.from === node.to) {
						const parent = node.node.parent;
						if (parent === null) {
							console.error(1);
							// addProblem(node, 'uh...');
						}
					} else {
						const str = view.state.doc.slice(node.from, node.to).toString();
						if (str === '(') {
							addProblem(node, 'Unmatched opening parenthesis.');
						} else if (str === ')') {
							addProblem(node, 'Unmatched closing parenthesis.');
						} else {
							addProblem(node, `Unexpected character${node.from + 1 === node.to ? '' : 's'}.`);
						}
					}
				} else if (node.type.id === Alternation) {
					if (node.node.firstChild?.type.id !== OpenParen) {
						console.error('Alternation missing open paren');
					} else if (node.node.lastChild?.type.id !== CloseParen) {
						addProblem(node.node.firstChild, 'Unmatched opening parenthesis.');
					} else if (node.from + 2 === node.to) {
						addProblem(node, 'Alternation cannot be empty.');
					}
				} else if (node.type.id === Strlit) {
					const lastChild = node.node.lastChild;
					if (lastChild?.type.isError && lastChild.from === lastChild.to) {
						addProblem(node, 'String literal is missing closing quotation mark.');
					}
				} else if (node.type.id === Patatom) {
					if (node.node.firstChild?.type.id !== Repcount) {
						addProblem(node, 'Expected a ');
					}
				} else if (node.type.id === Escquote) {
					if (node.to !== node.from + 2) {
						addProblem(node, 'Quotation mark needs to be escaped.');
					}
				}
			},
		});
		syntaxErrorState.set(problems.length > 0);
		console.log(`${problems.length} errors`);
		return problems;
	},
	{ delay: 0, tooltipFilter: () => [] },
);

function lint(problems: Diagnostic[], current: TreeCursor) {
	// current.
}

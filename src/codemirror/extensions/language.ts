import { HighlightStyle, LanguageSupport, LRLanguage, syntaxHighlighting, syntaxTree } from '@codemirror/language';
import { linter } from '@codemirror/lint';
import { type Extension } from '@codemirror/state';
import { styleTags, tags } from '@lezer/highlight';
import { parser } from 'src/codemirror/parser';

const lrLanguage = LRLanguage.define({
	parser: parser.configure({
		props: [
			styleTags({
				Strlit: tags.string,
				Escquote: tags.escape,
				Repcount: tags.number,
				Patcode: tags.keyword,
				Alternation: tags.paren,
				// '⚠': tags.invalid,
			}),
		],
	}),
});

const language = new LanguageSupport(lrLanguage);

const highlighting = syntaxHighlighting(
	HighlightStyle.define([
		{ tag: tags.string, class: 'syntax-token syntax-string' },
		{ tag: tags.escape, class: 'syntax-token syntax-escape' },
		{ tag: tags.number, class: 'syntax-token syntax-number' },
		{ tag: tags.keyword, class: 'syntax-token' },
		{ tag: tags.paren, class: 'syntax-token' },
		// { tag: tags.invalid, class: 'syntax-token syntax-invalid' },
	]),
);

const linting = linter(
	(view) => {
		syntaxTree(view.state).iterate({
			enter(node) {
				// if (node.node.type.isError)
				console.log(node.node.name, node.from, node.to);
			},
		});
		return [
			{
				from: 0,
				to: 5,
				severity: 'error',
				message: 'Error message',
			},
		];
	},
	{ delay: 0, tooltipFilter: () => [] },
);

/** Codemirror extension that handles language parsing and syntax highlighting */
export const languageExtension: Extension = [language, highlighting, linting];

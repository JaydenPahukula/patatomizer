import { HighlightStyle, LanguageSupport, LRLanguage, syntaxHighlighting, syntaxTree } from '@codemirror/language';
import { linter, type Diagnostic } from '@codemirror/lint';
import { type Extension } from '@codemirror/state';
import type { SyntaxNode, SyntaxNodeRef, TreeCursor } from '@lezer/common';
import { styleTags, tags } from '@lezer/highlight';
import { parser } from 'src/codemirror/parser';
import { Alternation, Patatom } from 'src/codemirror/parser.terms';
import { cstState } from 'src/state/cst';
import { syntaxErrorState } from 'src/state/syntaxerror';

const lrLanguage = LRLanguage.define({
	parser: parser.configure({
		props: [
			styleTags({
				Strlit: tags.string,
				Escquote: tags.escape,
				Repcount: tags.number,
				Patcode: tags.keyword,
				Patcodechar: tags.keyword,
				Invalidpatcodechar: tags.keyword,
				Alternation: tags.paren,
				'⚠': tags.invalid,
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
		{ tag: tags.invalid, class: 'syntax-token syntax-invalid' },
	]),
);

/** Codemirror extension that handles language parsing and syntax highlighting */
export const languageExtension: Extension = [language, highlighting];

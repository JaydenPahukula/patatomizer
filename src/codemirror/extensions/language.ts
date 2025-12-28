import { HighlightStyle, LanguageSupport, LRLanguage, syntaxHighlighting } from '@codemirror/language';
import { type Extension } from '@codemirror/state';
import { styleTags, tags } from '@lezer/highlight';
import { parser } from 'src/codemirror/parser';

const lrLanguage = LRLanguage.define({
	parser: parser.configure({
		props: [
			styleTags({
				Strlit: tags.string,
				Escdoublequote: tags.escape,
				Repcount: tags.number,
				Number: tags.number,
				Patcode: tags.keyword,
				Alternation: tags.paren,
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
	]),
);

/** Codemirror extension that handles language parsing and syntax highlighting */
export const languageExtension: Extension = [language, highlighting];

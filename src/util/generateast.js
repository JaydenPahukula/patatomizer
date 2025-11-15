/**
 * @typedef {'patgroup' | 'patatom' | 'repcount' | 'patcode' | 'patcodebad' | 'patcodegroup' | 'strlit' | 'alternation' | 'doublequote' | 'none'} ASTNodeType
 *
 * @typedef {object} ASTNode
 * @property {ASTNodeType} type
 * @property {number} id
 * @property {number} pos
 * @property {number} len
 * @property {string} str
 * @property {string} title
 * @property {string} description
 * @property {ASTNode[]} children
 * @property {boolean} error
 */

/**
 * @param {string} pattern
 * @returns {ASTNode}
 */
export function generateAST(pattern) {
	const p = new ParseHelper(pattern);
	return parseGroup(p);
}

/**
 * @param {ParseHelper} p
 * @param {string[]} stopChars
 * @returns {ASTNode}
 */
function parseGroup(p, stopChars = []) {
	const startIndex = p.index;
	const nodes = [];
	// stop reading atoms if any char in stopChars is encountered
	while (!p.isDone() && !stopChars.includes(p.currChar())) {
		nodes.push(parseTerminal(p));
		atoms.push(parseAtom(p));
	}
	return p.makeNode('patgroup', [atoms], startIndex, 'Pattern', 'Must match all of the following atoms:');
}

/**
 * @param {ParseHelper} p
 * @returns {ASTNode}
 */
function parseTerminal(p) {}

// /**
//  * @param {ParseHelper} p
//  * @returns {ASTNode}
//  */
// function parseAtom(p) {
// 	const startIndex = p.index;
// 	const count = parseCount(p);
// 	const element = parseElement(p);
// 	if (count === null && element === null) return null;
// 	if (count === null)
// 		return p.makeNode('patatom', [element], startIndex, 'Pattern Atom', 'Missing repetition count!', true);
// 	if (element === null)
// 		return p.makeNode('patatom', [count], startIndex, 'Pattern Atom', 'Missing pattern element!', true);
// 	return p.makeNode('patatom', [count, element], startIndex, 'Pattern Atom', '');
// }

// /**
//  * @param {ParseHelper} p
//  * @returns {ASTNode}
//  */
// function parseCount(p) {
// 	const startIndex = p.index;
// 	const digits1 = [];
// 	let description;
// 	let error = false;
// 	for (; isDigit(p.currChar()); p.increment()) {
// 		digits1.push(p.currChar());
// 	}
// 	if (p.currChar() === '.') {
// 		p.increment();
// 		const digits2 = [];
// 		for (; isDigit(p.currChar()); p.increment()) {
// 			digits2.push(p.currChar());
// 		}
// 		const x1 = digits1.join('');
// 		const x2 = digits2.join('');
// 		if (x1 && x2) {
// 			if (parseInt(x1) > parseInt(x2)) {
// 				error = true;
// 				description = 'The upper bound must be greater than the lower bound.';
// 			} else description = `Match any amount between ${x1} and ${x2}.`;
// 		} else if (x1 && !x2) description = `Match at least ${x1} occurrences.`;
// 		else if (!x1 && x2) description = `Match at most ${x2} occurrences.`;
// 		else description = 'Match any amount.';
// 	} else {
// 		if (digits1.length === 0) return null;
// 		description = `Match exactly ${digits1.join('')} occurrences.`;
// 	}

// 	return p.makeNode('repcount', [], startIndex, 'Repeat Count', description, error);
// }

// /**
//  * @param {ParseHelper} p
//  * @returns {ASTNode}
//  */
// function parseElement(p) {
// 	const startIndex = p.index;
// 	switch (p.currChar()) {
// 		case '"':
// 			// string literal
// 			p.increment();
// 			for (;;) {
// 				console.log('asdf', p.currChar(), p.isDone());
// 				if (p.isDone()) {
// 					p.index = startIndex + 1;
// 					return p.makeNode('none', [], startIndex, '', "Unmatched '\"'", true);
// 				}
// 				if (p.currChar() === '"') {
// 					p.increment();
// 					if (p.currChar() !== '"') break;
// 					p.increment();
// 					console.log('double');
// 				} else {
// 					p.increment();
// 				}
// 			}
// 			const str = p.str.slice(startIndex + 1, p.index - 1).replaceAll('""', '"');
// 			return p.makeNode('strlit', [], startIndex, 'String Literal', `Matches exactly \"${str}\"`);
// 		case '(':
// 			// alternation
// 			p.increment();
// 			if (p.currChar() === ')') {
// 				p.increment();
// 				return p.makeNode('alternation', [], startIndex, 'Alternation', 'Alternations cannot be empty', true);
// 			}
// 			const groups = [parseGroup(p, [',', ')'])];
// 			while (1) {
// 				if (p.currChar() === ')') break;
// 				else if (p.currChar() === ',') {
// 					p.increment();
// 					groups.push(parseGroup(p, [',', ')']));
// 				} else if (p.isDone()) {
// 					p.index = startIndex + 1;
// 					return p.makeNode('none', [], startIndex, '', 'Unmatched "("', true);
// 				} else {
// 					throw new Error('uh oh...');
// 				}
// 			}
// 			p.increment();
// 			return p.makeNode('alternation', groups, startIndex, 'Alternation', 'Match any of the patterns in the list.');
// 		default:
// 			// pattern code
// 			const patCodes = [];
// 			for (; !p.isDone(); p.increment()) {
// 				const c = p.currChar().toUpperCase();
// 				if (isDigit(c) || c === '.' || c === '"' || c === '(') break;
// 				p.increment();
// 				const description = patCodeDescription(c);
// 				if (description === null) {
// 					patCodes.push(p.makeNode('patcodebad', [], p.index - 1, 'Pattern Code', 'Invalid pattern code', true));
// 				} else {
// 					patCodes.push(p.makeNode('patcode', [], p.index - 1, 'Pattern Code', description));
// 				}
// 			}
// 			if (patCodes.length === 0) return null;
// 			return p.makeNode(
// 				'patcodegroup',
// 				patCodes,
// 				startIndex,
// 				'Pattern Code',
// 				'Match any of the following pattern codes:',
// 			);
// 	}
// }

class ParseHelper {
	index = 0;
	#id = 0;
	constructor(str) {
		this.str = str;
	}
	currChar() {
		return this.str.at(this.index) ?? '';
	}
	isDone() {
		return this.index >= this.str.length;
	}
	increment() {
		if (!this.isDone()) this.index++;
	}
	/**
	 * @param {ASTNodeType} type
	 * @param {ASTNode[]} children
	 * @param {number} startIndex
	 * @param {string} string
	 * @param {string} title
	 * @param {string} description
	 * @param {boolean} [isError=false]
	 * @returns {ASTNode}
	 */
	makeNode(type, children, startIndex, title, description, isError = false) {
		return {
			type: type,
			id: this.#id++,
			pos: startIndex,
			len: this.index - startIndex,
			str: this.str.slice(startIndex, this.index),
			title: title,
			description: description,
			children: children,
			error: isError,
		};
	}
	getID() {
		return this.#id++;
	}
}

function isDigit(s) {
	return (
		s === '0' ||
		s === '1' ||
		s === '2' ||
		s === '3' ||
		s === '4' ||
		s === '5' ||
		s === '6' ||
		s === '7' ||
		s === '8' ||
		s === '9'
	);
}

function patCodeDescription(s) {
	switch (s) {
		case 'A':
			return 'Matches any alphabetic character (char codes 65 to 90, and 97 to 122)';
		case 'C':
			return 'Matches any control character (char codes 0 to 31, and 127)';
		case 'E':
			return 'Matches any character';
		case 'L':
			return 'Matches any lowercase alphabetic character (char codes 97 to 122)';
		case 'N':
			return 'Matches any numeric character, 0 through 9 (char codes 48 to 57)';
		case 'P':
			return 'Matches any punctuation character (char codes 32 to 47, 58 to 64, 91 to 96, and 123 to 126)';
		case 'U':
			return 'Matches any uppercase alphabetic character (char codes 65-90)';
		default:
			return null;
	}
}

function isPatternCode(s) {
	return s === 'A' || s === 'C' || s === 'E' || s === 'L' || s === 'N' || s === 'P' || s === 'U';
}

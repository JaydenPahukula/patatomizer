import { tokenize } from './tokenize.js';

/**
 * @typedef {'patgroup' | 'patatom' | 'quantity' | 'patcode' | 'badpatcode' | 'patcodegroup' | 'strlit' | 'alternation' | 'doublequote' | 'error'} ASTNodeType
 *
 * @typedef {object} ASTNode
 * @property {ASTNodeType} type
 * @property {number} id
 * @property {number} index
 * @property {number} len
 * @property {(string|ASTNode)[]} children
 * @property {boolean} error
 */

/**
 * @param {string} pattern
 * @returns {ASTNode}
 */
export function generateAST(pattern) {
	const tokens = tokenize(pattern);
	const parser = ASTParser(tokens);
	parsePatGroup(parser, false);
}

/**
 * @param {ASTParser} p
 * @param {bool} expectCommaOrParen
 * @param {ASTNode}
 */
function parsePatGroup(p, expectCommaOrParen) {
	const start = p.startNode();
	const children = [];
	while (!p.isDone()) {
		if (expectCommaOrParen && (p.currToken().type === 'closeparen' || p.currToken().type === 'comma')) break;
		children.push(parsePatAtom());
	}
	return endNode('');
}

/**
 *
 * @param {ASTParser} p
 * @returns {ASTNode}
 */
function parsePatAtom(p) {
	const start = p.startNode();
	const children = [];

	if (p.currToken().type === 'closeparen') {
		p.error = true;
		p.takeToken();
		return p.endNode('error', start);
	}

	if (p.currToken().type === 'quantity') {
		children.push(parseQuantity());
	} else {
		p.error = true;
	}

	switch (p.currToken().type) {
		case 'openparen':
			children.push('(');
			p.takeToken();
	}
}

function parseQuantity(p) {
	const start = p.startNode();
	p.takeToken();
	return p.endNode('quantity', start, []);
}

class ASTParser {
	#tokens;
	#id = 0;
	#index = 0;
	error = false;

	/**
	 * @param {Token[]} tokens
	 */
	constructor(tokens) {
		this.#tokens = tokens;
	}

	isDone() {
		return this.#index >= this.#tokens.length;
	}

	/**
	 * @returns {Token}
	 */
	currToken() {
		return this.#tokens[this.#index];
	}

	takeToken() {
		this.#index++;
	}

	startNode() {
		return this.#index;
	}

	/**
	 * @param {ASTNodeType} type
	 * @param {number} startPos
	 * @param {ASTNode[]} [children=[]]
	 * @returns {ASTNode}
	 */
	endNode(type, startPos, children = []) {
		const startIndex = this.#tokens[startPos].index;
		const endIndex = this.currToken().index; // exclusive
		return {
			type: type,
			id: this.#id++,
			index: startToken.index,
			len: endIndex - startIndex,
			children: children,
		};
	}
}

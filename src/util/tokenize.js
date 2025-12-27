/**
 * @typedef { "quantity" | "patcode" | "openparen" | "closeparen" | "comma" | "strlit" } TokenType
 *
 * @typedef {object} Token
 * @property {TokenType} type
 * @property {string} string
 * @property {number} index
 */

/**
 * @param {string} string
 * @returns {Token[]}
 */
export function tokenize(string) {
	const parser = new TokenParser(string);

	while (!parser.isDone()) {
		const c = parser.currChar();
		if (isNumeric(c) || c === '.') {
			// quantity
			while (isNumeric(parser.currChar())) parser.takeChar();
			if (parser.currChar() === '.') {
				parser.takeChar();
				while (isNumeric(parser.currChar())) parser.takeChar();
			}
			parser.takeToken('quantity');
		} else if (c === '"') {
			// string
			parser.takeChar();
			while (!parser.isDone()) {
				if (parser.currChar() === '"') {
					if (parser.currChar(1) === '"') {
						// double quote
						parser.takeChar();
						parser.takeChar();
					} else {
						parser.takeChar();
						break;
					}
				}
				parser.takeChar();
			}
			parser.takeToken('strlit');
		} else if (c === '(') {
			// open parenthases
			parser.takeChar();
			parser.takeToken('openparen');
		} else if (c === ')') {
			// closed parenthases
			parser.takeChar();
			parser.takeToken('closeparen');
		} else if (c === ',') {
			// closed parenthases
			parser.takeChar();
			parser.takeToken('comma');
		} else {
			// pattern code
			parser.takeChar();
			parser.takeToken('patcode');
		}
	}

	return parser.tokens;
}

class TokenParser {
	#string;
	#index = 0;
	#tokenStartIndex = 0;
	#tokenChars = [];
	tokens = [];

	/**
	 * @param {string} string
	 */
	constructor(string) {
		this.#string = string;
	}

	/**
	 * @returns {boolean}
	 */
	isDone() {
		return this.#index >= this.#string.length;
	}

	/**
	 * @param {number} [offset=0]
	 * @returns {string | undefined}
	 */
	currChar(offset = 0) {
		return this.#string[this.#index + offset];
	}

	/**
	 * @returns {void}
	 */
	takeChar() {
		this.#tokenChars.push(this.currChar());
		this.#index++;
	}

	/**
	 * @param {TokenType} type
	 * @returns {Token}
	 */
	takeToken(type) {
		this.tokens.push({
			type: type,
			index: this.#tokenStartIndex,
			string: this.#tokenChars.join(''),
		});
		this.#tokenChars = [];
		this.#tokenStartIndex = this.#index;
	}
}

function isNumeric(char) {
	return (
		char === '0' ||
		char === '1' ||
		char === '2' ||
		char === '3' ||
		char === '4' ||
		char === '5' ||
		char === '6' ||
		char === '7' ||
		char === '8' ||
		char === '9'
	);
}

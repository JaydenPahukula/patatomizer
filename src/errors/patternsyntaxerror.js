export class PatternSyntaxError extends Error {
	/**
	 * @param {string} message
	 * @param {number} index
	 */
	constructor(message, index) {
		super(`${message} (at index ${index})`);
		this.name = 'PatternSyntaxError';
	}
}

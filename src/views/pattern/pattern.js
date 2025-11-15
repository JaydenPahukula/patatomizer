import { generateAST } from '../../util/generateast';
import { PatternSyntaxError } from '../../errors/patternsyntaxerror';

const input = document.getElementById('pattern-input');

input.addEventListener('input', (e) => {
	const text = input.innerText;
	if (text.length === 0) return;
	const caretPos = getCaretCharOffset(input);
	// input.innerHTML = text; // clear formatting
	// setCaretAfterChar(input, caretPos);
	let ast;
	try {
		ast = generateAST(text);
		console.log(ast);
	} catch (e) {
		if (e instanceof PatternSyntaxError) {
			console.log('invalid syntax');
			return;
		} else throw e;
	}

	// input.innerHTML = '';
	// input.appendChild(render(ast));

	// move cursor back
	// setCaretAfterChar(input, caretPos);
});

function render(astNode) {
	const span = document.createElement('span');

	// switch (astNode.type) {
	// 	case 'patgroup':
	// 		const groupFrag = document.createDocumentFragment();
	// 		astNode.atoms.forEach((atom) => groupFrag.appendChild(render(atom)));
	// 		return groupFrag;
	// 	case 'patatom':
	// 		const atomFrag = document.createDocumentFragment();
	// 		atomFrag.appendChild(render(astNode.count));
	// 		atomFrag.appendChild(render(astNode.element));
	// 		return atomFrag;
	// 	case 'repcount':
	// 		const countSpan = document.createElement('span');
	// 		countSpan.classList.add('ast-node', 'ast-repcount-node');
	// 		countSpan.innerText = astNode.str;
	// 		return countSpan;
	// 	case 'patcodegroup':
	// 		const patcodeSpan = document.createElement('span');
	// 		patcodeSpan.classList.add('ast-node', 'ast-patcode-node');
	// 		patcodeSpan.innerText = astNode.str;
	// 		return patcodeSpan;
	// 	case 'strlit':
	// 		const strlistSpan = document.createElement('span');
	// 		strlistSpan.classList.add('ast-node', 'ast-strlit-node');
	// 		strlistSpan.innerText = astNode.str;
	// 		return strlistSpan;
	// 	case 'alternation':
	// 		const alternationSpan = document.createElement('span');
	// 		alternationSpan.classList.add('ast-node', 'ast-alternation-node');
	// 		alternationSpan.append('(');
	// 		astNode.patterns.forEach((pat, i) => {
	// 			if (i !== 0) alternationSpan.append(',');
	// 			alternationSpan.appendChild(render(pat));
	// 		});
	// 		alternationSpan.append(')');
	// 		return alternationSpan;
	// 	default:
	// 		return null;
	// }
}

// ---------- misc dom stuff ----------

document.getElementById('pattern-editor').addEventListener('click', () => {
	input.focus();
});

/**
 * Get caret position (character index from start) inside a contenteditable.
 * @param {HTMLElement} root - The contenteditable element
 * @returns {number} - Character index
 */
function getCaretCharOffset(root) {
	let sel = window.getSelection();
	if (!sel.rangeCount) return 0;
	let range = sel.getRangeAt(0);

	let charCount = 0;
	let found = false;

	function recurse(node) {
		if (found) return;

		if (node.nodeType === Node.TEXT_NODE) {
			if (node === range.startContainer) {
				charCount += range.startOffset;
				found = true;
				return;
			} else {
				charCount += node.nodeValue.length;
			}
		} else if (node.nodeType === Node.ELEMENT_NODE) {
			for (let child of node.childNodes) {
				recurse(child);
				if (found) return;
			}
		}
	}

	recurse(root);
	return charCount;
}

/**
 * Set caret position after the nth character in a contenteditable element.
 * @param {HTMLElement} root - The contenteditable element
 * @param {number} n - Character index (0-based)
 */
function setCaretAfterChar(root, n) {
	let charCount = 0;
	let range = document.createRange();
	let found = false;

	function recurse(node) {
		if (found) return;

		if (node.nodeType === Node.TEXT_NODE) {
			let textLength = node.nodeValue.length;
			if (charCount + textLength >= n) {
				// Caret is inside this text node
				let offset = n - charCount;
				range.setStart(node, offset);
				range.collapse(true);
				found = true;
				return;
			} else {
				charCount += textLength;
			}
		} else if (node.nodeType === Node.ELEMENT_NODE) {
			for (let child of node.childNodes) {
				recurse(child);
				if (found) return;
			}
		}
	}

	recurse(root);

	// If n is beyond total length, set at end
	if (!found) {
		range.selectNodeContents(root);
		range.collapse(false);
	}

	let sel = window.getSelection();
	sel.removeAllRanges();
	sel.addRange(range);
}

import type { SyntaxNode } from '@lezer/common';
import { Stack } from '@lezer/lr';
import { cstState } from 'src/state/cst';

const explainSection = document.getElementById('explain-section');

if (explainSection === null) {
	console.error("Could not find element with id 'explain-section'");
} else {
	const classList = explainSection.classList;

	function toggleSidebar() {
		classList.toggle('collapsed');
	}

	document.getElementById('explain-section-close-button')?.addEventListener('click', toggleSidebar);
	document.getElementById('explain-section-open-button')?.addEventListener('click', toggleSidebar);
}

const explainElement = document.getElementById('explain');

if (explainElement === null) {
	console.error("Could not find element with id 'explain'");
} else {
	cstState.subscribe((tree) => {
		// clear
		explainElement.innerHTML = '';

		// traverse
		let stack: HTMLElement[] = [explainElement];
		tree.iterate({
			enter(node) {
				// TODO
				// const element = document.createElement('div');
				// const parentElement = stack.at(-1);
				// if (parentElement === undefined) return false;
				// parentElement.appendChild(element);
				// stack.push(element);
			},
		});
	});
}

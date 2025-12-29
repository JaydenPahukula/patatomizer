import { cstState } from 'src/state/cst';
import { doWithElement } from 'src/util/dowithelement';

doWithElement('explain-section', (explainSectionElement) => {
	function toggleSidebar() {
		explainSectionElement.classList.toggle('collapsed');
	}

	document.getElementById('explain-section-close-button')?.addEventListener('click', toggleSidebar);
	document.getElementById('explain-section-open-button')?.addEventListener('click', toggleSidebar);
});

doWithElement('explain', (explainElement) => {
	cstState.subscribe((tree) => {
		if (tree === null) return;

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
});

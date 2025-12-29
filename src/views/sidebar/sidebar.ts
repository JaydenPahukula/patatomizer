import { doWithElement } from 'src/util/dowithelement';

doWithElement('sidebar', (sidebar) => {
	function toggleSidebar() {
		sidebar.classList.toggle('collapsed');
	}

	document.getElementById('sidebar-header-menu-button')?.addEventListener('click', toggleSidebar);
	document.getElementById('sidebar-header-x-button')?.addEventListener('click', toggleSidebar);
});

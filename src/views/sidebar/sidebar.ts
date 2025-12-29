const sidebar = document.getElementById('sidebar');

if (sidebar === null) {
	console.error("Could not find element with id 'sidebar'");
} else {
	const classList = sidebar.classList;

	function toggleSidebar() {
		classList.toggle('collapsed');
	}

	document.getElementById('sidebar-header-menu-button')?.addEventListener('click', toggleSidebar);
	document.getElementById('sidebar-header-x-button')?.addEventListener('click', toggleSidebar);
}

/** Call `fn` with the specified dom element if available, or logs an error the element could not be found */
export function doWithElement(id: string, fn: (element: HTMLElement) => void) {
	const element = document.getElementById(id);

	if (element === null) {
		console.error(`Could not find element with id '${id}'`);
	} else {
		fn(element);
	}
}

/** Call `fn` with the all the specified dom elements if available, or logs an error if any element could not be found */
export function doWithElements<const T extends Record<string, string>>(
	ids: T,
	fn: (elements: { [K in keyof T]: HTMLElement }) => void,
) {
	const elements = {} as { [K in keyof T]: HTMLElement };
	let ok = true;

	for (const key in ids) {
		const id = ids[key];
		const element = document.getElementById(id ?? '');
		if (!element) {
			console.error(`Could not find element with id '${id}'`);
			ok = false;
		} else {
			elements[key] = element;
		}
	}

	if (ok) {
		fn(elements);
	}
}

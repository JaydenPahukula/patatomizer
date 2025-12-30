type Handler<T> = (value: T) => void;

/** Generic state class */
export class State<T> {
	#value: T;
	#handlers = new Set<Handler<T>>();

	constructor(value: T) {
		this.#value = value;
	}

	get(): T {
		return this.#value;
	}

	set(value: T) {
		if (value === this.#value) return;

		this.#value = value;

		for (const fn of this.#handlers) fn(value);
	}

	subscribe(handler: Handler<T>) {
		this.#handlers.add(handler);
	}
}

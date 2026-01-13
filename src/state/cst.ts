import type { Tree } from '@lezer/common';
import { treeToString } from 'src/codemirror/util/treetostring';
import { State } from 'src/state/state';

/** Global state for the pattern concrete syntax tree */
export const cstState = new State<Tree | null>(null);

if (import.meta.env.DEV) {
	cstState.subscribe((tree) => {
		if (tree !== null) {
			console.log(treeToString(tree));
		}
	});
}

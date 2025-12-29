import type { Tree as Tree } from '@lezer/common';
import { State } from 'src/state/state';

/** Global state for the pattern concrete syntax tree */
export const cstState = new State<Tree | null>(null);
